import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.teacher.app',
  appName: 'المعلم العربي المحترف',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
