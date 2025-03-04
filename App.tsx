import React, { useEffect, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainStack from "./navigation/MainStack";
import { ThemeProvider } from "./contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Text, View } from "react-native";

SplashScreen.preventAutoHideAsync(); // Ngăn splash ẩn ngay lập tức

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    "SpaceMono-Regular": require("./assets/fonts/SpaceMono-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync(); // Ẩn splash khi font đã tải xong
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Không render UI nếu font chưa load xong
  }

  return (
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <MainStack />
          </NavigationContainer>
        </QueryClientProvider>
      </ThemeProvider>
    </View>
  );
};

export default App;
