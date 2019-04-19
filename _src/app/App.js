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

            this.grid = new Grid(null, this.gridDiv);
            this.filterContainer = new FilterContainer(null, this.filterDiv);
            this.children = [
                this.filterContainer,
                this.grid,
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

            mapController.initMap(this.mapDiv);
        }
    });
});
