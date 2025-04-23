import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

const PaginationTextComponent = ({ page, loading }) => {
  // Check if data is loaded and valid
  const dataLoaded =
    page &&
    typeof page.from === "number" &&
    typeof page.to === "number" &&
    typeof page.total === "number";

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#4B6FED" />
      </View>
    );
  }

  if (!dataLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {`${page.from} - ${page.to} of ${page.total}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    marginHorizontal: 4,
  },
  text: {
    fontSize: 14,
    color: "#4a5568",
    fontWeight: "500",
  },
  loadingContainer: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PaginationTextComponent;
