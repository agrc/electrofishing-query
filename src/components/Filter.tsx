import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { useEffect, useRef } from 'react';
import config from '../config';
import { useFilter } from './contexts/FilterProvider';
import DateRange from './filters/DateRange';
import Location from './filters/Location';
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

    stationsLayer.current
      .queryExtent({
        where: stationsLayer.current.definitionExpression,
      })
      .then((result) => {
        if (mapView) {
          mapView.goTo(result.extent);
        }
      });
  }, [filter, mapView]);

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
        <Location />
      </div>
    </>
  );
}
