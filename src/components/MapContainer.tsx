import Extent from '@arcgis/core/geometry/Extent';
import EsriMap from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import { BusyBar, LayerSelector, type LayerSelectorProps } from '@ugrc/utah-design-system';
import { useViewLoading } from '@ugrc/utilities/hooks';
import { useEffect, useRef, useState } from 'react';
import { useMap } from './hooks';

const statewide = new Extent({
  xmax: -11762120.612131765,
  xmin: -13074391.513731329,
  ymax: 5225035.106177688,
  ymin: 4373832.359194187,
  spatialReference: {
    wkid: 3857,
  },
});

export const MapContainer = ({
  onClick,
  bottomPadding,
}: {
  onClick?: __esri.ViewImmediateClickEventHandler;
  bottomPadding: number;
}) => {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const mapComponent = useRef<EsriMap | null>(null);
  const mapView = useRef<MapView>(null);
  const clickHandler = useRef<IHandle>(null);
  const [selectorOptions, setSelectorOptions] = useState<LayerSelectorProps | null>(null);
  const { setMapView } = useMap();
  const isDrawing = useViewLoading(mapView.current);

  if (mapView.current) {
    mapView.current.padding.bottom = bottomPadding;
  }

  // setup the Map
  useEffect(() => {
    if (!mapNode.current || !setMapView) {
      return;
    }

    mapComponent.current = new EsriMap();

    mapView.current = new MapView({
      container: mapNode.current,
      map: mapComponent.current,
      extent: statewide,
      ui: {
        components: ['zoom'],
      },
    });

    setMapView(mapView.current);

    const selectorOptions: LayerSelectorProps = {
      options: {
        view: mapView.current,
        quadWord: import.meta.env.VITE_DISCOVER_QUAD_WORD,
        basemaps: ['Lite', 'Hybrid', 'Terrain', 'Topo', 'Color IR'],
        operationalLayers: ['Address Points', 'Land Ownership'],
        position: 'top-right',
      },
    };

    setSelectorOptions(selectorOptions);

    return () => {
      mapView.current?.destroy();
      mapComponent.current?.destroy();
    };
  }, [setMapView]);

  // add click event handlers
  useEffect(() => {
    if (onClick) {
      clickHandler.current = mapView.current!.on('immediate-click', onClick);
    }

    return () => {
      clickHandler.current?.remove();
    };
  }, [onClick, mapView]);

  return (
    <div ref={mapNode} className="size-full">
      {selectorOptions?.options.view && <LayerSelector {...selectorOptions}></LayerSelector>}
      {mapView.current && <BusyBar busy={isDrawing} />}
    </div>
  );
};
