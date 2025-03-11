import React, { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainStack from "./navigation/MainStack";
import { ThemeProvider } from "./contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, StyleSheet } from "react-native";
import * as Linking from "expo-linking";

// ✅ Giữ splash screen khi app khởi động
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// ✅ Cấu hình Deep Linking
const linking = {
  prefixes: ["https://myapp.com", "myapp://"],
  config: {
    screens: {},
  },
};

const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    "SpaceMono-Regular": require("./assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        if (fontsLoaded) {
          setAppIsReady(true);
        }
      } catch (e) {
        console.warn(e);
      }
    };

    prepare();
  }, [fontsLoaded]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView
      style={styles.container}
      onLayout={onLayoutRootView}
    >
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer linking={linking}>
            <MainStack />
          </NavigationContainer>
        </QueryClientProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
