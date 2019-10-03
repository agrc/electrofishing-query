define([
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dijit/_WidgetsInTemplateMixin',

    'dojo/Evented',
    'dojo/on',
    'dojo/_base/declare',

    'bootstrap'
], function (
    _TemplatedMixin,
    _WidgetBase,
    _WidgetsInTemplateMixin,

    Evented,
    on,
    declare
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
        // description:
        //      A base class for filters that are included in FilterContainer

        // isAdded: Boolean
        //      Stores a value indicating if the filter widget has been added to the container
        isAdded: false,


        // Properties to be sent into constructor

        // parent: DomNode
        //      The containing dom node required for accordion functionality
        parent: null,

        // name: String
        //      The string that shows up in the title bar of the pane
        name: null,

        constructor: function () {
            // summary:
            //      apply some defaults
            console.log('app/_Filter:constructor', arguments);

            this.baseClass += ' panel panel-default';
        },
        postCreate: function () {
            // summary:
            //      description
            console.log('app/_Filter:postCreate', arguments);

            $(this.body).collapse({
                parent: this.parent,
                toggle: false
            });

            var that = this;
            on(this.heading, 'click', function (evt) {
                if (evt.srcElement !== that.closeBtn &&
                    evt.srcElement !== that.closeSpan) {
                    $(that.body).collapse('toggle');
                }
            });

            this.inherited(arguments);
        },
        remove: function () {
            // summary:
            //      removes widget from visible filters
            console.log('app/_Filter:remove', arguments);

            this.clear();

            this.isAdded = false;

            this.emit('removed', this);
        },
        open: function () {
            // summary:
            //      opens the body of the filter
            console.log('app/_Filter:open', arguments);

            $(this.body).collapse('show');

            this.isAdded = true;

            this.inherited(arguments);
        },
        close() {
            // summary:
            //      collapses the filter body
            console.log('app/_Filter:close', arguments);

            $(this.body).collapse('hide');

            this.inherited(arguments);
        },
        getQuery: function () {
            // summary:
            //      to be implemented by sub class
        },
        clear() {
            // summary:
            //      to be implemented by sub class
        }
    });
});
