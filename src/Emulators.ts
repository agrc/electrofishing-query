import { Auth, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { connectFunctionsEmulator, Functions } from 'firebase/functions';

export const connectToEmulators = (
  condition: boolean,
  auth: Auth | undefined,
  firestore: Firestore | undefined,
  functions: Functions | undefined,
) => {
  if (condition) {
    if (typeof window === 'undefined' || !window['_firebase_auth_emulator']) {
      if (auth) {
        try {
          connectAuthEmulator(auth, 'http://localhost:9099', {
            disableWarnings: true,
          });
        } catch {
          console.log('auth emulator already connected');
        }
        if (typeof window !== 'undefined') {
          window['_firebase_auth_emulator'] = true;
        }
      }
    }

    if (typeof window === 'undefined' || !window['_firebase_functions_emulator']) {
      if (functions) {
        try {
          connectFunctionsEmulator(functions, 'localhost', 5001);
        } catch {
          console.log('functions emulator already connected');
        }
        if (typeof window !== 'undefined') {
          window['_firebase_function_emulator'] = true;
        }
      }
    }

    if (typeof window === 'undefined' || !window['_firebase_firestore_emulator']) {
      if (firestore) {
        try {
          connectFirestoreEmulator(firestore, 'localhost', 8080);
        } catch {
          console.log('firestore emulator already connected');
        }
        if (typeof window !== 'undefined') {
          window['_firebase_firestore_emulator'] = true;
        }
      }
    }
  }
};
