
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.e2a5d718e7994d04a27a5a855a41dc25',
  appName: 'message-vault-sync',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'https://e2a5d718-e799-4d04-a27a-5a855a41dc25.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#3b82f6',
      showSpinner: true,
      spinnerColor: '#ffffff'
    }
  }
};

export default config;
