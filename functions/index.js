import initProxy from '@ugrc/firebase-auth-arcgis-server-proxy';
import 'dotenv/config';
import { onRequest } from 'firebase-functions/v2/https';

const options = {
  host: process.env.AGS_HOST,
  verbose: !!process.env.FIREBASE_FUNCTIONS_EMULATOR,
  mappings: [
    {
      // the optional /maps prefix is to support the maps rewrite rule in firebase.json
      from: /^(\/maps)?\/toolbox\//,
      to: '/arcgis/rest/services/Electrofishing/Download/GPServer/',
      secrets: 'ARCGIS_SERVER_CREDENTIALS',
    },
    {
      from: /^(\/maps)?\/feature\//,
      to: '/arcgis/rest/services/Electrofishing/MapService/FeatureServer/',
      secrets: 'ARCGIS_SERVER_CREDENTIALS',
    },
    {
      from: /^(\/maps)?\/reference\//,
      to: '/arcgis/rest/services/Electrofishing/Reference/MapServer/',
      secrets: 'ARCGIS_SERVER_CREDENTIALS',
    },
  ],
  claimsCheck: (claims) => {
    if (process.env.FUNCTIONS_EMULATOR) {
      return true;
    }

    const utahIDEnvironments = {
      prod: 'Prod',
      dev: 'AT',
      local: 'Dev',
    };

    return (
      claims.firebase?.sign_in_attributes?.['DWRElectroFishing:AccessGranted'] &&
      claims.firebase.sign_in_attributes['DWRElectroFishing:AccessGranted'].includes(
        utahIDEnvironments[process.env.ENVIRONMENT],
      )
    );
  },
};

const [proxy, secrets] = initProxy(options);

export const maps = onRequest({ secrets, invoker: 'public' }, proxy);
