define([
    'app/AGSStore',
    'app/config',
    'app/Download',
    'app/_ResultsQueryMixin',

    'dgrid1/extensions/ColumnResizer',
    'dgrid1/extensions/DijitRegistry',
    'dgrid1/OnDemandGrid',
    'dgrid1/Selection',

    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dijit/_WidgetsInTemplateMixin',

    'dojo/date/locale',
    'dojo/dom-class',
    'dojo/text!app/templates/Grid.html',
    'dojo/topic',
    'dojo/_base/declare',

    'bootstrap'
], function (
    AGSStore,
    config,
    Download,
    _ResultsQueryMixin,

    ColumnResizer,
    DijitRegistry,
    Grid,
    Selection,

    _TemplatedMixin,
    _WidgetBase,
    _WidgetsInTemplateMixin,

    locale,
    domClass,
    template,
    topic,
    declare
) {
    var fn = config.fieldNames;

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _ResultsQueryMixin], {
        // description:
        //      A container to hold grids and download link.

        templateString: template,
        baseClass: 'grid',
        widgetsInTemplate: true,

        // grid: Grid
        grid: null,


        // Properties to be sent into constructor

        // mapServiceUrl: String
        //      updated to secured after successful sign in in app/App
        mapServiceUrl: config.urls.mapService,

        postCreate: function () {
            // summary:
            //      set up listeners
            console.log('app.Grid::postCreate', arguments);

            var that = this;
            this.download = new Download({}, this.downloadDiv);
            this.own(
                topic.subscribe(config.topics.queryIdsComplete, this.populateGrid.bind(this)),
                $('a[data-toggle="tab"]').on('shown.bs.tab', function () {
                    that.populateGrid(that.lastDefQuery);
                }),
                this.download
            );

            this.inherited(arguments);
        },
        onError: function () {
            // summary:
            //      show an error message
            console.log('app/Grid:onError', arguments);

            topic.publish(config.topics.toast, {
                message: 'There was an error populating the grid!',
                type: 'danger'
            });
        },
        populateGrid: function (defQuery) {
            // summary:
            //      Populate the grid with a newly created store based upon defQuery
            // defQuery: String
            console.log('app/Grid:populateGrid', arguments);

            domClass.toggle(
                this.clearSelectionBtnContainer,
                'hidden',
                defQuery.indexOf(config.fieldNames.STATION_ID + ' = ') === -1
            );

            this.lastDefQuery = defQuery;

            if (!this.grid) {
                this.initGrid();
            }
            this.grid.resize();
            if (!this.grid.collection ||
                (this.grid.collection && this.grid.collection.where !== defQuery)) {
                const store = new AGSStore({
                    target: this.mapServiceUrl + '/dynamicLayer/query',
                    tableName: 'SamplingEvents',
                    idProperty: config.fieldNames.EVENT_ID,
                    outFields: [
                        fn.EVENT_ID,
                        fn.EVENT_DATE,
                        fn.OBSERVERS,
                        fn.STATION_ID,
                        fn.SPECIES,
                        fn.TYPES
                    ],
                    where: defQuery,
                    id: 1
                });
                this.grid.set('collection', store);
            }

            return defQuery; // for testing only
        },
        clearSelection: function () {
            // summary:
            //      clear the station selection
            console.log('app.Grid:clearSelection', arguments);

            topic.publish(config.topics.clearStationSelection);
        },
        initGrid: function () {
            // summary:
            //      initialize the results dgrid
            console.log('app/Grid:initGrid', arguments);

            var resultColumns = [
                {
                    field: fn.EVENT_ID
                }, {
                    field: fn.EVENT_DATE,
                    label: 'Event Date',
                    formatter: function (value) {
                        const date = new Date(value);

                        return `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`;
                    }
                }, {
                    field: fn.OBSERVERS,
                    label: 'Observers'
                }, {
                    field: fn.STATION_ID,
                    label: 'Station ID'
                }, {
                    field: fn.SPECIES,
                    label: 'Species Codes'
                }, {
                    field: fn.TYPES,
                    label: 'Equipment Types'
                }
            ];

            this.grid = this.buildGrid(this.gridDiv, resultColumns);
            this.grid.on('dgrid-error', this.onError.bind(this));
        },
        buildGrid: function (div, columns) {
            // summary:
            //      build a new dgrid
            // div: Dom Node
            // columns: Object[]
            console.log('app/Grid:buildGrid', arguments);

            var grid = new (declare([Grid, ColumnResizer, DijitRegistry, Selection]))({
                columns: columns,
                noDataMessage: 'No data found.',
                loadingMessage: 'Loading data...',
                minRowsPerPage: 100,
                maxRowsPerPage: 500
            }, div);
            grid.startup();

            this.own(
                grid.on('dgrid-select', this.onSelectionChange.bind(this)),
                grid.on('dgrid-deselect', this.onSelectionChange.bind(this))
            );

            return grid;
        },
        onSelectionChange() {
            // summary:
            //      fires when a user selects a row or rows
            console.log('app/Grid:onSelectionChange', arguments);

            const eventIds = Object.keys(this.grid.selection);
            const stationIds = eventIds.map(eventId => this.grid.row(eventId).data[config.fieldNames.STATION_ID]);

            topic.publish(config.topics.gridSelectionChanged, stationIds);
        }
    });
});
