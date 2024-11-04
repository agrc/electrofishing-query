import { composeRenderProps } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';
import config from '../config';
import { Result } from './ResultsGrid';

export const focusRing = tv({
  base: 'outline outline-offset-2 outline-primary-900 dark:outline-secondary-600',
  variants: {
    isFocusVisible: {
      false: 'outline-0',
      true: 'outline-2',
    },
  },
});

export function composeTailwindRenderProps<T>(
  className: string | ((v: T) => string) | undefined,
  tw: string,
): string | ((v: T) => string) {
  return composeRenderProps(className, (className) => twMerge(tw, className));
}

export function getStationIdsFromResultRows(data: Result[] | undefined, selectedOids: Set<string>): Set<string> {
  return new Set(
    data
      ?.filter((row) => selectedOids.has(row[config.fieldNames.ESRI_OID] as string))
      .map((row) => row[config.fieldNames.STATION_ID] as string),
  );
}

export function getResultOidsFromStationIds(data: Result[] | undefined, selectedStationIds: Set<string>): Set<string> {
  return new Set(
    data
      ?.filter((row) => selectedStationIds.has(row[config.fieldNames.STATION_ID] as string))
      .map((row) => row[config.fieldNames.ESRI_OID] as string),
  );
}
