import { describe, expect, it } from 'vitest';
import config from '../config';
import { getGridQuery, getIdsFromGridSelection, getStationQuery, removeIrrelevantWhiteSpace } from './queryHelpers';

describe('getStationQuery', () => {
  it('builds the correct query text', () => {
    const input = [
      {
        where: '1 = 1',
        table: 'TableOne',
      },
      {
        where: '1 = 2',
        table: 'TableOne',
      },
      {
        where: '1 = 3',
        table: 'TableTwo',
      },
      {
        where: '1 = 4',
        table: 'TableThree',
      },
    ];
    const expected = removeIrrelevantWhiteSpace(
      `(${config.fieldNames.STATION_ID} IN (SELECT ${config.fieldNames.STATION_ID} FROM ${config.databaseSecrets.databaseName}.${config.databaseSecrets.user}.TableOne
                      WHERE 1 = 1 AND 1 = 2))
                  AND (${config.fieldNames.STATION_ID} IN (SELECT ${config.fieldNames.STATION_ID} FROM ${config.databaseSecrets.databaseName}.${config.databaseSecrets.user}.TableTwo
                      WHERE 1 = 3))
                  AND (${config.fieldNames.STATION_ID} IN (SELECT ${config.fieldNames.STATION_ID} FROM ${config.databaseSecrets.databaseName}.${config.databaseSecrets.user}.TableThree
                      WHERE 1 = 4))`,
    );

    const results = getStationQuery(input);
    expect(results).toBe(expected);
  });
  it('handles where clauses against the Stations table itself', () => {
    const input = [
      {
        where: '1 = 1',
        table: config.tableNames.stations,
      },
      {
        where: '1 = 2',
        table: 'TableOne',
      },
    ];
    const expected = `(1 = 1) AND (${config.fieldNames.STATION_ID} IN (SELECT ${config.fieldNames.STATION_ID} FROM ${config.databaseSecrets.databaseName}.${config.databaseSecrets.user}.TableOne WHERE 1 = 2))`;

    const results = getStationQuery(input);
    expect(results).toBe(expected);
  });
  it('handles a single where clause against the Stations table itself', () => {
    const input = [
      {
        where: '1 = 1',
        table: config.tableNames.stations,
      },
    ];
    const expected = '(1 = 1)';

    const results = getStationQuery(input);
    expect(results).toBe(expected);
  });
  it('handles tables that require an extra join back to stations', () => {
    const input = [
      {
        where: '1 = 1',
        table: config.tableNames.fish,
      },
      {
        where: '2 = 2',
        table: config.tableNames.events,
      },
    ];
    const expected = removeIrrelevantWhiteSpace(`(${config.fieldNames.STATION_ID} IN (
                  SELECT ${config.fieldNames.STATION_ID} FROM ${config.databaseSecrets.databaseName}.${config.databaseSecrets.user}.${config.tableNames.events}
                  WHERE ${config.fieldNames.EVENT_ID} IN (
                      SELECT ${config.fieldNames.EVENT_ID} FROM ${config.databaseSecrets.databaseName}.${config.databaseSecrets.user}.${config.tableNames.fish}
                      WHERE 1 = 1
                  ) AND 2 = 2
              ))`);

    expect(getStationQuery(input)).toBe(expected);
  });
});

describe('getGridQuery', () => {
  it('builds the correct query text', () => {
    const input = [
      {
        where: '1 = 1',
        table: 'TableOne',
      },
      {
        where: '1 = 2',
        table: 'TableOne',
      },
      {
        where: '1 = 3',
        table: 'TableTwo',
      },
      {
        where: '1 = 4',
        table: 'TableThree',
      },
    ];

    const expected = '(1 = 1) AND (1 = 2) AND (1 = 3) AND (1 = 4)';

    const results = getGridQuery(input);
    expect(results).toBe(expected);
  });
});

describe('removeIrrelevantWhiteSpace', () => {
  it('removes newlines and double spaces', () => {
    const input = `testing
                  testing    testing`;

    expect(removeIrrelevantWhiteSpace(input)).toBe('testing testing testing');
  });
  it('removes spaces around parenthesis', () => {
    const input = '( test ) hello';

    expect(removeIrrelevantWhiteSpace(input)).toBe('(test) hello');
  });
});

describe('getIdsFromGridSelection', () => {
  const rows = [
    {
      EVENT_ID: '1',
    },
    {
      EVENT_ID: '2',
    },
    {
      EVENT_ID: '3',
    },
  ];

  it('returns all ids if there is no selection', () => {
    expect(getIdsFromGridSelection(rows, {})).toEqual('1;2;3');
  });
  it('returns selected ids', () => {
    const selection = {
      1: true,
      3: true,
    };

    expect(getIdsFromGridSelection(rows, selection)).toEqual('1;3');
  });
});
