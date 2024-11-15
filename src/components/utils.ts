import type { RowSelectionState } from '@tanstack/react-table';
import type { Result } from './ResultsGrid';

export function getStationIdsFromResultRows(data: Result[] | undefined, selectedOids: Set<string>): Set<string> {
  return new Set(data?.filter((row) => selectedOids.has(row.ESRI_OID.toString())).map((row) => row.STATION_ID));
}

export function getResultOidsFromStationIds(
  data: Result[] | undefined,
  selectedStationIds: Set<string>,
): RowSelectionState {
  return Object.fromEntries(
    data?.filter((row) => selectedStationIds.has(row.STATION_ID)).map((row) => [row.ESRI_OID, true]) ?? [],
  );
}

export function getEventIdsForDownload(data: Result[] | undefined, selectedRows: RowSelectionState): string[] {
  return data?.filter((row) => selectedRows[row.ESRI_OID]).map((row) => row.EVENT_ID) ?? [];
}
