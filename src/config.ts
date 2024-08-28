if (!import.meta.env.VITE_DATABASE_CONFIG) {
  throw new Error('VITE_DATABASE_CONFIG must be set in .env');
}
const databaseSecrets: { databaseName: string; user: string } = JSON.parse(import.meta.env.VITE_DATABASE_CONFIG);

// TODO: this should come from an env var once we get UtahID wired up
const arcgisServerHost = 'wrimaps.utah.gov';
const mapService = `https://${arcgisServerHost}/arcgis/rest/services/Electrofishing/Public/MapServer`;

const config = {
  MIN_DESKTOP_WIDTH: 768,
  WEB_MERCATOR_WKID: 3857,
  MARKER_FILL_COLOR: [234, 202, 0, 0.5],
  MARKER_OUTLINE_COLOR: [77, 42, 84, 1],
  databaseSecrets,

  fieldNames: {
    // common
    STATION_ID: 'STATION_ID',

    // Stations
    NAME: 'NAME',
    STREAM_TYPE: 'STREAM_TYPE',
    WATER_ID: 'WATER_ID',

    // SamplingEvents
    EVENT_ID: 'EVENT_ID',
    SURVEY_PURPOSE: 'SURVEY_PURPOSE',
    EVENT_DATE: 'EVENT_DATE',
    OBSERVERS: 'OBSERVERS',

    // Fish
    SPECIES: 'SPECIES', // dynamic field created via SQL query in AGSStores
    SPECIES_CODE: 'SPECIES_CODE',
    LENGTH: 'LENGTH',

    // Equipment
    TYPES: 'TYPES', // dynamic field created via SQL query in AGSStores

    // Streams/Lakes
    WaterName: 'WaterName',
    DWR_WaterID: 'DWR_WaterID',
    Permanent_Identifier: 'Permanent_Identifier',
    ReachCode: 'ReachCode',
    COUNTY: 'COUNTY',
  },

  tableNames: {
    events: 'SamplingEvents_evw',
    stations: 'Stations_evw',
    fish: 'Fish_evw',
    streams: 'UDWRStreams',
    lakes: 'UDWRLakes',
  },

  urls: {
    stations: `${mapService}/0`,
    events: `${mapService}/1`,
    fish: `${mapService}/2`,
    landownership:
      'https://gis.trustlands.utah.gov/hosting/rest/services/Hosted/Land_Ownership_WM_VectorTile/VectorTileServer',
  },
};

export default config;
