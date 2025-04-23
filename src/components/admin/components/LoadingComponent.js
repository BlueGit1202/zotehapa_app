import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const LoadingComponent = ({ isActive, color = "#4B6FED" }) => {
  if (!isActive) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={color} style={styles.spinner} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  spinner: {
    transform: [{ scale: 1.5 }],
  },
});

export default LoadingComponent;
