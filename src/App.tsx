import esriConfig from '@arcgis/core/config';
import Graphic from '@arcgis/core/Graphic';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';
import Viewpoint from '@arcgis/core/Viewpoint.js';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Drawer,
  Footer,
  Header,
  Sherlock,
  TextField,
  masqueradeProvider,
} from '@ugrc/utah-design-system';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useOverlayTrigger } from 'react-aria';
import { ErrorBoundary } from 'react-error-boundary';
import { useOverlayTriggerState } from 'react-stately';
import { MapContainer } from './components';
import { useAnalytics, useFirebaseApp } from './components/contexts';
import { useMap } from './components/hooks';
import { DnrLogo } from './components/Logo';
import config from './config';

const version = import.meta.env.PACKAGE_VERSION;
const secureServiceUrl = import.meta.env.VITE_PROXY_URL;

const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
};

ErrorFallback.propTypes = {
  error: PropTypes.object,
};

esriConfig.assetsPath = './assets';
const links = [
  {
    key: 'Electrofishing data collection app',
    action: { url: 'https://electrofishing.ugrc.utah.gov/' },
  },
  {
    key: 'GitHub Repository',
    action: { url: 'https://github.com/agrc/electrofishing-query' },
  },
  {
    key: `Version ${version} changelog`,
    action: { url: `https://github.com/agrc/electrofishing-query/releases/v${version}` },
  },
  {
    key: 'UGRC Homepage',
    action: { url: 'https://gis.utah.gov/' },
  },
];
const url = 'https://masquerade.ugrc.utah.gov/arcgis/rest/services/UtahLocator/GeocodeServer';
const wkid = 26912;

// TODO!: replace partial list with actual list
const purpose = ['Depletion estimate', 'Mark-Recapture', 'Disease certification', 'Genetics', 'Other'];

export default function App() {
  const app = useFirebaseApp();
  const logEvent = useAnalytics();
  const { zoom, placeGraphic, addLayers } = useMap();
  const sideBarState = useOverlayTriggerState({ defaultOpen: window.innerWidth >= config.MIN_DESKTOP_WIDTH });
  const sideBarTriggerProps = useOverlayTrigger(
    {
      type: 'dialog',
    },
    sideBarState,
  );

  const trayState = useOverlayTriggerState({ defaultOpen: false });
  const trayTriggerProps = useOverlayTrigger(
    {
      type: 'dialog',
    },
    trayState,
  );

  // initialize firebase performance metrics
  useEffect(() => {
    async function initPerformance() {
      const { getPerformance } = await import('firebase/performance');

      return getPerformance(app);
    }
    initPerformance();
  }, [app]);

  // add public layers
  useEffect(() => {
    const streams = new FeatureLayer({
      url: `${secureServiceUrl}/reference/0`,
      id: 'streams',
    });

    const lakes = new FeatureLayer({
      url: `${secureServiceUrl}/reference/1`,
      id: 'lakes',
    });

    const stations = new FeatureLayer({
      url: `${secureServiceUrl}/mapservice/0`,
      id: 'stations',
    });

    const events = new FeatureLayer({
      url: `${secureServiceUrl}/mapservice/1`,
      id: 'stations',
    });

    const fish = new FeatureLayer({
      url: `${secureServiceUrl}/mapservice/2`,
      id: 'stations',
    });

    addLayers([streams, lakes, stations, events, fish]);
  }, [addLayers]);

  const onSherlockMatch = (graphics: Graphic[]) => {
    // summary:
    //      Zooms to the passed in graphic(s).
    // graphics: esri.Graphic[]
    //      The esri.Graphic(s) that you want to zoom to.
    // tags:
    //      private
    logEvent('sherlock:zoom');

    zoom(new Viewpoint({ scale: 10000, targetGeometry: graphics[0].geometry }));
    placeGraphic(graphics);
  };

  const masqueradeSherlockOptions = {
    provider: masqueradeProvider(url, wkid),
    maxResultsToDisplay: 10,
    onSherlockMatch: onSherlockMatch,
  };

  // const onClick = useCallback(
  //   (event: __esri.ViewImmediateClickEvent) => {
  //     mapView!.hitTest(event).then(({ results }) => {
  //       if (!results.length) {
  //         trayState.open();

  //         return setInitialIdentifyLocation(event.mapPoint);
  //       }
  //     });
  //   },
  //   [mapView, trayState],
  // );

  return (
    <>
      <main className="flex h-screen flex-col md:gap-2">
        <Header links={links}>
          <DnrLogo />
          <div className="flex h-full grow items-center gap-3">
            <h2 className="font-heading text-3xl font-black text-zinc-600 sm:text-5xl dark:text-zinc-100">
              Electrofishing query
            </h2>
          </div>
        </Header>
        <section className="relative flex min-h-0 flex-1 gap-2 overflow-x-hidden md:mr-2">
          <Drawer main state={sideBarState} {...sideBarTriggerProps}>
            <div className="mx-2 mb-2 grid grid-cols-1 gap-2">
              <h2 className="text-xl font-bold">Map filters</h2>
              <div className="flex flex-col gap-4 rounded border border-zinc-200 p-3 dark:border-zinc-700">
                <div>
                  <h3 className="text-lg font-semibold">Purpose</h3>
                  <CheckboxGroup>
                    {purpose.map((p) => (
                      <div key={p} className="ml-2 flex gap-1">
                        <Checkbox type="checkbox" id={p} name={p} value={p} />
                        <label htmlFor={p}>{p}</label>
                      </div>
                    ))}
                  </CheckboxGroup>
                </div>
                <div className="w-30 flex justify-end">
                  <Button variant="secondary">clear all</Button>
                </div>
              </div>
              <div className="flex flex-col gap-4 rounded border border-zinc-200 p-3 dark:border-zinc-700">
                <h3 className="text-lg font-semibold">Species and length</h3>
                <div className="flex flex-col gap-2">
                  <div className="ml-2 flex gap-1">
                    species <TextField className="w-20" />
                  </div>
                  <div className="ml-2 flex gap-1">
                    min <TextField className="w-20" />
                    max <TextField className="w-20" />
                  </div>
                  <div className="w-30 flex justify-end">
                    <Button variant="secondary">clear all</Button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 rounded border border-zinc-200 p-3 dark:border-zinc-700">
                <h3 className="text-lg font-semibold">Date range</h3>
                <div className="flex flex-col gap-2">
                  <div className="ml-2 flex gap-1">
                    from <TextField className="w-20" />
                    to <TextField className="w-20" />
                  </div>
                  <div className="w-30 flex justify-end">
                    <Button variant="secondary">clear all</Button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 rounded border border-zinc-200 p-3 dark:border-zinc-700">
                <h3 className="text-lg font-semibold">Water body</h3>
                <div className="flex flex-col gap-2">
                  <div className="ml-2 flex gap-1">
                    name <TextField className="w-20" />
                  </div>
                  <div className="w-30 flex justify-end">
                    <Button variant="secondary">clear all</Button>
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-bold">Map controls</h2>
              <div className="flex flex-col gap-4 rounded border border-zinc-200 p-3 dark:border-zinc-700">
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <Sherlock {...masqueradeSherlockOptions} label="Find a stream" />
                </ErrorBoundary>
              </div>
              <div className="flex flex-col gap-4 rounded border border-zinc-200 p-3 dark:border-zinc-700">
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <Sherlock {...masqueradeSherlockOptions} label="Find a lake" />
                </ErrorBoundary>
              </div>
            </div>
          </Drawer>
          <div className="relative flex flex-1 flex-col rounded">
            <div className="relative flex-1 overflow-hidden dark:rounded">
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <MapContainer />
              </ErrorBoundary>
              <Drawer
                type="tray"
                className="shadow-inner dark:shadow-white/20"
                allowFullScreen
                state={trayState}
                {...trayTriggerProps}
              >
                <section className="grid gap-2 px-7 pt-2">
                  <h2 className="text-center">Selected records</h2>
                </section>
              </Drawer>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
