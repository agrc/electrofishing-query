import esriConfig from '@arcgis/core/config';
import Graphic from '@arcgis/core/Graphic';
import {
  Drawer,
  Footer,
  Header,
  Sherlock,
  UtahIdLogin,
  featureServiceProvider,
  useFirebaseAnalytics,
  useFirebaseApp,
  useFirebaseAuth,
} from '@ugrc/utah-design-system';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { useEffect } from 'react';
import { useOverlayTrigger } from 'react-aria';
import { ErrorBoundary } from 'react-error-boundary';
import { useOverlayTriggerState } from 'react-stately';
import { MapContainer } from './components';
import { useFilter } from './components/contexts/FilterProvider';
import Filter from './components/Filter';
import { useMap } from './components/hooks';
import { DnrLogo } from './components/Logo';
import ResultsGrid from './components/ResultsGrid';
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

export default function App() {
  const app = useFirebaseApp();
  const logEvent = useFirebaseAnalytics();
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

    if (!import.meta.env.DEV) {
      initPerformance();
    }
  }, [app]);

  useEffect(() => {
    if (app && import.meta.env.DEV) {
      const auth = getAuth(app);
      if (!auth.emulatorConfig) {
        console.log('connecting to auth emulator');
        connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
      }
    }
  }, [app]);

  const onSherlockMatch = (graphics: Graphic[]) => {
    // summary:
    //      Zooms to the passed in graphic(s).
    // graphics: esri.Graphic[]
    //      The esri.Graphic(s) that you want to zoom to.
    // tags:
    //      private
    logEvent('sherlock:zoom');

    zoom(graphics[0].geometry);
    placeGraphic(graphics);
  };

  const { currentUser, logout } = useFirebaseAuth();
  const kyOptions = {
    hooks: {
      beforeRequest: [
        async (request: Request) => {
          console.log('interceptor ky options triggered');
          request.headers.set('Authorization', `Bearer ${await currentUser?.getIdToken()}`);
        },
      ],
    },
  };
  const streamsSherlockOptions = {
    provider: featureServiceProvider(
      config.urls.streams,
      config.fieldNames.WaterName,
      // @ts-expect-error the type for this may be incorrect
      config.fieldNames.COUNTY,
      kyOptions,
    ),
    maxResultsToDisplay: 10,
    onSherlockMatch,
  };
  const lakesSherlockOptions = {
    provider: featureServiceProvider(
      config.urls.lakes,
      config.fieldNames.WaterName,
      // @ts-expect-error the type for this may be incorrect
      config.fieldNames.COUNTY,
      kyOptions,
    ),
    maxResultsToDisplay: 10,
    onSherlockMatch,
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
  useEffect(() => {
    if (currentUser) {
      // this should take care of all requests made through the esri js api
      esriConfig.request.interceptors?.push({
        urls: config.urls.functionsUrl,
        before: async (params) => {
          console.log('interceptor triggered: url', params.url);
          params.requestOptions.headers = {
            ...params.requestOptions.headers,
            Authorization: `Bearer ${await currentUser.getIdToken()}`,
          };
        },
      });

      console.log('esri interceptor added');
    }
  }, [currentUser]);

  // open tray if filter is set
  const { filter } = useFilter();
  useEffect(() => {
    trayState.setOpen(Object.keys(filter).length > 0);
  }, [filter, trayState]);

  return (
    <>
      <main className="flex h-screen flex-col md:gap-2">
        <Header links={links} currentUser={currentUser} logout={logout}>
          <div className="flex h-full grow items-center gap-3">
            <DnrLogo />
            <h2 className="font-heading text-3xl font-black text-zinc-600 sm:text-5xl dark:text-zinc-100">
              Electrofishing Query
            </h2>
          </div>
        </Header>
        {currentUser ? (
          <section className="relative flex min-h-0 flex-1 overflow-x-hidden md:mr-2">
            <Drawer main state={sideBarState} {...sideBarTriggerProps}>
              <div className="mx-2 mb-2 grid grid-cols-1 gap-2">
                <Filter />
                <h2 className="text-xl font-bold">Map controls</h2>
                <div className="flex flex-col gap-4 rounded border border-zinc-200 p-3 dark:border-zinc-700">
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Sherlock {...streamsSherlockOptions} label="Find a stream" />
                  </ErrorBoundary>
                </div>
                <div className="flex flex-col gap-4 rounded border border-zinc-200 p-3 dark:border-zinc-700">
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Sherlock {...lakesSherlockOptions} label="Find a lake" />
                  </ErrorBoundary>
                </div>
              </div>
            </Drawer>
            <div className="relative mb-2 flex flex-1 flex-col overflow-hidden rounded border border-zinc-200 dark:border-zinc-700">
              <div className="relative flex-1 overflow-hidden dark:rounded">
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <MapContainer bottomPadding={trayState.isOpen ? 320 : 0} />
                </ErrorBoundary>
                <Drawer
                  type="tray"
                  className="shadow-inner dark:shadow-white/20"
                  allowFullScreen
                  state={trayState}
                  {...trayTriggerProps}
                >
                  <ResultsGrid />
                </Drawer>
              </div>
            </div>
          </section>
        ) : (
          <section className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-center text-2xl font-bold">Please log in to use the application</h2>
              <div>
                <UtahIdLogin />
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
