/* eslint-disable max-len, no-magic-numbers, camelcase */
define([
    'dojo/has',

    'esri/Color',
    'esri/config',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',

    'dojo/domReady!'
], function (
    has,

    Color,
    esriConfig,
    SimpleFillSymbol,
    SimpleLineSymbol
) {
    let agsDomain;
    // electrofishing-query.*.utah.gov
    let apiKey = 'AGRC-E029C84C956966';
    let quadWord;
    let databaseName = 'Electrofishing';
    let dataEntryApp = 'https://electrofishing.ugrc.utah.gov';
    let baseUrl;
    const projectId = JSON.parse(process.env.FIREBASE_CONFIG).projectId;
    if (has('agrc-build') === 'prod') {
        // *.ugrc.utah.gov
        quadWord = 'dinner-oregano-india-bahama';
        agsDomain = 'wrimaps.utah.gov';
        baseUrl = `https://us-central1-${projectId}.cloudfunctions.net/maps`;
    } else if (has('agrc-build') === 'stage') {
        // *.dev.utah.gov
        quadWord = 'wedding-tactic-enrico-yes';
        agsDomain = 'wrimaps.at.utah.gov';
        dataEntryApp = 'https://electrofishing.dev.utah.gov';
        baseUrl = `https://us-central1-${projectId}.cloudfunctions.net/maps`;
    } else {
        // localhost
        // agsDomain = window.location.host;
        agsDomain = 'localhost:5001';
        baseUrl = `http://${agsDomain}/${projectId}/us-central1/maps`;

        quadWord = process.env.QUAD_WORD;
        apiKey = process.env.API_KEY;
    }

    // force api to use CORS on udwrgis thus removing the test request on app load
    // e.g. http://wrimaps.utah.gov/ArcGIS/rest/info?f=json
    esriConfig.defaults.io.corsEnabledServers.push(agsDomain);

    const drawingColor = [51, 160, 44];
    const STATION_ID = 'STATION_ID';
    window.AGRC = {
        // app: app.App
        //      global reference to App
        app: null,

        agsDomain,

        dataEntryApp,

        databaseName,

        // version.: String
        //      The version number.
        version: '1.0.2-0',

        // apiKey: String
        //      The api key used for services on api.mapserv.utah.gov
        apiKey, // acquire at developer.mapserv.utah.gov

        // quadWord: String
        //      For use with discover services
        quadWord,

        // stationsDisplayLimit: Number
        //      The max number of stations that the app will display
        stationsDisplayLimit: 1000,

        // dynamicWorkspaceId: String
        dynamicWorkspaceId: 'ElectrofishingQuery',

        wkids: {
            webMercator: 3857
        },

        urls: {
            baseUrl,
            mapService: baseUrl + '/mapservice',
            referenceService: baseUrl + '/reference',
            download: baseUrl + '/toolbox/Download',
            esriStreets: '//server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
        },

        minFeatureLayerScale: 500000,
        popupOpacity: 0.85,
        validateDelay: 300,
        drawingSymbol: new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol()
                .setColor(new Color(drawingColor)),
            new Color(drawingColor.concat([0.25]))
        ),

        fieldNames: {
            // common
            STATION_ID,

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
            // eslint-disable-next-line camelcase
            Permanent_Identifier: 'Permanent_Identifier',
            ReachCode: 'ReachCode',
            COUNTY: 'COUNTY'
        },

        tableNames: {
            events: 'SamplingEvents_evw',
            stations: 'Stations_evw',
            fish: 'Fish_evw',
            streams: 'UDWRStreams',
            lakes: 'UDWRLakes'
        },

        layerIndexes: {
            stations: 0,
            events: 1,
            streams: 0,
            lakes: 1,
            fish: 2
        },

        topics: {
            filterFeatures: 'electrofishing-filter-features',
            addGraphic: 'electrofishing-add-graphic',
            removeGraphic: 'electrofishing-remove-graphic',
            queryIdsComplete: 'electrofishing-query-ids-complete',
            clearStationSelection: 'electrofishing-clear-station-selection',
            toggleGrid: 'electrofishing-toggle-grid',
            toast: 'electrofishing-toast',
            pauseMapClick: 'electrofishing-pause-map-click',
            resumeMapClick: 'electrofishing-resume-map-click',
            showLimitMessage: 'electrofishing-show-limit-message',
            gridSelectionChanged: 'electrofishing-grid-selection-changed',
            mapSelectionChanged: 'electrofishing-map-selection-changed'
        }
    };

    return window.AGRC;
});
