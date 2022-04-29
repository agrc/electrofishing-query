# electrofishing-query [![Build Status](https://travis-ci.com/agrc/electrofishing-query.svg?branch=master)](https://travis-ci.com/agrc/electrofishing-query)

A web application for viewing and querying electrofishing data.

Staging: [https://dwrapps.dev.utah.gov/dwrefdb/query/](https://dwrapps.dev.utah.gov/dwrefdb/query/)

Production: [https://dwrapps.utah.gov/dwrefdb/query/](https://dwrapps.utah.gov/dwrefdb/query/)

## Deployment

1. Update `Electrofishing/MapService`:
    * Check "Allow per request modification of layer order and symbology" and register the SDE database as a dynamic workspace with the an ID of "ElectrofishingQuery".
    * Update Parameters -> Max Number of Records Returns from 1000 to 5000.
1. Publish `scripts/Download.tbx/Download` as `Electrofishing/Download`:
    * asynchronous
    * max time a client can use the service: `300`
    * Copy `scripts/secrets.py`, `scripts/download.py`, & `scripts/sql/*` to `C:\arcgisserver\directories\arcgissystem\arcgisinput\Electrofishing\Download.GPServer\extracted\p20\scripts`
    * Update `swq_secrets.py` to reflect the environment that you have published to.
    * Download and install [Microsoft ODBC Driver 17 for SQL Server](https://www.microsoft.com/en-us/download/details.aspx?id=56567).

## Cutting a New Release

1. Update `src/ChangeLog.html`
1. `grunt bump`
1. Pushing to `dev` or `main` triggers a deploy to Firebase.
