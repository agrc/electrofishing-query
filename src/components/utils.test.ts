import { describe, expect, it } from 'vitest';
import config from '../config';
import { Result } from './ResultsGrid';
import { getEventIdsForDownload, getResultOidsFromStationIds, getStationIdsFromResultRows } from './utils';

describe('getStationIdsFromResultRows', () => {
  const data: Result[] = [
    { [config.fieldNames.ESRI_OID]: '1', [config.fieldNames.STATION_ID]: 'A' },
    { [config.fieldNames.ESRI_OID]: '2', [config.fieldNames.STATION_ID]: 'B' },
  ];

  it('should return correct station IDs', () => {
    const selectedOids = new Set(['1']);
    const result = getStationIdsFromResultRows(data, selectedOids);
    expect(result).toEqual(new Set(['A']));
  });

  it('should return an empty set if no matching OIDs', () => {
    const selectedOids = new Set(['3']);
    const result = getStationIdsFromResultRows(data, selectedOids);
    expect(result).toEqual(new Set());
  });
});

describe('getResultOidsFromStationIds', () => {
  const data: Result[] = [
    { [config.fieldNames.ESRI_OID]: '1', [config.fieldNames.STATION_ID]: 'A' },
    { [config.fieldNames.ESRI_OID]: '2', [config.fieldNames.STATION_ID]: 'B' },
  ];

  it('should return correct OIDs', () => {
    const selectedStationIds = new Set(['A']);
    const result = getResultOidsFromStationIds(data, selectedStationIds);
    expect(result).toEqual(new Set(['1']));
  });

  it('should return an empty set if no matching station IDs', () => {
    const selectedStationIds = new Set(['C']);
    const result = getResultOidsFromStationIds(data, selectedStationIds);
    expect(result).toEqual(new Set());
  });
});

describe('getEventIdsForDownload', () => {
  const data: Result[] = [
    { [config.fieldNames.ESRI_OID]: '1', [config.fieldNames.EVENT_ID]: 'E1' },
    { [config.fieldNames.ESRI_OID]: '2', [config.fieldNames.EVENT_ID]: 'E2' },
  ];

  it('should return all event IDs if selectedKeys is "all"', () => {
    const selectedKeys = 'all';
    const result = getEventIdsForDownload(data, selectedKeys);
    expect(result).toEqual(['E1', 'E2']);
  });

  it('should return all event IDs if selectedKeys is an empty set', () => {
    const selectedKeys: Set<string> = new Set();
    const result = getEventIdsForDownload(data, selectedKeys);
    expect(result).toEqual(['E1', 'E2']);
  });

  it('should return correct event IDs for selected OIDs', () => {
    const selectedKeys = new Set(['1']);
    const result = getEventIdsForDownload(data, selectedKeys);
    expect(result).toEqual(['E1']);
  });

  it('should return an empty array if no matching OIDs', () => {
    const selectedKeys = new Set(['3']);
    const result = getEventIdsForDownload(data, selectedKeys);
    expect(result).toEqual([]);
  });
});
