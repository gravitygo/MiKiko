import '../global.css';

import Ionicons from '@expo/vector-icons/Ionicons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  PermissionsAndroid,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { initializeDatabase } from '@/database';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  downloadModel,
  getModelSize,
  isModelDownloaded,
  isSetupComplete,
  markSetupComplete,
} from '@/services/model-manager';

export const unstable_settings = {
  anchor: '(tabs)',
};

type BootPhase = 'init' | 'onboarding' | 'downloading' | 'ready';

async function requestAllPermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;

  const permissions = [
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  ];

  const results = await PermissionsAndroid.requestMultiple(permissions);
  return Object.values(results).every(
    (r) => r === PermissionsAndroid.RESULTS.GRANTED,
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [phase, setPhase] = useState<BootPhase>('init');
  const [downloadingModel, setDownloadingModel] = useState<'whisper' | 'llama' | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [whisperDone, setWhisperDone] = useState(false);
  const [llamaDone, setLlamaDone] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  // Pulse animation for loading
  useEffect(() => {
    if (phase === 'init' || phase === 'downloading') {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.3,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    }
  }, [phase, pulseAnim]);

  // Boot sequence
  useEffect(() => {
    (async () => {
      // 1. Initialize database
      try {
        await initializeDatabase();
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }

      // 2. Check if setup already completed
      if (isSetupComplete()) {
        // Background-download any missing models silently
        const wReady = isModelDownloaded('whisper');
        const lReady = isModelDownloaded('llama');

        if (!wReady || !lReady) {
          setPhase('downloading');
          setWhisperDone(wReady);
          setLlamaDone(lReady);

          if (!wReady) {
            setDownloadingModel('whisper');
            try {
              await downloadModel('whisper', setDownloadProgress);
            } catch { /* continue */ }
            setWhisperDone(true);
            setDownloadProgress(0);
          }
          if (!lReady) {
            setDownloadingModel('llama');
            try {
              await downloadModel('llama', setDownloadProgress);
            } catch { /* continue */ }
            setLlamaDone(true);
          }
          setDownloadingModel(null);
        }

        setPhase('ready');
      } else {
        // First open — show onboarding
        setWhisperDone(isModelDownloaded('whisper'));
        setLlamaDone(isModelDownloaded('llama'));
        setPhase('onboarding');
      }
    })();
  }, []);

  const handlePermissions = useCallback(async () => {
    const granted = await requestAllPermissions();
    setPermissionsGranted(granted);
  }, []);

  const handleStartSetup = useCallback(async () => {
    setPhase('downloading');

    // Download whisper if needed
    if (!whisperDone) {
      setDownloadingModel('whisper');
      setDownloadProgress(0);
      try {
        await downloadModel('whisper', setDownloadProgress);
        setWhisperDone(true);
      } catch (e) {
        console.warn('Whisper download failed:', e);
      }
      setDownloadProgress(0);
    }

    // Download llama if needed
    if (!llamaDone) {
      setDownloadingModel('llama');
      setDownloadProgress(0);
      try {
        await downloadModel('llama', setDownloadProgress);
        setLlamaDone(true);
      } catch (e) {
        console.warn('Llama download failed:', e);
      }
    }

    setDownloadingModel(null);
    markSetupComplete();
    setPhase('ready');
  }, [whisperDone, llamaDone]);

  const handleSkipSetup = useCallback(() => {
    markSetupComplete();
    setPhase('ready');
  }, []);

  // === INIT / DOWNLOADING SCREEN ===
  if (phase === 'init' || (phase === 'downloading' && isSetupComplete())) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Animated.View style={{ opacity: pulseAnim }}>
          <Ionicons name="sparkles" size={48} color={colors.tint} />
        </Animated.View>
        <Text style={{ color: colors.textMuted, marginTop: 16, fontSize: 14 }}>
          {phase === 'downloading' && downloadingModel
            ? `Downloading ${downloadingModel === 'whisper' ? 'speech' : 'AI'} model... ${downloadProgress}%`
            : 'Starting up...'}
        </Text>
      </View>
    );
  }

  // === ONBOARDING SCREEN ===
  if (phase === 'onboarding' || (phase === 'downloading' && !isSetupComplete())) {
    const isDownloading = phase === 'downloading';

    return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 24, paddingTop: 80 }}>
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View
            style={{
              width: 80, height: 80, borderRadius: 40,
              backgroundColor: colors.tint + '20',
              alignItems: 'center', justifyContent: 'center', marginBottom: 16,
            }}
          >
            <Ionicons name="sparkles" size={40} color={colors.tint} />
          </View>
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
            Welcome to MiKiko
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 14, textAlign: 'center', marginTop: 8 }}>
            Let's get everything set up for you.
          </Text>
        </View>

        {/* Permissions Card */}
        <View
          style={{ backgroundColor: colors.surface, borderRadius: 24, padding: 20, marginBottom: 16 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons
              name={permissionsGranted ? 'checkmark-circle' : 'mic-outline'}
              size={24}
              color={permissionsGranted ? '#05DF72' : colors.tint}
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: '600', fontSize: 16 }}>
                Microphone Access
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                Required for voice logging
              </Text>
            </View>
            {permissionsGranted && (
              <Ionicons name="checkmark-circle" size={24} color="#05DF72" />
            )}
          </View>
          {!permissionsGranted && (
            <Pressable
              onPress={handlePermissions}
              style={{ backgroundColor: colors.tint, paddingVertical: 12, borderRadius: 16, alignItems: 'center' }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Grant Permission</Text>
            </Pressable>
          )}
        </View>

        {/* Whisper Model Card */}
        <View
          style={{ backgroundColor: colors.surface, borderRadius: 24, padding: 20, marginBottom: 16 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name={whisperDone ? 'checkmark-circle' : 'mic-outline'}
              size={24}
              color={whisperDone ? '#05DF72' : colors.tint}
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: '600', fontSize: 16 }}>
                Speech Model
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                ~{Math.round(getModelSize('whisper') / 1_000_000)}MB · Voice recognition
              </Text>
            </View>
            {whisperDone && <Ionicons name="checkmark-circle" size={24} color="#05DF72" />}
            {isDownloading && downloadingModel === 'whisper' && (
              <Text style={{ color: colors.tint, fontWeight: '600' }}>{downloadProgress}%</Text>
            )}
          </View>
        </View>

        {/* Llama Model Card */}
        <View
          style={{ backgroundColor: colors.surface, borderRadius: 24, padding: 20, marginBottom: 32 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name={llamaDone ? 'checkmark-circle' : 'sparkles-outline'}
              size={24}
              color={llamaDone ? '#05DF72' : colors.tint}
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: '600', fontSize: 16 }}>
                AI Parser Model
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                ~{Math.round(getModelSize('llama') / 1_000_000)}MB · Auto-categorize expenses
              </Text>
            </View>
            {llamaDone && <Ionicons name="checkmark-circle" size={24} color="#05DF72" />}
            {isDownloading && downloadingModel === 'llama' && (
              <Text style={{ color: colors.tint, fontWeight: '600' }}>{downloadProgress}%</Text>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ gap: 12 }}>
          <Pressable
            onPress={handleStartSetup}
            disabled={isDownloading}
            style={{
              backgroundColor: isDownloading ? colors.surfaceHover : colors.tint,
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {isDownloading ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>
                  Downloading {downloadingModel === 'whisper' ? 'Speech' : 'AI'} Model... {downloadProgress}%
                </Text>
              </>
            ) : (
              <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>
                {whisperDone && llamaDone ? 'Get Started' : 'Download & Get Started'}
              </Text>
            )}
          </Pressable>

          {!isDownloading && (
            <Pressable
              onPress={handleSkipSetup}
              style={{ paddingVertical: 12, alignItems: 'center' }}
            >
              <Text style={{ color: colors.textMuted, fontSize: 14 }}>
                Skip for now (download later)
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  // === APP READY ===
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="voice" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="accounts" options={{ headerShown: false }} />
        <Stack.Screen name="categories" options={{ headerShown: false }} />
        <Stack.Screen name="recurring" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    </GestureHandlerRootView>
  );
}
