import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { logout } from '../../../store/actions/authActions';
import appService from '../../../../services/appService';

const ProfileSidebar = ({ visible, onClose }) => {
  const [slideAnim] = useState(new Animated.Value(0));
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const profile = useSelector((state) => state.auth.authInfo);
  const authDefaultPermission = useSelector((state) => state.auth.authDefaultPermission);
  const setting = useSelector((state) => state.frontendSetting.lists);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 0],
  });

  const handleLogout = async () => {
    await dispatch(logout());
    onClose();
    navigation.navigate('Home');
  };

  const navigateTo = (route) => {
    console.log('Navigating to:', route);
    onClose();
     navigation.navigate(route);
  };

  const renderMenuItem = (icon, label, route, isDestructive = false) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => navigateTo(route)}
    >
      <MaterialIcons 
        name={icon} 
        size={24} 
        color={isDestructive ? '#EF4444' : '#3B82F6'} 
      />
      <Text style={[
        styles.menuText,
        isDestructive && styles.destructiveText
      ]}>
        {label}
      </Text>
      <MaterialIcons 
        name="keyboard-arrow-right" 
        size={24} 
        color="#9CA3AF" 
      />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity 
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <Animated.View style={[styles.sidebarContainer, { transform: [{ translateX }] }]}>
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={{ uri: setting?.theme_logo }}
              style={styles.logo}
              resizeMode="contain"
            />
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#EF4444" />
            </TouchableOpacity>
          </View>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <Image
              source={{ uri: profile?.image || 'https://via.placeholder.com/80' }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName} numberOfLines={1}>
                {appService.textShortener(profile?.name, 20)}
              </Text>
              {profile?.phone && (
                <Text style={styles.profilePhone} numberOfLines={1}>
                  {profile?.country_code}{profile?.phone}
                </Text>
              )}
            </View>
          </View>

          {/* Menu Items */}
          <ScrollView style={styles.menuContainer}>
            {profile?.role_id == 1 && Object.keys(authDefaultPermission).length > 0 && (
              renderMenuItem('dashboard', 'Dashboard', 'Dashboard')
            )}
            
            {renderMenuItem('shopping-bag', 'My Orders', 'OrderHistory')}
            {renderMenuItem('refresh', 'Returns', 'ReturnOrders')}
            {renderMenuItem('person', 'Profile', 'AccountInfo')}
            {renderMenuItem('vpn-key', 'Password', 'ChangePassword')}       
            {renderMenuItem('location-on', 'Addresses', 'Address')}
            
            <View style={styles.divider} />
            
            <TouchableOpacity onPress={handleLogout}>
<Text style={[
        styles.menuText
      ]}>
        Logout
      </Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  sidebarContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  logo: {
    width: 112,
    height: 40,
  },
  closeButton: {
    padding: 4,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  profilePhone: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    marginLeft: 16,
  },
  destructiveText: {
    color: '#EF4444',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
});

export default ProfileSidebar;