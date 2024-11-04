import { describe, expect, it } from 'vitest';
import config from '../config';
import { Result } from './ResultsGrid';
import { getResultOidsFromStationIds, getStationIdsFromResultRows } from './utils';

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
