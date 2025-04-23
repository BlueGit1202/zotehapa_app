import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AccountMenuComponent = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState({
    image: '',
    name: '',
    phone: ''
  });

  const authInfo = useSelector(state => state.auth.user);

  useEffect(() => {
    if (authInfo) {
      setProfile({
        image: authInfo.image || '',
        name: authInfo.name || '',
        phone: authInfo.phone ? (authInfo.country_code || '') + authInfo.phone : ''
      });
    }
  }, [authInfo]);

  const menuItems = [
    {
      name: 'Overview',
      icon: 'view-dashboard',
      screen: 'AccountOverview'
    },
    {
      name: 'Order History',
      icon: 'shopping',
      screen: 'OrderHistory'
    },
    {
      name: 'Return Orders',
      icon: 'refresh',
      screen: 'ReturnOrders'
    },
    {
      name: 'Account Info',
      icon: 'account',
      screen: 'AccountInfo'
    },
    {
      name: 'Change Password',
      icon: 'key',
      screen: 'ChangePassword'
    },
    {
      name: 'Address',
      icon: 'map-marker',
      screen: 'Address'
    }
  ];

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={() => navigation.navigate('AccountInfo')}
        >
          {profile.image ? (
            <Image 
              source={{ uri: profile.image }} 
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="account" size={30} color="#3B82F6" />
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.profileName}>{profile.name}</Text>
        {profile.phone && <Text style={styles.profilePhone}>{profile.phone}</Text>}
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Icon 
              name={item.icon} 
              size={24} 
              style={styles.menuIcon} 
            />
            <Text style={styles.menuText}>{item.name}</Text>
            <Icon 
              name="chevron-right" 
              size={20} 
              style={styles.arrowIcon} 
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f8fafc',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1e293b',
  },
  profilePhone: {
    fontSize: 14,
    color: '#64748b',
  },
  menuContainer: {
    paddingHorizontal: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
  },
  menuIcon: {
    color: '#94a3b8',
    marginRight: 16,
    width: 24,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    textTransform: 'capitalize',
  },
  arrowIcon: {
    color: '#cbd5e1',
  },
  // Active state (you can use navigation state to highlight current screen)
  activeMenuItem: {
    backgroundColor: '#f1f5f9',
  },
  activeMenuIcon: {
    color: '#3B82F6',
  },
  activeMenuText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
});

export default AccountMenuComponent;