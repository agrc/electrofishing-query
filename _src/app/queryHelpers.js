define([
    'app/config'
], function (
    config
) {
    return {
        getStationQuery(queryInfos) {
            // summary:
            //      Returns a query that selects stations given some related table queries
            console.log('app/queryHelpers:getStationQuery', arguments);

            const tables = {};

            // organize where clauses by table
            queryInfos.forEach(info => {
                // make sure that we don't mutate this object and mess up the grid query
                info = Object.assign({}, info);

                if (info.table === config.tableNames.fish) {
                    // fish table requires an additional join
                    info.table = config.tableNames.events;
                    info.where = `${config.fieldNames.EVENT_ID} IN (
                        SELECT ${config.fieldNames.EVENT_ID} FROM
                        ${config.databaseName}.WILDADMIN.${config.tableNames.fish}
                        WHERE ${info.where})`;
                }

                if (tables[info.table]) {
                    tables[info.table].push(info.where);
                } else {
                    tables[info.table] = [info.where];
                }
            });

            const query = Object.keys(tables).reduce((previous, current, currentIndex) => {
                // concat where clauses for table
                let where = tables[current].join(' AND ');

                // support multiple table queries
                if (currentIndex > 0) {
                    previous += ' AND ';
                }

                // no need for join on stations table query
                if (current === config.tableNames.stations) {
                    return `${previous}(${where})`;
                }

                return `${previous}(${config.fieldNames.STATION_ID} IN (SELECT ${config.fieldNames.STATION_ID}
                    FROM ${config.databaseName}.WILDADMIN.${current} WHERE ${where}))`;
            }, '');

            return this.removeIrrelevantWhiteSpace(query);
        },
        getGridQuery(queryInfos) {
            // summary:
            //      Returns a query that selects rows in the grid
            console.log('app/queryHelpers:getGridQuery', arguments);

            return `(${queryInfos.reduce((previous, current) => {
                previous.push(current.where);

                return previous;
            }, []).join(') AND (')})`;
        },
        getStationQueryFromIds(ids) {
            return `${config.fieldNames.STATION_ID} IN ('${ids.join('\', \'')}')`;
        },
        removeIrrelevantWhiteSpace(text) {
            return text
                .replace(/\n/g, '') // SQL doesn't like newline characters
                .replace(/ +/g, ' ') // multiple whitespaces
                .replace(/\(\s/g, '(') // spaces around parenthesis
                .replace(/\s\)/g, ')'); // ''
        },
        getIdsFromGridSelection(rows, selection) {
            const selectedIds = Object.keys(selection);
            if (selectedIds.length > 0) {
                rows = rows.filter(row => selectedIds.indexOf(row[config.fieldNames.EVENT_ID]) > -1);
            }

            return rows
                .map(row => row[config.fieldNames.EVENT_ID])
                .join(';');
        }
    };
});
