import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const LoadingContentComponent = ({ isActive, color = "#4B6FED" }) => {
  if (!isActive) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={color} style={styles.spinner} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  spinner: {
    transform: [{ scale: 1.2 }],
  },
});

export default LoadingContentComponent;
