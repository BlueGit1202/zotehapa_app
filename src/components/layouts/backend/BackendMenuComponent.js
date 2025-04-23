import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  StyleSheet,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const SidebarMenu = ({ onClose, onNavigate }) => {
  const setting = useSelector(state => state.frontendSetting.lists);
  const menus = useSelector(state => state.auth.authMenu);

  // Menu items we want to display with their corresponding icons
  const targetMenuItems = [
    { name: 'dashboard', icon: 'dashboard' },
    { name: 'products', icon: 'shopping-bag' },
    { name: 'customers', icon: 'people' },
    { name: 'employees', icon: 'badge' },
    { name: 'transactions', icon: 'receipt' }
  ];

  // Flatten the menu structure and filter only exact target items
  const getFilteredMenus = () => {
    const flatMenus = [];
    
    menus?.forEach(menu => {
      // Check if parent is an exact target match
      const parentMatch = targetMenuItems.find(item => 
        menu.language.toLowerCase() === item.name.toLowerCase()
      );
      
      if (parentMatch) {
        flatMenus.push({
          ...menu,
          icon: parentMatch.icon
        });
      }

      // Check children for exact matches
      menu.children?.forEach(child => {
        const childMatch = targetMenuItems.find(item => 
          child.language.toLowerCase() === item.name.toLowerCase()
        );
        
        if (childMatch) {
          flatMenus.push({
            ...child,
            icon: childMatch.icon
          });
        }
      });
    });

    return flatMenus;
  };

  const filteredMenus = getFilteredMenus();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => onNavigate('Home')}
          style={styles.logoContainer}
        >
          <Image
            source={{ uri: setting?.theme_logo }}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={onClose}
          style={styles.closeButton}
        >
          <MaterialIcons name="close" size={24} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.menuScrollView}>
        {filteredMenus && filteredMenus.length > 0 ? (
          filteredMenus.map(menu => (
            <TouchableOpacity
              key={menu.id}
              onPress={() => onNavigate(menu.url)}
              style={styles.menuItem}
            >
              <MaterialIcons name={menu.icon} size={20} color="#4B5563" />
              <Text style={styles.menuItemText}>{menu.language}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyMenuText}>No menu items available</Text>
        )}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    width: 250,
    height: Dimensions.get('window').height - 60,
    backgroundColor: '#fff',
    zIndex: 999,
    elevation: 10,
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  logo: {
    width: 96,
    height: undefined,
    aspectRatio: 1,
  },
  closeButton: {
    padding: 4,
  },
  menuScrollView: {
    flex: 1,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemText: {
    marginLeft: 12,
    color: '#374151',
    flex: 1,
  },
  emptyMenuText: {
    padding: 16,
    color: '#6b7280',
  },
});

export default SidebarMenu;