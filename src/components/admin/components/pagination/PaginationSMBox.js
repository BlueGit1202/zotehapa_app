import React from "react";
import { View, StyleSheet } from "react-native";
import PaginationBox from "./PaginationBox";

const PaginationSMBox = ({ pagination, method }) => {
  return (
    <View style={styles.container}>
      <PaginationBox 
        pagination={pagination} 
        method={method} 
        isSmall={true} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    display: 'flex', // Always show on mobile
    // For responsive behavior, you might need platform-specific code or media queries
  }
});

export default PaginationSMBox;