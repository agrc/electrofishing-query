define([
    'agrc/widgets/map/BaseMap',

    'app/config',
    'app/queryHelpers',

    'dojo/Deferred',
    'dojo/dom-style',
    'dojo/on',
    'dojo/topic',
    'dojo/_base/lang',

    'dijit/popup',
    'dijit/TooltipDialog',

    'esri/graphic',
    'esri/graphicsUtils',
    'esri/layers/ArcGISTiledMapServiceLayer',
    'esri/layers/FeatureLayer',
    'esri/renderers/SimpleRenderer',
    'esri/tasks/IdentifyParameters', 'esri/tasks/IdentifyTask',
    'esri/tasks/query',

    'layer-selector/LayerSelector'
], function (
    BaseMap,

    config,
    queryHelpers,

    Deferred,
    domStyle,
    on,
    topic,
    lang,

    dijitPopup,
    TooltipDialog,

    Graphic,
    graphicsUtils,
    ArcGISTiledMapServiceLayer,
    FeatureLayer,
    SimpleRenderer,
    IdentifyParameters,
    IdentifyTask,
    Query,

    LayerSelector
) {
    return {
        // map: BaseMap
        map: null,

        // dLayer: ArcGISDynamicMapServiceLayer
        //      layer that is displayed at smaller scales
        dLayer: null,

        // fLayer: FeatureLayer
        //      layer that is displayed at larger scales
        fLayer: null,

        // layerEventHandlers: Object[]
        layerEventHandlers: [],

        // identifyTask: IdentifyTask
        identifyTask: null,

        // selectedStationId: Number
        //      The id of the currently selected station if there is one
        selectedStationId: null,

        // mapClickHandler: Object
        //      Used to pause this event during polygon draw
        mapClickHandler: null,

        securityLevels: {
            open: 'open',
            secure: 'secure'
        },

        initMap: function (mapDiv) {
            // summary:
            //      Sets up the map
            // mapDiv: Node
            console.info('app/mapController:initMap', arguments);

            var that = this;

            this.map = new BaseMap(mapDiv, {
                useDefaultBaseMap: false
            });
            var ls = new LayerSelector({
                map: this.map,
                quadWord: config.quadWord,
                baseLayers: [
                    'Hybrid',
                    {
                        url: config.urls.esriStreets,
                        Factory: ArcGISTiledMapServiceLayer,
                        id: 'Esri Streets'
                    },
                    'Terrain',
                    'Topo'
                ]
            });
            ls.startup();

            this.initLayers();

            topic.subscribe(config.topics.filterFeatures, this.filterFeatures.bind(this));
            topic.subscribe(config.topics.addGraphic, function (geo) {
                that.map.graphics.clear();
                that.map.graphics.add(new Graphic(geo, config.drawingSymbol));
            });
            topic.subscribe(config.topics.removeGraphic, function () {
                that.map.graphics.clear();
            });
            topic.subscribe(config.topics.clearStationSelection, lang.hitch(this, 'clearStationSelection'));

            this.mapClickHandler = on.pausable(this.map, 'click', lang.hitch(this, 'onMapClick'));
            topic.subscribe(config.topics.pauseMapClick, lang.hitch(this.mapClickHandler, 'pause'));
            topic.subscribe(config.topics.resumeMapClick, lang.hitch(this.mapClickHandler, 'resume'));
        },
        initLayers: function () {
            // summary:
            //      description
            console.log('app.mapController:initLayers', arguments);

            const fLayerUrl = config.urls.mapService;

            if (this.layerEventHandlers.length > 0) {
                this.map.removeLayer(this.fLayer);
            }

            this.fLayer = new FeatureLayer(`${fLayerUrl}/${config.layerIndexes.stations}`, {
                outFields: [config.fieldNames.NAME, config.fieldNames.STREAM_TYPE],
                visible: false
            });
            this.fLayer.setRenderer(new SimpleRenderer(config.stationSymbol));
            this.fLayer.setSelectionSymbol(config.selectionSymbol);
            this.layerEventHandlers.push(this.fLayer.on('click', (evt) => {
                this.clearStationSelection();
                this.selectStation(evt.graphic);
                evt.stopPropagation();
            }));
            this.map.addLayer(this.fLayer);
            this.map.addLoaderToLayer(this.fLayer);

            this.queryFLayer = new FeatureLayer(this.fLayer.url);
            this.layerEventHandlers.push(
                this.queryFLayer.on('query-ids-complete', this.queryIdsComplete.bind(this))
            );
            this.layerEventHandlers.push(
                this.fLayer.on('mouse-over', this.onMouseOverStationGraphic.bind(this)),
                this.fLayer.on('mouse-out', () => dijitPopup.close(this.popup))
            );

            topic.subscribe(config.topics.gridSelectionChanged, stationIds => {
                if (stationIds.length === 0) {
                    return;
                }

                const query = new Query();
                query.where = `${config.fieldNames.STATION_ID} IN ('${stationIds.join('\', \'')}')`;
                this.fLayer.selectFeatures(query);
            });

            this.popup = new TooltipDialog();
            this.popup.startup();
        },
        onMouseOverStationGraphic(evt) {
            // summary:
            //      user has moused over a station graphic
            //      show a popup
            console.log('app/mapController:onMouseOverStationGraphic', arguments);

            const data = event.graphic.attributes;
            const content = `<b>Name:</b> ${data[config.fieldNames.NAME]}<br>
                <b>Type:</b> ${data[config.fieldNames.STREAM_TYPE]}`;
            this.popup.set('content', content);
            domStyle.set(this.popup.domNode, 'opacity', config.popupOpacity);
            dijitPopup.open({
                popup: this.popup,
                x: evt.pageX,
                y: evt.pageY
            });
        },
        onMapClick: function (evt) {
            // summary:
            //      user clicks on the map
            //      query for feature from dynamic service and update selection accordingly
            // evt: Event Object
            console.log('app.mapController:onMapClick', arguments);

            var that = this;

            if (this.map.getScale() >= config.minFeatureLayerScale) {
                var identifyParams = new IdentifyParameters();
                lang.mixin(identifyParams, {
                    geometry: evt.mapPoint,
                    height: this.map.height,
                    layerDefinitions: this.dLayer.layerDefinitions,
                    layerIds: [0],
                    mapExtent: this.map.extent,
                    returnGeometry: true,
                    tolerance: 7,
                    width: this.map.width
                });

                if (!this.identifyTask) {
                    this.identifyTask = new IdentifyTask(config.urls.mapService);
                    this.identifyTask.on('complete', function processResults(resultsEvt) {
                        that.clearStationSelection();
                        if (resultsEvt.results.length > 0) {
                            that.selectStation(resultsEvt.results[0].feature);
                        } else {
                            that.clearStationSelection();
                        }
                    });
                    this.identifyTask.on('error', function processError(errorEvt) {
                        console.error(errorEvt.error);
                        that.clearStationSelection();
                    });
                }

                this.identifyTask.execute(identifyParams);
            } else {
                this.clearStationSelection();
            }
        },
        clearStationSelection: function () {
            // summary:
            //      description
            // param or return
            console.log('app.mapController:clearStationSelection', arguments);

            if (this.map.graphics) {
                this.map.graphics.clear();
            }
            this.selectedStationId = null;
            this.updateLayerDefs([{
                table: config.tableNames.stations,
                where: this.fLayer.getDefinitionExpression()
            }]);
            this.fLayer.clearSelection();
        },
        selectStation: function (feature) {
            // summary:
            //      description
            // param or return
            console.log('app.mapController:selectStation', arguments);

            this.map.graphics.add(new Graphic(feature.geometry, config.selectionSymbol));
            this.selectedStationId = feature.attributes[config.fieldNames.STATION_ID];
            // TODO - fix this
            this.updateLayerDefs(this.fLayer.getDefinitionExpression() || config.showAllQuery);
        },
        filterFeatures: function (filterQueryInfos, geometry) {
            // summary:
            //      selects stations on the map
            //      applies selection to fLayer
            // filterQueryInfos[optional]: String[]
            //      select by definition queries
            // geometry[optional]: Polygon
            //      select by geometry
            console.log('app/mapController:filterFeatures', arguments);

            if (filterQueryInfos && filterQueryInfos.length > 0 || geometry) {
                this.map.showLoader();

                const where = queryHelpers.getStationQuery(filterQueryInfos);

                this.checkLimit(where, geometry).then(query => {
                    if (geometry) {
                        // only query for ids if there is a geometry
                        this.queryFLayer.queryIds(query);
                    } else {
                        this.updateLayerDefs(filterQueryInfos);
                    }
                }, () => {
                    topic.publish(config.topics.showLimitMessage);
                    this.updateLayerDefs(false);
                    this.map.hideLoader();
                });
            } else {
                this.updateLayerDefs(false);
                this.map.hideLoader();
            }
        },
        checkLimit: function (defQuery, geometry) {
            // summary:
            //      checks to see if the filtered results are more than the limit
            // defQuery[optional]: String
            //      select by definition query
            // geometry[optional]: Polygon
            //      select by geometry
            // returns: Promise
            //      resolves with the query if the limit was not exceeded, otherwise rejects
            console.log('app/mapController:checkLimit', arguments);

            var query = new Query();
            if (defQuery) {
                query.where = defQuery;
            }
            if (geometry) {
                query.geometry = geometry;
            }

            var def = new Deferred();

            this.queryFLayer.queryCount(query)
                .then(count => {
                if (count > config.stationsDisplayLimit) {
                    def.reject();
                } else {
                    console.log('feature count: ', count);
                    def.resolve();
                }
                }, error => {
                    topic.publish(config.topics.toast, {
                        message: `Error querying features! ${error.message}`,
                        type: 'danger'
                    });
            });

            return def.promise;
        },
        queryIdsComplete: function (response) {
            // summary:
            //      callback for fLayer.queryIds
            // response: {objectIds: Number[]}
            console.log('app/mapController:queryIdsComplete', arguments);

            this.map.hideLoader();
            var def;
            if (response.objectIds) {
                def = config.fieldNames.STATION_ID + ' IN (' + response.objectIds.join(', ') + ')';
            } else {
                def = '1 = 2';
            }

            this.updateLayerDefs([{
                table: config.tableNames.stations,
                where: def
            }]);
        },
        updateLayerDefs: function (filterQueryInfos) {
            // summary
            //      update layer defs
            // filterQueryInfos: Object
            console.log('app.mapController:updateLayerDefs', arguments);

            if (filterQueryInfos) {
                this.fLayer.setDefinitionExpression(queryHelpers.getStationQuery(filterQueryInfos));
                this.fLayer.setVisibility(true);

                const handler = this.fLayer.on('update-end', () => {
                    this.map.setExtent(graphicsUtils.graphicsExtent(this.fLayer.graphics), true);
                    handler.remove();
                });

                topic.publish(config.topics.queryIdsComplete, queryHelpers.getGridQuery(filterQueryInfos));
            } else {
                this.fLayer.setVisibility(false);
                this.fLayer.setDefinitionExpression(null);
                topic.publish(config.topics.queryIdsComplete, '1 = 2');
            }
        }
    };
});
