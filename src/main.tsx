import '@arcgis/core/assets/esri/themes/light/main.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FirebaseAnalyticsProvider, FirebaseAppProvider, FirebaseAuthProvider } from '@ugrc/utah-design-system';
import { OAuthProvider } from 'firebase/auth';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App';
import { FilterProvider } from './components/contexts/FilterProvider';
import { MapProvider } from './components/contexts/MapProvider';
import './index.css';

let firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: '',
};

if (import.meta.env.VITE_FIREBASE_CONFIG) {
  firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);
}

const provider = new OAuthProvider('oidc.utahid');
provider.addScope('app:DWRElectroFishing');

const MainErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  return (
    <div className="static flex h-screen w-screen items-center justify-center">
      <div className="flex-col items-center">
        <h1>Something went wrong</h1>
        <pre className="text-red-500">{error.message}</pre>
        <button className="w-full rounded-full border p-1" onClick={resetErrorBoundary}>
          Try again
        </button>
      </div>
    </div>
  );
};

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={MainErrorFallback} onReset={() => window.location.reload()}>
      <FirebaseAppProvider config={firebaseConfig}>
        <FirebaseAuthProvider provider={provider}>
          <FirebaseAnalyticsProvider>
            <QueryClientProvider client={queryClient}>
              <MapProvider>
                <FilterProvider>
                  <App />
                </FilterProvider>
              </MapProvider>
            </QueryClientProvider>
          </FirebaseAnalyticsProvider>
        </FirebaseAuthProvider>
      </FirebaseAppProvider>
    </ErrorBoundary>
  </StrictMode>,
);
