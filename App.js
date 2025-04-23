import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Provider } from "react-redux";
import store from "./src/store";
// import i18n from "./src/i18n";
import Toast from "react-native-toast-message";
import AppNavigator from "./src/navigation/AppNavigation";
import { NativeWindStyleSheet } from "nativewind";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { configureAxios } from "./src/config/axiosConfig";
// NativeWind configuration
NativeWindStyleSheet.setOutput({ default: "native", web: "css" });

// Toast configuration
const toastConfig = {
  success: ({ text1 }) =>
    <View style={styles.toastSuccess}>
      <Text style={styles.toastText}>
        {text1}
      </Text>
    </View>,
  error: ({ text1 }) =>
    <View style={styles.toastError}>
      <Text style={styles.toastText}>
        {text1}
      </Text>
    </View>,
};

const App = () => {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts (example)
        await Font.loadAsync(
          {
            // "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
          }
        );
        // await i18n.isInitialized; // Initialize i18n
      } finally {
        setAppReady(true);
      }
    }
    prepare();
    configureAxios(store);
  }, []);

  if (!appReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B6FED" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <Toast config={toastConfig} />
    </Provider>
  );
};

// Styles (uncommented and applied)

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  toastSuccess: {
    height: 50,
    width: "90%",
    backgroundColor: "#4BB543",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  toastError: {
    height: 50,
    width: "90%",
    backgroundColor: "#FF3333",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  toastText: {
    color: "white",
    fontSize: 16,
  },
});

export default App;
