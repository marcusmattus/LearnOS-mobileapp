/**
 * The account section on the Profile screen: who the learner is signed in as,
 * and the ways to turn a guest session into a permanent account.
 *
 * Google Sign-In runs through expo-auth-session and needs the native OAuth
 * client IDs in `expo.extra.googleClientIds`, so it only lights up in a
 * development or EAS build with those set. Email/password works everywhere.
 */
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { describeAuthError, useAuth } from '../auth/AuthContext';
import { googleClientIds } from '../auth/firebase';
import { SectionLabel } from './ui';
import { C, F, lh } from '../theme';

WebBrowser.maybeCompleteAuthSession();

const googleConfigured = !!(googleClientIds.ios || googleClientIds.android || googleClientIds.web);

export function AccountCard() {
  const { status, user, signInWithGoogleIdToken, signInWithEmail, signUpWithEmail, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [request, response, promptGoogle] = Google.useIdTokenAuthRequest({
    iosClientId: googleClientIds.ios,
    androidClientId: googleClientIds.android,
    webClientId: googleClientIds.web,
  });

  // The browser hands back an ID token; Firebase turns it into a session.
  useEffect(() => {
    if (response?.type !== 'success') return;
    const idToken = response.params.id_token;
    if (!idToken) return;
    run(() => signInWithGoogleIdToken(idToken));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await action();
      setPassword('');
    } catch (e) {
      setError(describeAuthError(e));
    } finally {
      setBusy(false);
    }
  };

  if (status === 'unconfigured') {
    return (
      <>
        <SectionLabel style={styles.label}>Account</SectionLabel>
        <View style={styles.card}>
          <Text style={styles.body}>
            Sign-in isn’t set up in this build. Add the Firebase config to app.json to enable it.
          </Text>
        </View>
      </>
    );
  }

  if (status === 'loading') {
    return (
      <>
        <SectionLabel style={styles.label}>Account</SectionLabel>
        <View style={[styles.card, styles.center]}>
          <ActivityIndicator color={C.purpleLight} accessibilityLabel="Loading account" />
        </View>
      </>
    );
  }

  if (status === 'signed-in') {
    const name = user?.displayName || user?.email || 'Signed in';
    return (
      <>
        <SectionLabel style={styles.label}>Account</SectionLabel>
        <View style={styles.card}>
          <Text style={styles.name} accessibilityRole="header">{name}</Text>
          {!!user?.email && user.displayName ? <Text style={styles.body}>{user.email}</Text> : null}
          <Text style={styles.body}>Your progress is saved to this account.</Text>
          <Pressable
            onPress={() => run(signOut)}
            disabled={busy}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
            style={({ pressed }) => [styles.secondaryBtn, { opacity: pressed || busy ? 0.7 : 1 }]}
          >
            <Text style={styles.secondaryBtnText}>Sign out</Text>
          </Pressable>
          {error && <ErrorText message={error} />}
        </View>
      </>
    );
  }

  // Guest session: offer the upgrade paths.
  return (
    <>
      <SectionLabel style={styles.label}>Account</SectionLabel>
      <View style={styles.card}>
        <Text style={styles.name} accessibilityRole="header">Guest</Text>
        <Text style={styles.body}>
          Your progress lives on this device. Add a sign-in to keep it across devices.
        </Text>

        <Pressable
          onPress={() => promptGoogle()}
          disabled={!request || !googleConfigured || busy}
          accessibilityRole="button"
          accessibilityLabel="Continue with Google"
          accessibilityState={{ disabled: !request || !googleConfigured || busy }}
          style={({ pressed }) => [
            styles.googleBtn,
            { opacity: !request || !googleConfigured || busy ? 0.45 : pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={styles.googleG}>G</Text>
          <Text style={styles.googleText}>Continue with Google</Text>
        </Pressable>
        {!googleConfigured && (
          <Text style={styles.hint}>Google Sign-In needs OAuth client IDs in app.json.</Text>
        )}

        <View style={styles.divider}>
          <View style={styles.rule} />
          <Text style={styles.dividerText}>or use email</Text>
          <View style={styles.rule} />
        </View>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={C.dim}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          accessibilityLabel="Email"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password (6+ characters)"
          placeholderTextColor={C.dim}
          secureTextEntry
          autoComplete="password"
          textContentType="password"
          accessibilityLabel="Password"
          style={styles.input}
        />

        <View style={styles.row}>
          <Pressable
            onPress={() => run(() => signInWithEmail(email.trim(), password))}
            disabled={busy}
            accessibilityRole="button"
            style={({ pressed }) => [styles.secondaryBtn, styles.flex, { opacity: pressed || busy ? 0.7 : 1 }]}
          >
            <Text style={styles.secondaryBtnText}>Sign in</Text>
          </Pressable>
          <Pressable
            onPress={() => run(() => signUpWithEmail(email.trim(), password))}
            disabled={busy}
            accessibilityRole="button"
            style={({ pressed }) => [styles.primaryBtn, styles.flex, { opacity: pressed || busy ? 0.8 : 1 }]}
          >
            <Text style={styles.primaryBtnText}>Create account</Text>
          </Pressable>
        </View>

        {busy && <ActivityIndicator color={C.purpleLight} style={styles.spinner} />}
        {error && <ErrorText message={error} />}
      </View>
    </>
  );
}

function ErrorText({ message }: { message: string }) {
  return (
    <Text style={styles.error} accessibilityLiveRegion="polite" accessibilityRole="alert">
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { alignItems: 'center' },
  label: { marginTop: 20, marginBottom: 12 },
  card: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 15,
    gap: 10,
  },
  name: { fontFamily: F.semibold, fontSize: 17, color: C.text },
  body: { fontFamily: F.regular, fontSize: 12.5, color: C.muted, lineHeight: lh(12.5, 1.5) },
  hint: { fontFamily: F.regular, fontSize: 11.5, color: C.muted, marginTop: -4 },

  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 44,
    borderRadius: 13,
    backgroundColor: C.text,
  },
  googleG: { fontFamily: F.bold, fontSize: 16, color: '#4285F4' },
  googleText: { fontFamily: F.semibold, fontSize: 14, color: C.bg },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 2 },
  rule: { flex: 1, height: 1, backgroundColor: C.borderStrong },
  dividerText: { fontFamily: F.regular, fontSize: 11.5, color: C.muted },

  input: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border2,
    backgroundColor: C.surfaceDeep,
    paddingHorizontal: 14,
    fontFamily: F.regular,
    fontSize: 14,
    color: C.text,
  },
  row: { flexDirection: 'row', gap: 9 },
  primaryBtn: {
    minHeight: 44,
    borderRadius: 13,
    backgroundColor: C.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { fontFamily: F.semibold, fontSize: 14, color: '#fff' },
  secondaryBtn: {
    minHeight: 44,
    borderRadius: 13,
    backgroundColor: C.surfaceAlt,
    borderWidth: 1,
    borderColor: C.border2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { fontFamily: F.medium, fontSize: 14, color: C.text },
  spinner: { marginTop: 2 },
  error: { fontFamily: F.regular, fontSize: 12.5, color: C.redLight, lineHeight: lh(12.5, 1.5) },
});
