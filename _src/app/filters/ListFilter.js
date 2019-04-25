define([
    'agrc/modules/Domains',

    'app/filters/_Filter',
    'app/filters/_RelatedTableQuery',

    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/query',
    'dojo/text!app/filters/templates/ListFilter.html',
    'dojo/_base/declare',

    'bootstrap'
], function (
    Domains,

    _Filter,
    _RelatedTableQuery,

    domClass,
    domConstruct,
    query,
    template,
    declare
) {
    var c = declare([_Filter, _RelatedTableQuery], {
        // description:
        //      A control for filtering by a defined set of choices.
        //      Allows selection of one or more choices.
        templateString: template,

        // selectedValues: String[]
        //      The currently selected items
        selectedValues: null,

        // any: Boolean
        //      any or all
        any: true,


        // properties passed in via the constructor

        // items[optional]: [String, String][]
        //      description, value pairs
        items: null,

        // featureService[optional]: String
        //      feature service for getting domain values
        featureService: null,

        // fieldName: String
        //      The name of the field associated with this filter
        fieldName: null,

        // fieldType: String (see TYPE* constants below)
        //      The type of the field so that we can build a proper query
        fieldType: null,

        // anyAllToggle: Boolean (default: false)
        //      If true the any/all toggle buttons appear
        anyAllToggle: false,

        constructor: function () {
            // summary:
            //      apply base class
            console.log('app/filters/ListFilter:constructor', arguments);

            this.baseClass += ' list-filter';
            this.selectedValues = [];
        },
        postCreate: function () {
            // summary:
            //      build bubbles
            console.log('app/filters/ListFilter:postCreate', arguments);

            if (this.items) {
                this.loadItems(this.items);
            } else {
                Domains.getCodedValues(this.featureService, this.fieldName)
                    .then(codedValues => {
                        const items = this.translateCodedValuesToItems(codedValues);
                        this.loadItems(items);
                    });
            }

            if (this.anyAllToggle) {
                domClass.remove(this.anyAllGroup, 'hidden');
            }

            $('[data-toggle="tooltip"]', this.domNode).tooltip({
                delay: {
                    show: 750,
                    hide: 100
                },
                container: 'body',
                html: true,
                placement: 'bottom'
            });
            this.inherited(arguments);
        },
        translateCodedValuesToItems(codedValues) {
            // summary:
            //      converts coded value objects to item arrays
            console.log('app/filters/ListFilter:translateCodedValuesToItems', arguments);

            return codedValues.map(value => [value.name, value.code]);
        },
        loadItems: function (items) {
            // summary:
            //      loads all of the items
            console.log('app/filters/ListFilter:loadItems', arguments);

            items.forEach(item => {
                domConstruct.create('button', {
                    innerHTML: item[0],
                    value: item[1],
                    class: 'btn btn-default btn-xs',
                    'data-toggle': 'button',
                    onclick: this.itemClicked.bind(this, item[1])
                }, this.buttonContainer);
            });
        },
        clear: function () {
            // summary:
            //      unselects all buttons
            console.log('app/filters/ListFilter:clear', arguments);

            query('.btn', this.buttonContainer).forEach(function (btn) {
                domClass.remove(btn, 'active');
                btn.setAttribute('aria-pressed', false);
            });

            this.numSpan.innerHTML = 0;
            this.selectedValues = [];
            this.emit('changed');
        },
        itemClicked: function (value) {
            // summary:
            //      description
            // value: String
            //      value of the item that was clicked
            console.log('app/filters/ListFilter:itemClicked', arguments);

            var index = this.selectedValues.indexOf(value);
            if (index === -1) {
                this.selectedValues.push(value);
            } else {
                this.selectedValues.splice(index, 1);
            }

            this.numSpan.innerHTML = this.selectedValues.length;

            this.emit('changed');
        },
        getQuery: function () {
            // summary:
            //      assembles all selected values into a def query
            console.log('app/filters/ListFilter:getQuery', arguments);

            if (this.selectedValues.length) {
                let values;
                if (this.fieldType === c.TYPE_TEXT) {
                    // add quotes for string queries
                    values = this.selectedValues.map(value => {
                        return `'${value}'`;
                    });
                } else {
                    values = this.selectedValues;
                }
                if (this.any) {
                    var where = this.fieldName + ' IN (' + values.join(', ') + ')';

                    return this.getRelatedTableQuery(where);
                }

                var that = this;

                return values.reduce(function (previousReturn, currentValue) {
                    var innerWhere = that.fieldName + ' = ' + currentValue;
                    if (!previousReturn) {
                        return that.getRelatedTableQuery(innerWhere);
                    }

                    return previousReturn + ' AND ' + that.getRelatedTableQuery(innerWhere);
                }, false);
            }

            return undefined;
        },
        toggleAny: function () {
            // summary:
            //      description
            console.log('app/filters/ListFilter:toggleAny', arguments);

            var that = this;
            setTimeout(function () {
                that.any = domClass.contains(that.anyBtn, 'active');
                that.emit('changed');
            }, 0);
        }
    });

    // CONSTANTS
    c.TYPE_TEXT = 'text';
    c.TYPE_NUMBER = 'number';

    return c;
});
