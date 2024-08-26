import '@arcgis/core/assets/esri/themes/light/main.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App';
import { AnalyticsProvider, FirebaseAppProvider, MapProvider } from './components/contexts';
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
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={MainErrorFallback} onReset={() => window.location.reload()}>
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <AnalyticsProvider>
          <QueryClientProvider client={queryClient}>
            <MapProvider>
              <App />
            </MapProvider>
          </QueryClientProvider>
        </AnalyticsProvider>
      </FirebaseAppProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
