import Extent from '@arcgis/core/geometry/Extent';
import FeatureEffect from '@arcgis/core/layers/support/FeatureEffect';
import FeatureFilter from '@arcgis/core/layers/support/FeatureFilter';
import { useEffect, useRef } from 'react';
import config from '../config';
import { useFilter } from './contexts/FilterProvider';
import { useSelection } from './contexts/SelectionProvider';
import DateRange from './filters/DateRange';
import Domain from './filters/Domain';
import Location from './filters/Location';
import SpeciesLength from './filters/SpeciesLength';
import Submitter from './filters/Submitter';
import { useMap } from './hooks';
import { getStationQuery } from './queryHelpers';

const emptyDefinition = '1=0';

export default function Filter() {
  const { stationsLayer, mapView } = useMap();
  const { filter } = useFilter();
  const initialized = useRef(false);

  const { selectedStationIds, setSelectedStationIds } = useSelection();
  useEffect(() => {
    if (!mapView || !stationsLayer) {
      return;
    }

    mapView.on('pointer-move', (event) => {
      mapView.hitTest(event, { include: stationsLayer }).then((response) => {
        if (response.results.length > 0) {
          mapView.container.style.cursor = 'pointer';
        } else {
          mapView.container.style.cursor = 'default';
        }
      });
    });

    mapView.on('click', (event) => {
      mapView
        .hitTest(event, {
          include: stationsLayer,
        })
        .then((response) => {
          if (response.results.length > 0) {
            const graphics = (response.results as __esri.GraphicHit[]).map((result) => result.graphic);
            const stationIds = graphics.map((graphic) => graphic.attributes[config.fieldNames.STATION_ID]);
            if (event.native.ctrlKey || event.native.metaKey || event.native.shiftKey) {
              setSelectedStationIds((previousSelectedIds) => {
                const newSelectedKeys = new Set(previousSelectedIds);
                stationIds.forEach((stationId) => {
                  if (newSelectedKeys.has(stationId)) {
                    newSelectedKeys.delete(stationId);
                  } else {
                    newSelectedKeys.add(stationId);
                  }
                });
                return newSelectedKeys;
              });
            } else {
              setSelectedStationIds(new Set(stationIds));
            }
          } else {
            setSelectedStationIds(new Set());
          }
        });
    });

    initialized.current = true;
  }, [mapView, setSelectedStationIds, stationsLayer]);

  useEffect(() => {
    if (!stationsLayer) {
      return;
    }

    if (Object.keys(filter).length > 0) {
      const newQuery = getStationQuery(Object.values(filter));
      console.log('new station query:', newQuery);
      stationsLayer.definitionExpression = newQuery;
    } else {
      stationsLayer.definitionExpression = emptyDefinition;
    }

    setSelectedStationIds(new Set());

    stationsLayer
      .queryExtent({
        where: stationsLayer.definitionExpression,
      })
      .then((result) => {
        if (mapView) {
          if (result.extent && result.count > 0) {
            mapView.goTo(result.extent);
          } else {
            mapView.goTo(
              new Extent({
                xmax: -12612006,
                xmin: -12246370,
                ymax: 5125456,
                ymin: 4473357,
                spatialReference: {
                  wkid: 102100,
                },
              }),
            );
          }
        }
      });
  }, [filter, mapView, setSelectedStationIds, stationsLayer]);

  useEffect(() => {
    if (!stationsLayer) {
      return;
    }

    if (selectedStationIds.size === 0) {
      // @ts-expect-error null is a valid value
      stationsLayer.featureEffect = null;
    } else {
      const where = `${config.fieldNames.STATION_ID} IN ('${Array.from(selectedStationIds).join("','")}')`;
      stationsLayer.featureEffect = new FeatureEffect({
        filter: new FeatureFilter({
          where,
        }),
        excludedEffect: 'opacity(50%)',
      });
    }
  }, [selectedStationIds, stationsLayer]);

  return (
    <>
      <h2 className="text-xl font-bold">Map filters</h2>
      <div className="flex flex-col gap-4 rounded border border-zinc-200 p-3 dark:border-zinc-700">
        <Domain
          label="Purpose"
          filterKey="purpose"
          featureServiceUrl={config.urls.events}
          fieldName={config.fieldNames.SURVEY_PURPOSE}
          tableName={config.tableNames.events}
        />
      </div>
      <div className="flex flex-col gap-4 rounded border border-zinc-200 p-3 dark:border-zinc-700">
        <Domain
          label="Equipment Type"
          filterKey="equipmentType"
          featureServiceUrl={config.urls.equipment}
          fieldName={config.fieldNames.TYPE}
          tableName={config.tableNames.equipment}
        />
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
      <div className="flex flex-col gap-4 rounded border border-zinc-200 p-3 dark:border-zinc-700">
        <Submitter />
      </div>
    </>
  );
}
