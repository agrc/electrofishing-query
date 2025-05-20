import Graphic from '@arcgis/core/Graphic';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapView from '@arcgis/core/views/MapView';
import { useGraphicManager } from '@ugrc/utilities/hooks';
import { createContext, type ReactNode, useRef, useState } from 'react';
import config from '../../config';

export const MapContext = createContext<{
  mapView: MapView | null;
  setMapView: (mapView: MapView) => void;
  placeGraphic: (graphic: Graphic | Graphic[] | null) => void;
  zoom: (geometry: __esri.GoToTarget2D) => void;
  addLayers: (layers: __esri.Layer[]) => void;
  stationsLayer: __esri.FeatureLayer | undefined;
} | null>(null);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [mapView, setMapView] = useState<MapView | null>(null);
  const { setGraphic } = useGraphicManager(mapView);

  const zoom = (geometry: __esri.GoToTarget2D): void => {
    if (!mapView) {
      console.warn('attempting to zoom before the mapView is set');

      return;
    }

    mapView.goTo(geometry);
  };

  const placeGraphic = (graphic: Graphic | Graphic[] | null): void => {
    setGraphic(graphic);
  };

  const addLayers = (layers: __esri.Layer[]): void => {
    if (!mapView) {
      console.warn('attempting to add a layer before the mapView is set');

      return;
    }

    if (!mapView.map) {
      console.warn('mapView does not have a map property');

      return;
    }

    mapView.map.addMany(layers);
  };

  const stationsLayer = useRef<FeatureLayer>(undefined);
  if (mapView && !stationsLayer.current) {
    stationsLayer.current = new FeatureLayer({
      url: config.urls.stations,
      definitionExpression: '1=0',
      outFields: [config.fieldNames.STATION_ID],
      renderer: {
        type: 'simple',
        symbol: {
          type: 'simple-marker',
          color: '#DD5623',
          outline: {
            color: [0, 0, 0],
            width: 1,
          },
          size: 12,
        },
      },
    });

    addLayers([stationsLayer.current]);
  }

  return (
    <MapContext.Provider
      value={{
        mapView,
        setMapView,
        placeGraphic,
        zoom,
        addLayers,
        stationsLayer: stationsLayer.current,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
