define([
    'app/config',
    'app/FilterContainer',
    'app/Grid',
    'app/mapController',

    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dijit/_WidgetsInTemplateMixin',

    'dojo/dom-construct',
    'dojo/text!app/templates/App.html',
    'dojo/topic',
    'dojo/_base/declare',
    'dojo/_base/lang',

    'sherlock/Sherlock',
    'sherlock/providers/MapService',

    'toaster/dist/Toaster',

    'dijit/layout/BorderContainer'
], function (
    config,
    FilterContainer,
    Grid,
    mapController,

    _TemplatedMixin,
    _WidgetBase,
    _WidgetsInTemplateMixin,

    domConstruct,
    template,
    topic,
    declare,
    lang,

    Sherlock,
    MapService,

    Toaster
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // summary:
        //      The main widget for the app

        widgetsInTemplate: true,
        templateString: template,
        baseClass: 'app',

        constructor: function () {
            // summary:
            //      first function to fire after page loads
            console.info('app.App::constructor', arguments);

            AGRC.app = this;
        },
        startup: function () {
            // summary:
            //      Fires when
            console.log('app.App::startup', arguments);

            this.inherited(arguments);

            mapController.initMap(this.mapDiv);

            this.grid = new Grid(null, this.gridDiv);
            this.filterContainer = new FilterContainer(null, this.filterDiv);
            const streamsProvider = new MapService(
                `${config.urls.referenceService}/${config.layerIndexes.streams}`,
                config.fieldNames.WaterName,
                { wkid: config.wkids.webMercator }
            );
            this.streamsSherlock = new Sherlock({
                placeHolder: 'stream name',
                provider: streamsProvider,
                map: mapController.map,
                preserveGraphics: true
            }, this.streamsSherlockDiv);
            const lakesProvider = new MapService(
                `${config.urls.referenceService}/${config.layerIndexes.lakes}`,
                config.fieldNames.WaterName,
                { wkid: config.wkids.webMercator }
            );
            this.lakesSherlock = new Sherlock({
                placeHolder: 'lake name',
                provider: lakesProvider,
                map: mapController.map,
                baseClass: 'sherlock sherlock-2'
            }, this.lakesSherlockDiv);
            this.children = [
                this.filterContainer,
                this.grid,
                this.streamsSherlock,
                this.lakesSherlock,
                // eslint-disable-next-line new-cap
                new Toaster.default({
                    topic: config.topics.toast
                }, domConstruct.create('div', {}, document.body))
            ];

            this.children.forEach(function (child) {
                child.startup();
            });

            // set version number
            this.version.innerHTML = AGRC.version;
        }
    });
});
