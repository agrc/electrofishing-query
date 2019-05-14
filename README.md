# electrofishing-query
[![Build Status](https://travis-ci.com/agrc/electrofishing-query.svg?branch=master)](https://travis-ci.com/agrc/electrofishing-query)

A web application for viewing and querying electrofishing data.

# Deployment
1. [Disable standardized queries in ArcGIS Server](https://enterprise.arcgis.com/en/server/10.5/administer/windows/about-standardized-queries.htm).
1. Update `Electrofishing/MapService`:
    * Check "Allow per request modification of layer order and symbology" and register the SDE database as a dynamic workspace with the an ID of "ElectrofishingQuery".
    * Update Parameters -> Max Number of Records Returns from 1000 to 5000.
