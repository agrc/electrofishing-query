define([
    'agrc/modules/Formatting',

    'app/config',
    'app/filters/_Filter',

    'dojo/date',
    'dojo/date/locale',
    'dojo/dom-class',
    'dojo/text!app/filters/templates/DateFilter.html',
    'dojo/_base/declare',

    'dijit/form/DateTextBox'
], function (
    Formatting,

    config,
    _Filter,

    date,
    locale,
    domClass,
    template,
    declare
) {
    return declare([_Filter], {
        // description:
        //      Filter by from and to date.

        templateString: template,

        // Properties to be sent into constructor

        // fieldName: String
        fieldName: null,

        constructor: function () {
            // summary:
            //      apply base css class
            console.log('app/filters/DateFilter:constructor', arguments);

            this.baseClass += ' date-filter';
        },
        postCreate: function () {
            // summary:
            //      description
            console.log('app/filters/DateFilter:postCreate', arguments);

            this.inherited(arguments);
        },
        clear: function () {
            // summary:
            //      description
            console.log('app/filters/DateFilter:clear', arguments);

            this.fromDate.reset();
            this.toDate.reset();
            domClass.add(this.numSpan, 'hidden');
            domClass.add(this.negativeSpan, 'hidden');

            this.emit('changed');
        },
        onChange: function () {
            // summary:
            //      on of the date pickers was changed
            console.log('app/filters/DateFilter:onChange', arguments);

            if (this.isValid()) {
                var num = Formatting.addCommas(date.difference(
                    this.fromDate.value,
                    this.toDate.value
                ));
                this.numSpan.innerHTML = '(' + num + ' days)';
                domClass.remove(this.numSpan, 'hidden');
            } else {
                domClass.add(this.numSpan, 'hidden');
            }

            this.emit('changed');
        },
        isValid: function () {
            // summary:
            //      checks to make sure that there are valid dates
            console.log('app/filters/DateFilter:isValid', arguments);

            const isNotValidDate = picker => !picker.value || isNaN(picker.value);

            if (isNotValidDate(this.fromDate) || isNotValidDate(this.toDate)) {
                return false;
            }

            const isPositive = this.fromDate.value.getTime() < this.toDate.value.getTime();

            domClass.toggle(this.negativeSpan, 'hidden', isPositive);

            return isPositive;
        },
        getQuery: function () {
            // summary:
            //      builds the where clause using the dates
            console.log('app/filters/DateFilter:getQuery', arguments);

            var formatDate = function (inputDate) {
                return locale.format(inputDate, {
                    selector: 'date',
                    datePattern: 'MM/dd/yyyy'
                });
            };
            if (this.isValid()) {
                const from = formatDate(this.fromDate.value);
                const to = formatDate(this.toDate.value);

                return {
                    table: config.tableNames.events,
                    where: `${this.fieldName} >= '${from}' AND ${this.fieldName} <= '${to}'`
                };
            }

            return undefined;
        }
    });
});
