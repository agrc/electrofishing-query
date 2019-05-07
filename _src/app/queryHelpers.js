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
                if (tables[info.table]) {
                    tables[info.table].push(info.where);
                } else {
                    tables[info.table] = [info.where];
                }
            });

            const query = Object.keys(tables).reduce((previous, current, currentIndex) => {
                // concat where clauses for table
                const where = tables[current].join(' AND ');

                // support multiple table queries
                if (currentIndex > 0) {
                    previous += ' AND ';
                }

                // no need for join on stations table query
                if (current === config.tableNames.stations) {
                    return `${previous}${where}`;
                }

                previous += `${config.fieldNames.STATION_ID} IN (`;

                return `${previous}SELECT ${config.fieldNames.STATION_ID} ` +
                    `FROM ${config.databaseName}.WILDADMIN.${current} WHERE ${where})`;
            }, '');

            return query;
        },
        getGridQuery(queryInfos) {
            // summary:
            //      Returns a query that selects rows in the grid
            console.log('app/queryHelpers:getStationQuery', arguments);

            return Object.keys(queryInfos).reduce((previous, current) => {
                previous.push(queryInfos[current].where);

                return previous;
            }, []).join(' AND ');
        }
    };
});
