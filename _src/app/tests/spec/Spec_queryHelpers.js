/* eslint-disable max-len */
require([
    'app/config',
    'app/queryHelpers'
], function (
    config,
    queryHelpers
) {
    describe('app/queryHelpers', () => {
        describe('getStationQuery', () => {
            it('builds the correct query text', () => {
                const input = [{
                    where: '1 = 1',
                    table: 'TableOne'
                }, {
                    where: '1 = 2',
                    table: 'TableOne'
                }, {
                    where: '1 = 3',
                    table: 'TableTwo'
                }, {
                    where: '1 = 4',
                    table: 'TableThree'
                }];
                const expected = queryHelpers.removeIrrelevantWhiteSpace(
                    `(${config.fieldNames.STATION_ID} IN (SELECT ${config.fieldNames.STATION_ID} FROM ${config.databaseName}.WILDADMIN.TableOne
                        WHERE 1 = 1 AND 1 = 2))
                    AND (${config.fieldNames.STATION_ID} IN (SELECT ${config.fieldNames.STATION_ID} FROM ${config.databaseName}.WILDADMIN.TableTwo
                        WHERE 1 = 3))
                    AND (${config.fieldNames.STATION_ID} IN (SELECT ${config.fieldNames.STATION_ID} FROM ${config.databaseName}.WILDADMIN.TableThree
                        WHERE 1 = 4))`
                );

                const results = queryHelpers.getStationQuery(input);
                expect(results).toBe(expected);
            });
            it('handles where clauses against the Stations table itself', () => {
                const input = [{
                    where: '1 = 1',
                    table: config.tableNames.stations
                }, {
                    where: '1 = 2',
                    table: 'TableOne'
                }];
                const expected = `(1 = 1) AND (${config.fieldNames.STATION_ID} IN (SELECT ${config.fieldNames.STATION_ID} FROM ${config.databaseName}.WILDADMIN.TableOne WHERE 1 = 2))`;

                const results = queryHelpers.getStationQuery(input);
                expect(results).toBe(expected);
            });
            it('handles a single where clause against the Stations table itself', () => {
                const input = [{
                    where: '1 = 1',
                    table: config.tableNames.stations
                }];
                const expected = '(1 = 1)';

                const results = queryHelpers.getStationQuery(input);
                expect(results).toBe(expected);
            });
            it('handles tables that require an extra join back to stations', () => {
                const input = [{
                    where: '1 = 1',
                    table: config.tableNames.fish
                }, {
                    where: '2 = 2',
                    table: config.tableNames.events
                }];
                const expected = queryHelpers.removeIrrelevantWhiteSpace(`(${config.fieldNames.STATION_ID} IN (
                    SELECT ${config.fieldNames.STATION_ID} FROM ${config.databaseName}.WILDADMIN.${config.tableNames.events}
                    WHERE ${config.fieldNames.EVENT_ID} IN (
                        SELECT ${config.fieldNames.EVENT_ID} FROM ${config.databaseName}.WILDADMIN.${config.tableNames.fish}
                        WHERE 1 = 1
                    ) AND 2 = 2
                ))`);

                expect(queryHelpers.getStationQuery(input)).toBe(expected);
            });
        });

        describe('getGridQuery', () => {
            it('builds the correct query text', () => {
                const input = [{
                    where: '1 = 1',
                    table: 'TableOne'
                }, {
                    where: '1 = 2',
                    table: 'TableOne'
                }, {
                    where: '1 = 3',
                    table: 'TableTwo'
                }, {
                    where: '1 = 4',
                    table: 'TableThree'
                }];

                const expected = '(1 = 1) AND (1 = 2) AND (1 = 3) AND (1 = 4)';

                const results = queryHelpers.getGridQuery(input);
                expect(results).toBe(expected);
            });
        });

        describe('removeIrrelevantWhiteSpace', () => {
            it('removes newlines and double spaces', () => {
                const input = `testing
                    testing    testing`;

                expect(queryHelpers.removeIrrelevantWhiteSpace(input)).toBe('testing testing testing');
            });
            it('removes spaces around parenthesis', () => {
                const input = '( test ) hello';

                expect(queryHelpers.removeIrrelevantWhiteSpace(input)).toBe('(test) hello');
            });
        });

        describe('getIdsFromGridSelection', () => {
            const rows = [{
                EVENT_ID: '1'
            }, {
                EVENT_ID: '2'
            }, {
                EVENT_ID: '3'
            }];

            it('returns all ids if there is no selection', () => {
                expect(queryHelpers.getIdsFromGridSelection(rows, {})).toEqual('1;2;3');
            });
            it('returns selected ids', () => {
                const selection = {
                    1: true,
                    3: true
                };

                expect(queryHelpers.getIdsFromGridSelection(rows, selection)).toEqual('1;3');
            });
        });
    });
});
