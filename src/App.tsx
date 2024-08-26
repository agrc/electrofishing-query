import esriConfig from '@arcgis/core/config';
import Graphic from '@arcgis/core/Graphic';
import Viewpoint from '@arcgis/core/Viewpoint.js';
import { Button, Drawer, Footer, Header, Sherlock, masqueradeProvider } from '@ugrc/utah-design-system';
import { useEffect, useState } from 'react';
import { useOverlayTrigger } from 'react-aria';
import { ErrorBoundary } from 'react-error-boundary';
import { useOverlayTriggerState } from 'react-stately';
import { MapContainer } from './components';
import { useAnalytics, useFirebaseApp } from './components/contexts';
import { FilterProvider } from './components/contexts/FilterProvider';
import Filter from './components/Filter';
import { useMap } from './components/hooks';
import { DnrLogo } from './components/Logo';
import config from './config';
import ErrorFallback from './ErrorFallback';

const version = import.meta.env.PACKAGE_VERSION;

console.log('application version:', version);

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

export default function App() {
  const app = useFirebaseApp();
  const logEvent = useAnalytics();
  const { zoom, placeGraphic } = useMap();
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <main className="flex h-screen flex-col md:gap-2">
        <Header links={links}>
          <DnrLogo />
          <div className="flex h-full grow items-center gap-3">
            <h2 className="font-heading text-3xl font-black text-zinc-600 sm:text-5xl dark:text-zinc-100">
              Electrofishing Query
            </h2>
          </div>
        </Header>
        {isAuthenticated ? (
          <section className="relative flex min-h-0 flex-1 gap-2 overflow-x-hidden md:mr-2">
            <FilterProvider>
              <Drawer main state={sideBarState} {...sideBarTriggerProps}>
                <div className="mx-2 mb-2 grid grid-cols-1 gap-2">
                  <Filter />
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
              <div className="relative mb-2 flex flex-1 flex-col overflow-hidden rounded border border-zinc-200 dark:border-zinc-700">
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
            </FilterProvider>
          </section>
        ) : (
          <section className="flex flex-1 items-center justify-center">
            <div className="flex flex-col gap-4">
              <h2 className="text-center text-2xl font-bold">Please log in to use the application</h2>
              <Button variant="primary" onClick={() => setIsAuthenticated(true)}>
                Log in
              </Button>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
