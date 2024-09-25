import { Auth, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { connectFunctionsEmulator, Functions } from 'firebase/functions';

interface FirebaseEmulatorWindow extends Window {
  _emulating_auth?: boolean;
  _emulating_firestore?: boolean;
  _emulating_functions?: boolean;
}

declare const window: FirebaseEmulatorWindow;

export const connectToEmulators = (
  connectCondition: boolean,
  auth?: Auth | null,
  firestore?: Firestore | null,
  functions?: Functions | null,
) => {
  if (!connectCondition || typeof window === 'undefined') {
    return;
  }

  if (!window._emulating_auth) {
    if (auth) {
      try {
        connectAuthEmulator(auth, 'http://localhost:9099', {
          disableWarnings: true,
        });
      } catch {
        console.log('auth emulator already connected');
      }

      window._emulating_auth = true;
    }
  }

  if (!window._emulating_functions) {
    if (functions) {
      try {
        connectFunctionsEmulator(functions, 'localhost', 5001);
      } catch {
        console.log('functions emulator already connected');
      }

      window._emulating_functions = true;
    }
  }

  if (!window._emulating_firestore) {
    if (firestore) {
      try {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      } catch {
        console.log('firestore emulator already connected');
      }

      window._emulating_firestore = true;
    }
  }
};
