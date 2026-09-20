/**
 * Session identity for the app.
 *
 * Every learner gets an anonymous Firebase account the first time the app
 * opens, so scans and progress can be keyed to a stable `uid` before they ever
 * see a sign-in form. Signing in with Google or email *links* that anonymous
 * account rather than replacing it, so nothing done as a guest is lost.
 *
 * With no Firebase config in app.json the provider reports `unconfigured` and
 * every action is a no-op — the rest of the app never has to check.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  GoogleAuthProvider,
  linkWithCredential,
  onAuthStateChanged,
  signInAnonymously,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type AuthCredential,
  type User,
} from 'firebase/auth';
import { auth } from './firebase';

export type AuthStatus =
  /** No Firebase config in this build — auth is inert. */
  | 'unconfigured'
  /** Waiting on the persisted session (or the first anonymous sign-in). */
  | 'loading'
  /** Signed in with a guest account only. */
  | 'anonymous'
  /** Signed in with a permanent provider (Google or email). */
  | 'signed-in';

type AuthValue = {
  status: AuthStatus;
  user: User | null;
  /** Links a Google ID token (from expo-auth-session) to the current account, or signs in with it. */
  signInWithGoogleIdToken: (idToken: string) => Promise<void>;
  /** Upgrades the guest account to email/password, or creates a fresh one. */
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  /** Signs out and immediately starts a new guest session. */
  signOut: () => Promise<void>;
  /** A fresh Firebase ID token for calling the scan backend, or null when unconfigured. */
  getIdToken: () => Promise<string | null>;
};

const Ctx = createContext<AuthValue | null>(null);

/** The codes that mean "this credential already belongs to another account, sign in there instead". */
const LINK_CONFLICTS = new Set([
  'auth/credential-already-in-use',
  'auth/email-already-in-use',
  'auth/provider-already-linked',
]);

function code(e: unknown): string {
  return typeof e === 'object' && e !== null && 'code' in e ? String((e as { code: unknown }).code) : '';
}

/**
 * Attaches a credential to the guest account when there is one; when the
 * credential already has an account of its own, signs into that instead.
 */
async function adopt(credential: AuthCredential) {
  if (!auth) return;
  const current = auth.currentUser;
  if (current?.isAnonymous) {
    try {
      await linkWithCredential(current, credential);
      return;
    } catch (e) {
      if (!LINK_CONFLICTS.has(code(e))) throw e;
    }
  }
  await signInWithCredential(auth, credential);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, u => {
      setUser(u);
      setReady(true);
      // No persisted session — start a guest one so the learner has a uid.
      if (!u) signInAnonymously(auth!).catch(() => {});
    });
    return unsubscribe;
  }, []);

  const status: AuthStatus = !auth
    ? 'unconfigured'
    : !ready || !user
      ? 'loading'
      : user.isAnonymous
        ? 'anonymous'
        : 'signed-in';

  const signInWithGoogleIdToken = useCallback(async (idToken: string) => {
    await adopt(GoogleAuthProvider.credential(idToken));
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    if (!auth) return;
    if (auth.currentUser?.isAnonymous) {
      await adopt(EmailAuthProvider.credential(email, password));
    } else {
      await createUserWithEmailAndPassword(auth, email, password);
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!auth) return;
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signOut = useCallback(async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
    // The auth listener above starts the next guest session.
  }, []);

  const getIdToken = useCallback(async () => {
    return auth?.currentUser ? auth.currentUser.getIdToken() : null;
  }, []);

  const value = useMemo<AuthValue>(
    () => ({ status, user, signInWithGoogleIdToken, signUpWithEmail, signInWithEmail, signOut, getIdToken }),
    [status, user, signInWithGoogleIdToken, signUpWithEmail, signInWithEmail, signOut, getIdToken],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

/** Turns a Firebase Auth error into a sentence the learner can act on. */
export function describeAuthError(e: unknown): string {
  switch (code(e)) {
    case 'auth/invalid-email':
      return 'That email address doesn’t look right.';
    case 'auth/missing-password':
    case 'auth/weak-password':
      return 'Use a password of at least 6 characters.';
    case 'auth/email-already-in-use':
      return 'There’s already an account with that email. Try signing in instead.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Email or password didn’t match. Check them and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a minute and try again.';
    case 'auth/network-request-failed':
      return 'No connection. Check your network and try again.';
    case 'auth/operation-not-allowed':
      return 'That sign-in method isn’t enabled for this app yet.';
    default:
      return 'Something went wrong signing in. Please try again.';
  }
}
