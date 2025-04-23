import React from "react";
import { View, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";

const LoadingComponent = ({ isActive, color = "#4B6FED" }) => {
  if (!isActive) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.barContainer}>
        {[...Array(5)].map((_, i) =>
          <Animatable.View
            key={i}
            style={[styles.bar, { backgroundColor: color }]}
            animation="fadeIn"
            duration={1000}
            iterationCount="infinite"
            iterationDelay={i * 100}
            easing="ease-in-out"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  barContainer: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
  },
  bar: {
    width: 8,
    height: 30,
    marginHorizontal: 2,
    borderRadius: 4,
  },
});

export default LoadingComponent;
