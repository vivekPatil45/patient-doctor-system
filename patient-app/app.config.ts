import { ExpoConfig } from "@expo/config";

const config: ExpoConfig = {
  name: "patient-app",
  slug: "patient-app",
  version: "1.0.0",
  owner: "vivek45",
  orientation: "portrait",
  icon: "./assets/images/new-app-icon.png",
  scheme: "patientapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/new-android-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: "com.vivek.patientapp",
    
  },
  web: {
    output: "static",
    favicon: "./assets/images/new-favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/new-splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  updates: {
    url: "https://u.expo.dev/4997703d-7a66-4b09-b5ff-9587a88c3084", // 👈 Required for EAS Updates
  },
  runtimeVersion: {
    policy: "appVersion", // 👈 ties runtime to your version field
  },
  extra: {
    API_BASE_URL: process.env.API_BASE_URL || "https://clinix-backend-te9n.onrender.com/api",
    eas: {
      projectId: "4997703d-7a66-4b09-b5ff-9587a88c3084",
    },
  },
};

export default config;
