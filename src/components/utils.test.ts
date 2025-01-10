import { describe, expect, it } from 'vitest';
import type { Result } from './ResultsGrid';
import { getEventIdsForDownload, getResultOidsFromStationIds, getStationIdsFromResultRows } from './utils';

describe('getStationIdsFromResultRows', () => {
  const data: Result[] = [
    {
      ESRI_OID: 1,
      STATION_ID: 'A',
      EVENT_ID: '',
      EVENT_DATE: 0,
      OBSERVERS: '',
      WaterName_Lake: null,
      DWR_WaterID_Lake: null,
      ReachCode_Lake: null,
      WaterName_Stream: null,
      DWR_WaterID_Stream: null,
      ReachCode_Stream: null,
      STATION_NAME: '',
      SPECIES: null,
      TYPES: null,
      SUBMITTER: null,
    },
    {
      ESRI_OID: 2,
      STATION_ID: 'B',
      EVENT_ID: '',
      EVENT_DATE: 0,
      OBSERVERS: '',
      WaterName_Lake: null,
      DWR_WaterID_Lake: null,
      ReachCode_Lake: null,
      WaterName_Stream: null,
      DWR_WaterID_Stream: null,
      ReachCode_Stream: null,
      STATION_NAME: '',
      SPECIES: null,
      TYPES: null,
      SUBMITTER: null,
    },
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
    {
      ESRI_OID: 1,
      STATION_ID: 'A',
      EVENT_ID: '',
      EVENT_DATE: 0,
      OBSERVERS: '',
      WaterName_Lake: null,
      DWR_WaterID_Lake: null,
      ReachCode_Lake: null,
      WaterName_Stream: null,
      DWR_WaterID_Stream: null,
      ReachCode_Stream: null,
      STATION_NAME: '',
      SPECIES: null,
      TYPES: null,
      SUBMITTER: null,
    },
    {
      ESRI_OID: 2,
      STATION_ID: 'B',
      EVENT_ID: '',
      EVENT_DATE: 0,
      OBSERVERS: '',
      WaterName_Lake: null,
      DWR_WaterID_Lake: null,
      ReachCode_Lake: null,
      WaterName_Stream: null,
      DWR_WaterID_Stream: null,
      ReachCode_Stream: null,
      STATION_NAME: '',
      SPECIES: null,
      TYPES: null,
      SUBMITTER: null,
    },
  ];

  it('should return correct OIDs', () => {
    const selectedStationIds = new Set(['A']);
    const result = getResultOidsFromStationIds(data, selectedStationIds);
    expect(result).toEqual({ '1': true });
  });

  it('should return an empty set if no matching station IDs', () => {
    const selectedStationIds = new Set(['C']);
    const result = getResultOidsFromStationIds(data, selectedStationIds);
    expect(result).toEqual({});
  });
});

describe('getEventIdsForDownload', () => {
  const data: Result[] = [
    {
      ESRI_OID: 1,
      EVENT_ID: 'E1',
      EVENT_DATE: 0,
      OBSERVERS: '',
      WaterName_Lake: null,
      DWR_WaterID_Lake: null,
      ReachCode_Lake: null,
      WaterName_Stream: null,
      DWR_WaterID_Stream: null,
      ReachCode_Stream: null,
      STATION_NAME: '',
      STATION_ID: '',
      SPECIES: null,
      TYPES: null,
      SUBMITTER: null,
    },
    {
      ESRI_OID: 2,
      EVENT_ID: 'E2',
      EVENT_DATE: 0,
      OBSERVERS: '',
      WaterName_Lake: null,
      DWR_WaterID_Lake: null,
      ReachCode_Lake: null,
      WaterName_Stream: null,
      DWR_WaterID_Stream: null,
      ReachCode_Stream: null,
      STATION_NAME: '',
      STATION_ID: '',
      SPECIES: null,
      TYPES: null,
      SUBMITTER: null,
    },
  ];

  it('should an empty array if selectedKeys is an empty set', () => {
    const result = getEventIdsForDownload(data, {});
    expect(result).toEqual([]);
  });

  it('should return correct event IDs for selected OIDs', () => {
    const result = getEventIdsForDownload(data, { '1': true });
    expect(result).toEqual(['E1']);
  });

  it('should return an empty array if no matching OIDs', () => {
    const result = getEventIdsForDownload(data, { '3': true });
    expect(result).toEqual([]);
  });
});
