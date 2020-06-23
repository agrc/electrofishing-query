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

    'dojo/dom-class',
    'dojo/on',
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

    domClass,
    on,
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

            this.download = new Download({ grid: this }, this.downloadDiv);
            this.own(
                topic.subscribe(config.topics.queryIdsComplete, this.populateGrid.bind(this)),
                $('a.sampling-events-tab').on('shown.bs.tab', () => {
                    if (this.grid) {
                        this.grid.resize();
                    }
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

            if (!defQuery) {
                return;
            }

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
                    tableName: config.tableNames.events,
                    idProperty: config.fieldNames.EVENT_ID,
                    outFields: [
                        fn.EVENT_ID,
                        fn.EVENT_DATE,
                        fn.OBSERVERS,
                        `${fn.WaterName}_Lake`,
                        `${fn.DWR_WaterID}_Lake`,
                        `${fn.ReachCode}_Lake`,
                        `${fn.WaterName}_Stream`,
                        `${fn.DWR_WaterID}_Stream`,
                        `${fn.ReachCode}_Stream`,
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

            this.grid.clearSelection();
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
                    field: `${fn.WaterName}_Lake`,
                    label: 'Water Name (Lake)'
                }, {
                    field: `${fn.DWR_WaterID}_Lake`,
                    label: 'Water Id (Lake)'
                }, {
                    field: `${fn.ReachCode}_Lake`,
                    label: 'Reach Code (Lake)'
                }, {
                    field: `${fn.WaterName}_Stream`,
                    label: 'Water Name (Stream)'
                }, {
                    field: `${fn.DWR_WaterID}_Stream`,
                    label: 'Water Id (Stream)'
                }, {
                    field: `${fn.ReachCode}_Stream`,
                    label: 'Reach Code (Stream)'
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
                minRowsPerPage: 1000,
                maxRowsPerPage: 5000
            }, div);
            grid.startup();

            this.onGridSelectHandler = on.pausable(grid, 'dgrid-select', this.onGridSelectionChange.bind(this));
            this.onGridDeselectHandler = on.pausable(grid, 'dgrid-deselect', this.onGridSelectionChange.bind(this));
            this.own(
                this.onGridSelectHandler,
                this.onGridDeselectHandler,
                topic.subscribe(config.topics.mapSelectionChanged, this.onMapSelectionChange.bind(this))
            );

            return grid;
        },
        onGridSelectionChange() {
            // summary:
            //      fires when a user selects a row or rows
            console.log('app/Grid:onGridSelectionChange', arguments);

            const eventIds = Object.keys(this.grid.selection);
            const stationIds = [...new Set(
                eventIds.map(eventId => this.grid.row(eventId).data[config.fieldNames.STATION_ID])
            )];

            this.selectedStationsCount.innerHTML = stationIds.length;
            this.selectedEventsCount.innerHTML = eventIds.length;
            domClass.toggle(this.clearSelectionBtnContainer, 'hidden', eventIds.length === 0);

            topic.publish(config.topics.gridSelectionChanged, stationIds);
        },
        onMapSelectionChange(stationIds) {
            // summary:
            //      the set of selected stations on the map has changed
            //      select the associated rows in the grid
            // stationIds: String[]
            //      A list of ids for the selected stations on the map
            console.log('app/Grid:onMapSelectionChange', arguments);

            const filter = new this.grid.collection.Filter().in(config.fieldNames.STATION_ID, stationIds);
            const subset = this.grid.collection.filter(filter);

            this.onGridSelectHandler.pause();
            this.onGridDeselectHandler.pause();

            this.grid.clearSelection();
            subset.forEach(row => {
                this.grid.select(row);
            });

            this.onGridSelectHandler.resume();
            this.onGridDeselectHandler.resume();

            this.onGridSelectionChange();
        }
    });
});
