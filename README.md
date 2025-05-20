# electrofishing-query

[![Pull Request Events](https://github.com/agrc/electrofishing-query/actions/workflows/pull_request.yml/badge.svg)](https://github.com/agrc/electrofishing-query/actions/workflows/pull_request.yml)
[![Push Events](https://github.com/agrc/electrofishing-query/actions/workflows/push.yml/badge.svg)](https://github.com/agrc/electrofishing-query/actions/workflows/push.yml)

A web application for viewing and querying electrofishing data.

Staging: [https://electrofishing-query.dev.utah.gov](https://electrofishing-query.dev.utah.gov)

Production: [https://electrofishing-query.ugrc.utah.gov](https://electrofishing-query.ugrc.utah.gov)

## Deployment

1. Update `Electrofishing/MapService`:
   - Check "Allow per request modification of layer order and symbology" and register the SDE database as a dynamic workspace with the an ID of "ElectrofishingQuery".
   - Update Parameters -> Max Number of Records Returns from 1000 to 5000.
1. Publish `scripts/Download.tbx/Download` as `Electrofishing/Download`:
   - asynchronous
   - message level: "info"
   - max time a client can use the service: `300`
   - Copy `scripts/swq_secrets.py`, `scripts/__init__.py`, `scripts/download.py`, & `scripts/sql/*` to `C:\arcgisserver\directories\arcgissystem\arcgisinput\Electrofishing\Download.GPServer\extracted\p20\scripts`
   - Update `swq_secrets.py` to reflect the environment that you have published to.
   - Download and install [Microsoft ODBC Driver 17 for SQL Server](https://www.microsoft.com/en-us/download/details.aspx?id=56567).

## Development

### Setup

1. Install the nodejs packages
   - `npm install && cd functions && npm install`
1. Create function secrets
   - `cd functions && cp .secret .secret.local`
   - fill in values in `.secret.local`
1. Copy the ArcGIS Maps SKD for JavaScript assets to the public folder. **This needs to be done anytime the arcgis package is updated.**
   - `npm run copy:arcgis`
1. Create `.env.local` files in the project root and the functions folders using the corresponding `.env` files as examples.
1. Start the development server
   - `npm start`

### Dependency Updates

`tailwindcss`, and `tailwindcss-react-aria-components` can't be updated until we migrate the design system to tailwind 4.
