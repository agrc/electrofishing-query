#!/usr/bin/env python
# * coding: utf8 *
'''
download.py

A script that downloads CSVs of electrofishing data for a given
set of sampling event ids.
'''
import csv
import sys
from glob import glob
from os import sep, walk
from os.path import basename, dirname, join, normpath, realpath
from zipfile import ZIP_DEFLATED, ZipFile

import arcpy
import pyodbc
import swq_secrets as secrets


def zip_fgdb(path, zip):
    path = normpath(path)
    for (dirpath, dirnames, filenames) in walk(path):
        for file in filenames:
            # Ignore .lock files
            if not file.endswith('.lock'):
                try:
                    zip.write(
                        join(dirpath, file),
                        join(basename(path),
                             join(dirpath, file)[len(path) + len(sep):]))

                except Exception as e:
                    arcpy.AddWarning(
                        'error zipping file geodatabase: {}'.format(e))
    return None

cardinality_lookup = {
    'OneToOne': 'ONE_TO_ONE',
    'OneToMany': 'ONE_TO_MANY'
}

def main(ids, type):
    #: ids: string
    #: type: string (csv or fgdb)
    #: returns a path to the zip file
    ids = ids.split(';')
    arcpy.AddMessage('ids: {}'.format(ids))
    formatted_ids = '\'{}\''.format('\',\''.join(ids))

    current_folder = dirname(realpath(__file__))
    sql_directory = join(current_folder, 'sql')
    zip_file_path = join(arcpy.env.scratchFolder, 'data.zip')
    sde_file_name = 'DATABASE.sde'
    sde = join(current_folder, sde_file_name)
    arcpy.AddMessage('scratch folder: ' + arcpy.env.scratchFolder)

    if not arcpy.Exists(sde):
        arcpy.management.CreateDatabaseConnection(
            current_folder,
            sde_file_name,
            'SQL_SERVER',
            secrets.SERVER,
            account_authentication='DATABASE_AUTH',
            username=secrets.USERNAME,
            password=secrets.PASSWORD,
            database=secrets.DATABASE)

    connection = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};' +
                                  'SERVER={};DATABASE={};UID={};PWD={}'.format(
                                      secrets.SERVER, secrets.DATABASE,
                                      secrets.USERNAME, secrets.PASSWORD))
    cursor = connection.cursor()

    with ZipFile(zip_file_path, 'w', ZIP_DEFLATED) as zip_file:
        if type == 'fgdb':
            #: fgdb
            arcpy.AddMessage('creating file geodatabase')
            fgdb = join(arcpy.env.scratchFolder, 'data.gdb')
            if arcpy.Exists(fgdb):
                arcpy.management.Delete(fgdb)
            arcpy.management.CreateFileGDB(dirname(fgdb), basename(fgdb))

            arcpy.AddMessage('copying sampling events feature class')
            events_where = 'EVENT_ID IN ({})'.format(formatted_ids)
            events_layer = arcpy.management.MakeFeatureLayer(join(sde, 'SamplingEvents'), 'events_layer', events_where)
            arcpy.management.CopyFeatures(events_layer, join(fgdb, 'SamplingEvents'))

            arcpy.AddMessage('copying stations feature class')
            stations_where = f'STATION_ID IN (SELECT STATION_ID FROM {secrets.DATABASE}.{secrets.USERNAME}.SamplingEvents_evw where {events_where})'
            stations_layer = arcpy.management.MakeFeatureLayer(join(sde, 'Stations'), 'stations_layer', stations_where)
            arcpy.management.CopyFeatures(stations_layer, join(fgdb, 'Stations'))

            arcpy.AddMessage('copying streams feature class')
            stations_where = f'Permanent_Identifier IN (SELECT WATER_ID FROM {secrets.DATABASE}.{secrets.USERNAME}.Stations_evw where {stations_where})'
            streams_layer = arcpy.management.MakeFeatureLayer(join(sde, 'UDWRStreams'), 'streams_layer', stations_where)
            arcpy.management.CopyFeatures(streams_layer, join(fgdb, 'UDWRStreams'))

            arcpy.AddMessage('copying lakes feature class')
            stations_where = f'Permanent_Identifier IN (SELECT WATER_ID FROM {secrets.DATABASE}.{secrets.USERNAME}.Stations_evw where {stations_where})'
            lakes_layer = arcpy.management.MakeFeatureLayer(join(sde, 'UDWRLakes'), 'lakes_layer', stations_where)
            arcpy.management.CopyFeatures(lakes_layer, join(fgdb, 'UDWRLakes'))

            def copy_related_tables(dataset):
                relationship_classes = arcpy.Describe(join(sde, dataset)).relationshipClassNames
                for relationship_class in relationship_classes:
                    describe = arcpy.Describe(join(sde, relationship_class))

                    destination = describe.destinationClassNames[0]

                    primary_key = describe.originClassKeys[0][0]
                    foreign_key = describe.originClassKeys[1][0]
                    destination_is_table = arcpy.Describe(join(sde, destination)).datasetType == 'Table'
                    if destination.split('.')[-1] != dataset and destination_is_table:
                        arcpy.AddMessage('copying {} table'.format(destination))
                        where = f'{foreign_key} IN (SELECT {primary_key} FROM {secrets.DATABASE}.{secrets.USERNAME}.{dataset} where {events_where})'
                        layer = arcpy.management.MakeTableView(join(sde, destination), destination + '_layer', where)
                        arcpy.management.CopyRows(layer, join(fgdb, destination.split('.')[-1]))

                    if arcpy.Exists(join(fgdb, relationship_class.split('.')[-1])):
                        continue
                    arcpy.AddMessage('creating {} relationship class'.format(relationship_class))
                    arcpy.env.workspace = fgdb
                    origin = describe.originClassNames[0].split('.')[-1]
                    cardinality = describe.cardinality
                    arcpy.management.CreateRelationshipClass(
                        origin,
                        destination.split('.')[-1],
                        relationship_class.split('.')[-1],
                        'SIMPLE',
                        describe.forwardPathLabel,
                        describe.backwardPathLabel,
                        message_direction='BOTH',
                        cardinality=cardinality_lookup[cardinality],
                        origin_primary_key=primary_key,
                        origin_foreign_key=foreign_key
                    )
                    arcpy.env.workspace = None

                    if destination_is_table:
                        copy_related_tables(destination.split('.')[-1])

            copy_related_tables('SamplingEvents')
            copy_related_tables('Stations')

            zip_fgdb(fgdb, zip_file)

        else:
            #: csvs
            for query_file in glob(sql_directory + '\*.sql'):
                csv_name = basename(query_file).replace('sql', 'csv')
                arcpy.AddMessage(csv_name)
                with open(query_file, 'r') as file:
                    query = file.read().format(secrets.DATABASE, formatted_ids, secrets.USERNAME)
                    cursor.execute(query)

                    csv_file_path = join(arcpy.env.scratchFolder, csv_name)
                    with open(csv_file_path, 'w', newline='') as csv_file:
                        writer = csv.writer(csv_file)

                        #: write headers
                        writer.writerow([x[0] for x in cursor.description])

                        for row in cursor:
                            writer.writerow(row)

                zip_file.write(csv_file_path, csv_name)

    arcpy.AddMessage(zip_file_path)

    connection.close()
    del connection

    return zip_file_path


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
