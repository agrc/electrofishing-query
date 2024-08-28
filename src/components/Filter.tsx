import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { Button, TextField } from '@ugrc/utah-design-system';
import { useEffect, useRef } from 'react';
import config from '../config';
import { useFilter } from './contexts/FilterProvider';
import DateRange from './filters/DateRange';
import Purpose from './filters/Purpose';
import SpeciesLength from './filters/SpeciesLength';
import { useMap } from './hooks';
import { getStationQuery } from './queryHelpers';

const emptyDefinition = '1=0';

export default function Filter(): JSX.Element {
  const { addLayers, mapView } = useMap();
  const stationsLayer = useRef<FeatureLayer>();
  const { filter } = useFilter();

  useEffect(() => {
    if (!mapView || !addLayers) {
      return;
    }

    stationsLayer.current = new FeatureLayer({
      url: config.urls.stations,
      definitionExpression: emptyDefinition,
    });
    addLayers([stationsLayer.current]);
  }, [addLayers, mapView]);

  useEffect(() => {
    if (!stationsLayer.current) {
      return;
    }

    if (Object.keys(filter).length > 0) {
      const newQuery = getStationQuery(Object.values(filter));
      console.log('new query:', newQuery);
      stationsLayer.current.definitionExpression = newQuery;
    } else {
      stationsLayer.current.definitionExpression = emptyDefinition;
    }
  }, [filter]);

  return (
    <>
      <h2 className="text-xl font-bold">Map filters</h2>
      <div className="flex flex-col gap-4 rounded border border-zinc-200 p-3 dark:border-zinc-700">
        <Purpose />
      </div>
      <div className="flex flex-col gap-4 rounded border border-zinc-200 p-3 dark:border-zinc-700">
        <DateRange />
      </div>
      <div className="flex flex-col gap-4 rounded border border-zinc-200 p-3 dark:border-zinc-700">
        <SpeciesLength />
      </div>
      <div className="flex flex-col gap-4 rounded border border-zinc-200 p-3 dark:border-zinc-700">
        <h3 className="text-lg font-semibold">Water body</h3>
        <div className="flex flex-col gap-2">
          <div className="ml-2 flex gap-1">
            <TextField label="name" className="w-20" />
          </div>
          <div className="w-30 flex justify-end">
            <Button variant="secondary">clear all</Button>
          </div>
        </div>
      </div>
    </>
  );
}
