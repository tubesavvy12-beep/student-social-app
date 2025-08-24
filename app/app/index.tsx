import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { auth, googleProvider, facebookProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();

  async function signInWith(provider: 'google' | 'facebook') {
    try {
      await signInWithPopup(auth, provider === 'google' ? googleProvider : facebookProvider);
      router.replace('/home');
    } catch (e) {}
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Twitter_new_X_logo.png' }} style={styles.logo} />
      <Text variant="headlineMedium" style={styles.title}>Student Social</Text>
      <Text variant="bodyMedium" style={styles.subtitle}>Where students connect. Simple. Modern.</Text>
      <View style={{ height: 24 }} />
      <Button mode="contained" onPress={() => signInWith('google')} style={styles.btn}>
        Continue with Google
      </Button>
      <Button mode="outlined" onPress={() => signInWith('facebook')} style={styles.btn}>
        Continue with Facebook
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1419', alignItems: 'center', justifyContent: 'center', padding: 24 },
  logo: { width: 72, height: 72, marginBottom: 16, tintColor: 'white' },
  title: { color: 'white', marginBottom: 8 },
  subtitle: { color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  btn: { width: '80%', marginVertical: 6 }
});