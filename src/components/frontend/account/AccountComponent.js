import React from 'react';
import { View, StyleSheet } from 'react-native';
import AccountMenuComponent from './AccountMenuComponent';

const AccountComponent = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Hidden on small screens, visible on lg (large) screens */}
        <View style={styles.menuContainer}>
          <AccountMenuComponent />
        </View>
        
        {/* Main content area */}
        <View style={styles.contentContainer}>
          {children}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15, // Equivalent to container class
    marginBottom: 40, // mb-10 = 40px (assuming 1 = 4px)
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  menuContainer: {
    display: 'none', // Hidden by default
    width: '25%', // col-3 = 25% (3/12)
    paddingRight: 15, // Add some spacing
  },
  contentContainer: {
    width: '100%', // col-12 = 100%
    paddingLeft: 15, // Add some spacing
  },
  // Media query for large screens
  '@media (min-width: 1024px)': {
    menuContainer: {
      display: 'flex', // Show on lg screens
    },
    contentContainer: {
      width: '75%', // lg:col-9 = 75% (9/12)
    },
  },
});

export default AccountComponent;