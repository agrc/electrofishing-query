#!/usr/bin/env python
# * coding: utf8 *
'''
DownloadTool.py

An Esri Toolbox Tool wrapper for download.py.

input parameters:
0 - ids:String a semi-colon delimited list of sampling event ids

output parameters:
1 - zipfile:File the url to the .zip file for download
'''

from arcpy import GetParameterAsText, SetParameterAsText
from download import main


SetParameterAsText(2, main(GetParameterAsText(0), GetParameterAsText(1)))
