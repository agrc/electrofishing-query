define([
    'app/config',
    'app/filters/_Filter',

    'dojo/text!app/filters/templates/AutoCompleteFilter.html',
    'dojo/_base/declare',

    'typeahead'
], function (
    config,
    _Filter,

    template,
    declare
) {
    const waterNameAttribute = 'data-water-name';
    const countyAttribute = 'data-county';

    return declare([_Filter], {
        templateString: template,
        baseClass: 'auto-complete-filter',

        postCreate() {
            console.log('app/filters/AutoCompleteFilter:postCreate', arguments);

            $(this.searchBox).typeahead({
                source: this.onSearchChange.bind(this),
                displayText: this.getDisplayText,
                afterSelect: this.afterSelect.bind(this),
                items: 15
            });
        },
        getDisplayText(item) {
            return `${item.attributes[config.fieldNames.WaterName]} (${item.attributes[config.fieldNames.COUNTY]})`;
        },
        onSearchChange(newValue, process) {
            // summary:
            //      This fires when the user types into the search box
            // newValue: string
            //      The string in the search box
            // process: function
            //      The callback to pass the found values to
            console.log('app/filters/AutoCompleteFilter:onSearchChange', arguments);

            const makeRequest = layerId => {
                const parameters = {
                    f: 'json',
                    where: `${config.fieldNames.WaterName} LIKE '%${newValue}%'`,
                    returnGeometry: false,
                    outFields: [
                        config.fieldNames.WaterName,
                        config.fieldNames.COUNTY
                    ],
                    returnDistinctValues: true
                };
                const url = new URL(`${config.urls.referenceService}/${layerId}/query`);
                Object.keys(parameters).forEach(key => url.searchParams.append(key, parameters[key]));

                return fetch(url).then(response => response.json());
            };

            const promises = Promise.all([makeRequest(0), makeRequest(1)]);

            promises.then(results => process(results[0].features.concat(results[1].features)));
        },
        afterSelect(item) {
            // summary:
            //      Fires when the user has selected an option
            console.log('app/filters/AutoCompleteFilter:afterSelect', arguments);

            const button = document.createElement('button');
            button.className = 'btn btn-default btn-sm';
            button.innerHTML = `
                <span class="glyphicon glyphicon-remove"></span>
                ${this.getDisplayText(item)}
            `;
            button.addEventListener('click', this.removeButton.bind(this, button));
            button.setAttribute(waterNameAttribute, item.attributes[config.fieldNames.WaterName]);
            button.setAttribute(countyAttribute, item.attributes[config.fieldNames.COUNTY]);
            this.resultsContainer.appendChild(button);

            this.updateCount();

            const clearDelay = 500;
            setTimeout(() => {
                this.searchBox.value = '';
            }, clearDelay);

            this.emit('changed');
        },
        updateCount() {
            // summary:
            //      Updates the count span in the header of this widget based on number of selected values
            console.log('app/filters/AutoCompleteFilter:updateCount', arguments);

            const count = this.resultsContainer.children.length;
            if (count > 0) {
                this.numSpan.innerHTML = `(${count})`;
                this.numSpan.className = '';
            } else {
                this.numSpan.className = 'hidden';
            }
        },
        removeButton(button) {
            // summary:
            //      Removes a result button from the list
            console.log('app/filters/AutoCompleteFilter:removeButton', arguments);

            this.resultsContainer.removeChild(button);
            this.updateCount();

            this.emit('changed');
        },
        getQuery() {
            // summary:
            //      Returns the query built from the selected values
            console.log('app/filters/AutoCompleteFilter:getQuery', arguments);

            if (!this.isValid()) {
                return;
            }

            const queries = Array.from(this.resultsContainer.children).map(button => {
                return `${config.fieldNames.WaterName} = '${button.getAttribute(waterNameAttribute)}'` +
                    ` AND ${config.fieldNames.COUNTY} = '${button.getAttribute(countyAttribute)}'`;
            });

            const tableNameToken = '<tableName>';
            const tableWhere = `(${queries.join(') OR (')})`;
            const joinWhere = `${config.fieldNames.WATER_ID} IN (SELECT ${config.fieldNames.Permanent_Identifier}` +
                ` FROM ${config.databaseName}.WILDADMIN.${tableNameToken} WHERE ${tableWhere})`;
            const where = `${joinWhere.replace(tableNameToken, config.tableNames.streams)}` +
                ` OR ${joinWhere.replace(tableNameToken, config.tableNames.lakes)}`;

            return {
                table: config.tableNames.stations,
                where
            };
        },
        clear() {
            // summary:
            //      Removes all of the selected values
            console.log('app/filters/AutoCompleteFilter:clear', arguments);

            Array.from(this.resultsContainer.children).forEach(this.removeButton.bind(this));
        },
        isValid() {
            return this.resultsContainer.children.length > 0;
        }
    });
});
