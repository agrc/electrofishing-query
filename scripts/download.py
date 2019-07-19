#!/usr/bin/env python
# * coding: utf8 *
'''
download.py

A script that downloads CSVs of electrofishing data for a given
set of sampling event ids.
'''
import csv
import secrets
import sys
from glob import glob
from os import mkdir, walk, sep
from os.path import basename, dirname, exists, join, realpath, normpath
from shutil import rmtree
from zipfile import ZIP_DEFLATED, ZipFile

import arcpy
import pypyodbc


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


def main(ids):
    #: ids: string
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

    connection = pypyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};' +
                                  'SERVER={};DATABASE={};UID={};PWD={}'.format(
                                      secrets.SERVER, secrets.DATABASE,
                                      secrets.USERNAME, secrets.PASSWORD))
    cursor = connection.cursor()

    with ZipFile(zip_file_path, 'w', ZIP_DEFLATED) as zip_file:
        #: fgdb
        arcpy.AddMessage('creating file geodatabase')
        fgdb = join(arcpy.env.scratchFolder, 'geometry.gdb')
        if arcpy.Exists(fgdb):
            arcpy.management.Delete(fgdb)
        arcpy.management.CreateFileGDB(dirname(fgdb), basename(fgdb))

        arcpy.AddMessage('copying sampling events feature class')
        events_where = 'EVENT_ID IN ({})'.format(formatted_ids)
        events_layer = arcpy.management.MakeFeatureLayer(join(sde, 'SamplingEvents'), 'events_layer', events_where)
        arcpy.management.CopyFeatures(events_layer, join(fgdb, 'SamplingEvents'))

        arcpy.AddMessage('copying stations feature class')
        stations_where = 'STATION_ID IN (SELECT STATION_ID FROM {}.WILDADMIN.SamplingEvents_evw where {})'.format(
            secrets.DATABASE, events_where)
        stations_layer = arcpy.management.MakeFeatureLayer(join(sde, 'Stations'), 'stations_layer', stations_where)
        arcpy.management.CopyFeatures(stations_layer, join(fgdb, 'Stations'))

        zip_fgdb(fgdb, zip_file)

        #: csvs
        for query_file in glob(sql_directory + '\*.sql'):
            csv_name = basename(query_file).replace('sql', 'csv')
            arcpy.AddMessage(csv_name)
            with open(query_file, 'r') as file:
                query = file.read().format(secrets.DATABASE, formatted_ids)
                cursor.execute(query)

                csv_file_path = join(arcpy.env.scratchFolder, csv_name)
                with open(csv_file_path, 'w') as csv_file:
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
    main(sys.argv[1])
