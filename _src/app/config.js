/* eslint-disable max-len, no-magic-numbers */
define([
    'dojo/has',
    'dojo/request/xhr',

    'esri/Color',
    'esri/config',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleMarkerSymbol',

    'dojo/domReady!'
], function (
    has,
    xhr,

    Color,
    esriConfig,
    SimpleFillSymbol,
    SimpleLineSymbol,
    SimpleMarkerSymbol
) {
    let agsDomain = 'udwrgis.utah.gov';
    let apiKey;
    let quadWord = 'patent-window-address-asia';
    let servicesFolder = 'Electrofishing';
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
    }

    // force api to use CORS on udwrgis thus removing the test request on app load
    // e.g. http://udwrgis.utah.gov/ArcGIS/rest/info?f=json
    esriConfig.defaults.io.corsEnabledServers.push(agsDomain);

    const baseUrl = `${window.location.protocol}//${agsDomain}/arcgis/rest/services/${servicesFolder}`;
    const drawingColor = [51, 160, 44];
    const selectionColor = [52, 208, 231];
    const StationId = 'StationId';
    window.AGRC = {
        // app: app.App
        //      global reference to App
        app: null,

        // appName: String
        //      for permissions proxy
        appName: 'ugschemistry',

        agsDomain: agsDomain,

        // version.: String
        //      The version number.
        version: '0.1.0',

        // apiKey: String
        //      The api key used for services on api.mapserv.utah.gov
        apiKey: apiKey, // acquire at developer.mapserv.utah.gov

        // quadWord: String
        //      For use with discover services
        quadWord: quadWord,

        // stationsDisplayLimit: Number
        //      The max number of stations that the app will display
        stationsDisplayLimit: 1000,

        wkids: {
            webMercator: 3857
        },

        urls: {
            baseUrl: baseUrl,
            mapService: baseUrl + '/MapService/MapServer',
            referenceService: baseUrl + '/Reference/MapServer',
            download: baseUrl + '/Toolbox/GPServer/Download',
            esriStreets: '//server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
        },

        minFeatureLayerScale: 500000,
        stationSymbolSize: 9,
        drawingSymbol: new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol()
                .setColor(new Color(drawingColor)),
            new Color(drawingColor.concat([0.25]))
        ),
        selectionSymbol: new SimpleMarkerSymbol()
            .setColor(new Color(selectionColor))
            .setSize(12),

        fieldNames: {
            // Stations
            // SamplingEvents
            // Streams
            WaterName: 'WaterName'
        },

        queryByResults: StationId + ' IN (SELECT ' + StationId + ' FROM ugswaterchemistry.Results WHERE ',

        layerIndexes: {
            stations: 0,
            events: 1,
            streams: 0,
            lakes: 1
        },

        topics: {
            filterFeatures: 'ugs-filter-features',
            addGraphic: 'ugs-add-graphic',
            removeGraphic: 'ugs-remove-graphic',
            queryIdsComplete: 'ugs-query-ids-complete',
            clearStationSelection: 'ugs-clear-station-selection',
            toggleGrid: 'ugs-toggle-grid',
            toast: 'ugs-toast',
            pauseMapClick: 'ugs-pause-map-click',
            resumeMapClick: 'ugs-resume-map-click',
            showLimitMessage: 'ugs-show-limit-message'
        },

        counties: [
            ['Beaver', 49001],
            ['Box Elder', 49003],
            ['Cache', 49005],
            ['Carbon', 49007],
            ['Daggett', 49009],
            ['Davis', 49011],
            ['Duchesne', 49013],
            ['Emery', 49015],
            ['Garfield', 49017],
            ['Grand', 49019],
            ['Iron', 49021],
            ['Juab', 49023],
            ['Kane', 49025],
            ['Millard', 49027],
            ['Morgan', 49029],
            ['Piute', 49031],
            ['Rich', 49033],
            ['Salt Lake', 49035],
            ['San Juan', 49037],
            ['Sanpete', 49039],
            ['Sevier', 49041],
            ['Summit', 49043],
            ['Tooele', 49045],
            ['Uintah', 49047],
            ['Utah', 49049],
            ['Wasatch', 49051],
            ['Washington', 49053],
            ['Wayne', 49055],
            ['Weber', 49057]
        ],
        states: [
            ['Utah', 49],
            ['Idaho', 16],
            ['Wyoming', 56],
            ['Colorado', 8],
            ['New Mexico', 35],
            ['Arizona', 4],
            ['Nevada', 32]
        ],
        siteTypes: [
            ['Atmosphere', 'Atmosphere'],
            ['Facility', 'Facility'],
            ['Lake, Reservoir,  Impoundment', 'Lake, Reservoir,  Impoundment'],
            ['Land', 'Land'],
            ['Other Groundwater', 'Other Groundwater'],
            ['Other', 'Other'],
            ['Spring', 'Spring'],
            ['Stream', 'Stream'],
            ['Surface Water', 'Surface Water'],
            ['Well', 'Well'],
            ['Wetland', 'Wetland']
        ],
        parameterGroups: [
            ['Information', 'Information'],
            ['Inorganics, Minor, Metals', 'Inorganics, Minor, Metals'],
            ['Inorganics, Major, Metals', 'Inorganics, Major, Metals'],
            ['Stable Isotopes', 'Stable Isotopes'],
            ['Inorganics, Minor, Non-metals', 'Inorganics, Minor, Non-metals'],
            ['Organics, other', 'Organics, other'],
            ['Microbiological', 'Microbiological'],
            ['Biological', 'Biological'],
            ['Nutrient', 'Nutrient'],
            ['Inorganics, Major, Non-metals', 'Inorganics, Major, Non-metals'],
            ['Radiochemical', 'Radiochemical'],
            ['Organics, pesticide', 'Organics, pesticide'],
            ['Organics, PCBs', 'Organics, PCBs'],
            ['Toxicity', 'Toxicity'],
            ['Sediment', 'Sediment'],
            ['Physical', 'Physical']
        ],
        dataSources: [
            ['DOGM', 'DOGM'],
            ['DWR', 'DWR'],
            ['SDWIS', 'SDWIS'],
            ['UGS', 'UGS'],
            ['WQP', 'WQP']
        ],
        chartMsgTxt: 'Showing ${0} results from ${1} stations.'
    };

    xhr(require.baseUrl + 'secrets.json', {
        handleAs: 'json',
        sync: true
    }).then(function (secrets) {
        window.AGRC.quadWord = secrets.quadWord;
        window.AGRC.apiKey = secrets.apiKey;
    }, function () {
        throw 'Error getting secrets!';
    });

    return window.AGRC;
});
