import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const PaginationWrapper = ({ pagination, page, onPageChange }) => {
  if (!pagination || pagination.total <= pagination.per_page) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Pagination Info */}
      <View>
        <Text style={styles.infoText}>
          {"showing"} {pagination.from}-{pagination.to} {"of"}{" "}
          {pagination.total}
        </Text>
      </View>

      {/* Pagination Controls */}
      <View style={styles.controlsContainer}>
        {/* Previous Button */}
        <TouchableOpacity
          style={[
            styles.button,
            pagination.current_page === 1
              ? styles.disabledButton
              : styles.activeButton,
          ]}
          disabled={pagination.current_page === 1}
          onPress={() => onPageChange(pagination.current_page - 1)}
        >
          <Text
            style={
              pagination.current_page === 1
                ? styles.disabledText
                : styles.activeText
            }
          >
            {"previous"}
          </Text>
        </TouchableOpacity>

        {/* Current Page Indicator */}
        <View style={[styles.button, styles.currentPage]}>
          <Text style={styles.activeText}>
            {pagination.current_page}
          </Text>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={[
            styles.button,
            pagination.current_page === pagination.last_page
              ? styles.disabledButton
              : styles.activeButton,
          ]}
          disabled={pagination.current_page === pagination.last_page}
          onPress={() => onPageChange(pagination.current_page + 1)}
        >
          <Text
            style={
              pagination.current_page === pagination.last_page
                ? styles.disabledText
                : styles.activeText
            }
          >
            {"next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  infoText: {
    fontSize: 14,
    color: "#4b5563",
  },
  controlsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#3b82f6",
  },
  disabledButton: {
    backgroundColor: "#e5e7eb",
  },
  currentPage: {
    backgroundColor: "#3b82f6",
  },
  activeText: {
    color: "#ffffff",
    fontSize: 14,
  },
  disabledText: {
    color: "#6b7280",
    fontSize: 14,
  },
});

export default PaginationWrapper;
