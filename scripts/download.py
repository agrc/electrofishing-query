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
from os import mkdir
from os.path import basename, dirname, exists, join, realpath
from shutil import rmtree
from zipfile import ZIP_DEFLATED, ZipFile

import arcpy
import pyodbc


def main(ids):
  #: ids: string
  #: returns a path to the zip file
  ids = ids.split(';')
  arcpy.AddMessage('ids: {}'.format(ids))

  current_folder = dirname(realpath(__file__))
  sql_directory = join(current_folder, 'sql')
  output_folder = arcpy.env.scratchFolder
  zip_file_path = join(output_folder, 'data.zip')
  connection = pyodbc.connect(
    'DRIVER={SQL Server};SERVER=(local);DATABASE=ELECTROFISHING;' + 'UID={0};PWD={1}'.format(
      secrets.USERNAME, secrets.PASSWORD))
  cursor = connection.cursor()

  with ZipFile(zip_file_path, 'w', ZIP_DEFLATED) as zip_file:
    for query_file in glob(sql_directory + '\*.sql'):
      csv_name = basename(query_file).replace('sql', 'csv')
      arcpy.AddMessage(csv_name)
      with open(query_file, 'r') as file:
        query = file.read().replace('\'<ids>\'', '\'{}\''.format('\',\''.join(ids)))
        cursor.execute(query)

        csv_file_path = join(output_folder, csv_name)
        with open(csv_file_path, 'wb') as csv_file:
          writer = csv.writer(csv_file)
          writer.writerow([x[0] for x in cursor.description])
          for row in cursor:
            writer.writerow(row)

      zip_file.write(csv_file_path, csv_name)

  arcpy.AddMessage(zip_file_path)
  return zip_file_path


if __name__ == "__main__":
  main(sys.argv[1])
