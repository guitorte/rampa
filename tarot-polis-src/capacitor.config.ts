import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.guitorte.tarotpolis',
  appName: 'Tarot Polis',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
