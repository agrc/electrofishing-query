/* eslint-disable max-len, no-magic-numbers, camelcase */
define([
    'dojo/has',
    'dojo/request/xhr',

    'esri/Color',
    'esri/config',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',

    'dojo/domReady!'
], function (
    has,
    xhr,

    Color,
    esriConfig,
    SimpleFillSymbol,
    SimpleLineSymbol
) {
    let agsDomain = 'udwrgis.utah.gov';
    let apiKey;
    let quadWord = 'patent-window-address-asia';
    let servicesFolder = 'Electrofishing';
    let databaseName = 'Wildlife';
    if (has('agrc-build') === 'prod') {
        // dwrapps.utah.gov
        apiKey = 'AGRC-2E4D1DBA263288';
    } else if (has('agrc-build') === 'stage') {
        // dwrapps.dev.utah.gov
        apiKey = 'AGRC-FC693CC1911383';
        servicesFolder = 'ElectrofishingTest';
    } else {
        // localhost
        agsDomain = window.location.host;
        databaseName = 'Electrofishing';

        xhr(require.baseUrl + 'secrets.json', {
            handleAs: 'json',
            sync: true
        }).then(function (secrets) {
            quadWord = secrets.quadWord;
            apiKey = secrets.apiKey;
        }, function () {
            throw 'Error getting secrets!';
        });
    }

    // force api to use CORS on udwrgis thus removing the test request on app load
    // e.g. http://udwrgis.utah.gov/ArcGIS/rest/info?f=json
    esriConfig.defaults.io.corsEnabledServers.push(agsDomain);

    const baseUrl = `${window.location.protocol}//${agsDomain}/arcgis/rest/services/${servicesFolder}`;
    const drawingColor = [51, 160, 44];
    const STATION_ID = 'STATION_ID';
    window.AGRC = {
        // app: app.App
        //      global reference to App
        app: null,

        agsDomain,

        databaseName,

        // version.: String
        //      The version number.
        version: '0.10.0',

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
            mapService: baseUrl + '/MapService/MapServer',
            referenceService: baseUrl + '/Reference/MapServer',
            download: baseUrl + '/Download/GPServer/Download',
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
            events: 'SamplingEvents',
            stations: 'Stations',
            fish: 'Fish',
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
