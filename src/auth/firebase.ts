/**
 * Firebase app + Auth bootstrap.
 *
 * The web config is read from `expo.extra.firebase` in app.json (or an EAS
 * environment override of the same shape). The Firebase web API key is not a
 * secret — it identifies the project, and access is governed by the Auth
 * providers you enable plus Firestore/Storage rules — so it is safe to ship in
 * the bundle.
 *
 * When no config is present (fresh checkout, Jest), `auth` is null and the app
 * runs as it did before Firebase: every screen still works, just without an
 * account. `AuthProvider` reports that as the `unconfigured` status.
 */
import Constants from 'expo-constants';
import { getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FirebaseExtra = {
  firebase?: Partial<FirebaseOptions>;
  /** OAuth client IDs for Google Sign-In through expo-auth-session. */
  googleClientIds?: { ios?: string; android?: string; web?: string };
};

const extra = (Constants.expoConfig?.extra ?? {}) as FirebaseExtra;

/** True once app.json carries a real project config rather than the placeholders. */
export function isFirebaseConfigured(options = extra.firebase): options is FirebaseOptions {
  return !!(
    options?.apiKey &&
    options.projectId &&
    options.appId &&
    !options.apiKey.startsWith('YOUR_')
  );
}

export const googleClientIds = extra.googleClientIds ?? {};

function createApp(): FirebaseApp | null {
  if (!isFirebaseConfigured(extra.firebase)) return null;
  return getApps()[0] ?? initializeApp(extra.firebase);
}

export const app = createApp();

/**
 * Auth with on-device persistence so a session survives app restarts.
 *
 * `getReactNativePersistence` exists in the react-native build of
 * `firebase/auth` that Metro bundles, but the `firebase` package's typings
 * only describe the web build, so it is looked up loosely here.
 */
type RnAuthModule = typeof firebaseAuth & {
  getReactNativePersistence?: (storage: typeof AsyncStorage) => firebaseAuth.Persistence;
};

function createAuth(): firebaseAuth.Auth | null {
  if (!app) return null;
  const { getReactNativePersistence } = firebaseAuth as RnAuthModule;
  try {
    return firebaseAuth.initializeAuth(app, {
      persistence: getReactNativePersistence?.(AsyncStorage),
    });
  } catch {
    // Already initialised (Fast Refresh re-ran this module).
    return firebaseAuth.getAuth(app);
  }
}

export const auth = createAuth();
