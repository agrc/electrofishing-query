/* eslint-disable no-alert */
define([
    'agrc/modules/Formatting',

    'app/config',
    'app/filters/AutoCompleteFilter',
    'app/filters/DateFilter',
    'app/filters/ListFilter',
    'app/filters/SpeciesLengthFilter',

    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dijit/_WidgetsInTemplateMixin',

    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/text!app/templates/FilterContainer.html',
    'dojo/topic',
    'dojo/_base/array',
    'dojo/_base/declare',
    'dojo/_base/lang'
], function (
    formatting,

    config,
    AutoCompleteFilter,
    DateFilter,
    ListFilter,
    SpeciesLengthFilter,

    _TemplatedMixin,
    _WidgetBase,
    _WidgetsInTemplateMixin,

    domClass,
    domConstruct,
    template,
    topic,
    array,
    declare,
    lang
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // description:
        //      Control for managing the filter for the application. Contains a variety of FilterType's.

        templateString: template,
        baseClass: 'filter-container',
        widgetsInTemplate: true,

        // filters: _Filter[]
        //      list of filters for this widget
        filters: null,

        // Properties to be sent into constructor

        postCreate: function () {
            // summary:
            //      init's all filters and add's them to the drop down
            console.log('app/FilterContainer:postCreate', arguments);

            this.limitSpan.innerHTML = formatting.addCommas(config.stationsDisplayLimit);

            this.filters = [
                new ListFilter({
                    name: 'Purpose',
                    featureService: `${config.urls.mapService}/${config.layerIndexes.events}`,
                    parent: this.container,
                    fieldName: config.fieldNames.SURVEY_PURPOSE,
                    fieldType: ListFilter.TYPE_TEXT,
                    relatedTableName: config.tableNames.events
                }),
                new DateFilter({
                    name: 'Date Range',
                    parent: this.container,
                    fieldName: config.fieldNames.EVENT_DATE
                }),
                new SpeciesLengthFilter({
                    name: 'Species & Size',
                    parent: this.container
                }),
                new AutoCompleteFilter({
                    name: 'Location',
                    parent: this.container
                })
            ];

            var that = this;
            var addOption = function (name, id) {
                domConstruct.create('option', {
                    innerHTML: name,
                    value: id
                }, that.select);
            };
            this.filters.forEach(function (f) {
                f.startup();
                that.own(f);
                addOption(f.name, f.id);

                // add back to the drop down when it's removed from the container
                f.on('removed', function (filter) {
                    that.updateOptionVisibility(filter.id, true);
                    that.container.removeChild(filter.domNode);
                });
                f.on('changed', lang.hitch(that, 'onFilterChange'));
            });

            this.own(topic.subscribe(config.topics.showLimitMessage, function () {
                domClass.remove(this.limitWarning, 'hidden');
            }.bind(this)));

            this.inherited(arguments);
        },
        updateOptionVisibility: function (id, visible) {
            // summary:
            //      adds or removes the hidden class for the option
            // id: String
            //      corresponds with the value of the option
            // visible: Boolean
            console.log('app.FilterContainer:updateOptionVisibility', arguments);

            array.some(this.select.children, function (option) {
                if (option.value === id) {
                    domClass.toggle(option, 'hidden', !visible);

                    return true;
                }
            });
        },
        addFilter: function () {
            // summary:
            //      Show a filter in the filter container where the user can interact with it
            //      Also, remove it from the drop down so that it can't be selected twice
            console.log('app/FilterContainer:addFilter', arguments);

            var id = this.select.value;
            if (id !== 'none') {
                var filter = this.getFilter(id);
                domConstruct.place(filter.domNode, this.container);
                filter.open();
                this.updateOptionVisibility(id, false);
                this.select.value = 'none';
            }
        },
        getFilter: function (id) {
            // summary:
            //      searches through the filters list and returns the one
            //      with the matching id
            // id: String
            console.log('app/FilterContainer:getFilter', arguments);

            var filter;
            this.filters.some(function (f) {
                filter = f;

                return f.id === id;
            });

            return filter;
        },
        onFilterChange: function () {
            // summary:
            //      builds a def query and/or geometry and enables the submit button if appropriate
            console.log('app/FilterContainer:onFilterChange', arguments);

            this.geo = null;
            this.wheres = [];
            this.filters.forEach(f => {
                var query = f.getQuery();
                if (query) {
                    if (query.table) {
                        this.wheres.push(query);
                    } else {
                        // must be a geometry
                        this.geo = query;
                    }
                }
            });

            this.submitBtn.disabled = this.wheres.length === 0 && !this.geo;

            domClass.add(this.limitWarning, 'hidden');

            console.log('wheres', this.wheres);
        },
        submit() {
            // summary:
            //      builds a query from all of the filters
            console.log('app/FilterContainer:submit', arguments);

            this.filters.forEach(f => f.close());

            topic.publish(config.topics.filterFeatures, this.wheres, this.geo);
        },
        clear() {
            // summary:
            //      prompts the user and then clears all filters
            console.log('app/FilterContainer:clear', arguments);

            if (window.confirm('Are you sure you want to clear your filter(s)?')) {
                this.filters.filter(f => f.isAdded).forEach(f => f.remove());

                topic.publish(config.topics.filterFeatures);
            }
        }
    });
});
