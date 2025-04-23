import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

const PaginationBox = ({ pagination, method, isSmall = false }) => {
  const handlePageChange = (page) => {
    method(page);
  };

  if (!pagination || !pagination.links) {
    return null;
  }

  return (
    <View style={[styles.container, isSmall && styles.smallContainer]}>
      {pagination.links.length > 0 &&
        pagination.links.map((link, index) => {
          if (link.url === null) {
            return (
              <Text key={index} style={styles.disabledLink}>
                {link.label.replace("&laquo;", "«").replace("&raquo;", "»")}
              </Text>
            );
          }

          const isActive = link.active;
          const isPrevious = link.label.includes("Previous");
          const isNext = link.label.includes("Next");

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handlePageChange(link.url.split("page=")[1])}
              style={[
                styles.link,
                isActive ? styles.activeLink : styles.inactiveLink,
              ]}
            >
              <Text
                style={[
                  styles.linkText,
                  isActive ? styles.activeLinkText : styles.inactiveLinkText,
                ]}
              >
                {link.label.replace("&laquo;", "«").replace("&raquo;", "»")}
              </Text>
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  smallContainer: {
    justifyContent: "space-between",
  },
  disabledLink: {
    marginHorizontal: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    color: "#9CA3AF",
  },
  link: {
    marginHorizontal: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 4,
  },
  activeLink: {
    backgroundColor: "#EFF6FF",
    borderColor: "#3B82F6",
  },
  inactiveLink: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
  },
  linkText: {
    fontSize: 14,
  },
  activeLinkText: {
    color: "#3B82F6",
    fontWeight: "500",
  },
  inactiveLinkText: {
    color: "#374151",
  },
});

export default PaginationBox;