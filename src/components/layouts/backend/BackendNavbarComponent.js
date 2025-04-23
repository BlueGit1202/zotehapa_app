import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { logout } from '../../../store/actions/authActions';
import { changeLanguage } from '../../../store/actions/globalStateActions';
import { updateProfileImage } from '../../../store/actions/frontend/frontendEditProfileActions';
import { fetchLanguage } from '../../../store/actions/frontend/frontendLanguageActions';

const BackendNavbar = ({ toggleSidebar, showSidebar }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Redux selectors
  const setting = useSelector(state => state.frontendSetting.lists);
  const authInfo = useSelector(state => state.auth.authInfo);
  const languages = useSelector(state => state.frontendLanguage.lists);
  const currentLanguage = useSelector(state => state.frontendLanguage.show);
  const permissions = useSelector(state => state.auth.authPermission);
    
  // State
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [posPermission, setPosPermission] = useState({
    permission: false,
    url: ""
  });

  // Close all dropdowns
  const closeAllOverlays = () => {
    setShowLanguageDropdown(false);
    setShowProfileDropdown(false);
  };

  // Handle language change
  const handleLanguageChange = async (id, code, mode) => {
    try {
      await dispatch(changeLanguage({ 
        language_id: id, 
        language_code: code, 
        display_mode: mode 
      }));
      await dispatch(fetchLanguage(id));
      setShowLanguageDropdown(false);
    } catch (error) {
      console.error('Language change error:', error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await dispatch(logout());
    navigation.navigate("Home");
  };

  // Handle image upload
const handleImageUpload = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setLoading(true);
      const formData = new FormData();
      
      // Updated to use assets array (new ImagePicker API)
      const imageUri = result.assets[0].uri;
      const imageName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
      
      formData.append("image", {
        uri: imageUri,
        type: result.assets[0].mimeType || "image/jpeg",
        name: imageName || `profile_${Date.now()}.jpg`
      });

      // Add required GCS headers
      const headers = {
        'Content-Type': 'multipart/form-data',
        'x-goog-content-length-range': '0,10485760' // 0-10MB range
      };

      await dispatch(updateProfileImage(formData, headers));
      setLoading(false);
      alert("Profile image updated successfully");
    }
  } catch (error) {
    setLoading(false);
    console.error("Image upload error:", error);
    alert(error.response?.data?.message || "Error updating profile image");
  }
};

  // Check POS permissions
  useEffect(() => {
    if (permissions && permissions.length > 0) {
      const posPermission = permissions.find(p => p.name === "pos");
      if (posPermission && posPermission.access) {
        setPosPermission({
          permission: true,
          url: posPermission.url
        });
      }
    }
  }, [permissions]);

  return (
    <View style={styles.container}>
      {/* Main Navbar */}
      <View style={styles.navbar}>

        <View style={styles.leftContainer}>
          <TouchableOpacity 
            onPress={toggleSidebar}
            style={styles.menuButton}
          >
            <Ionicons 
              name={showSidebar ? 'close' : 'menu'} 
              size={24} 
              color="#333" 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => navigation.navigate('Home')}
            style={styles.logoContainer}
          >
            <Image 
              source={{ uri: setting?.theme_logo || 'https://via.placeholder.com/150' }} 
              style={styles.logo}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

     
        <View style={styles.rightContainer}>

          {/* Profile Dropdown */}
          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={() => {
                setShowProfileDropdown(!showProfileDropdown);
                setShowLanguageDropdown(false);
              }}
              style={styles.iconButton}
            >
              <Image
                source={{ uri: authInfo?.image || 'https://via.placeholder.com/150' }}
                style={styles.profileImage}
              />
              <MaterialIcons name="arrow-drop-down" size={20} color="#4B5563" />
            </TouchableOpacity>

            {/* Profile Dropdown Modal */}
            <Modal
              transparent
              visible={showProfileDropdown}
              onRequestClose={() => setShowProfileDropdown(false)}
            >
              <TouchableOpacity
                style={styles.dropdownOverlay}
                activeOpacity={1}
                onPress={() => setShowProfileDropdown(false)}
              >
                <View style={[styles.dropdown, styles.profileDropdown]}>
                  {/* Profile Header */}
                  <View style={styles.profileHeader}>
                    <View style={styles.profileImageWrapper}>
                      <Image
                        source={{ uri: authInfo?.image || 'https://via.placeholder.com/150' }}
                        style={styles.largeProfileImage}
                      />
                      <TouchableOpacity
                        onPress={handleImageUpload}
                        style={styles.editButton}
                      >
                        {loading ? (
                          <ActivityIndicator size="small" color="#4B6FED" />
                        ) : (
                          <MaterialIcons name="edit" size={16} color="white" />
                        )}
                      </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.profileName}>{authInfo?.name}</Text>
                    <Text style={styles.profileEmail}>{authInfo?.email}</Text>
                    {authInfo?.phone && (
                      <Text style={styles.profilePhone}>
                        {authInfo.country_code}{authInfo.phone}
                      </Text>
                    )}
                    <Text style={styles.profileBalance}>
                      {authInfo?.currency_balance}
                    </Text>
                  </View>

                  <View style={styles.profileMenu}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("AdminProfileEdit");
                        setShowProfileDropdown(false);
                      }}
                      style={styles.menuItem}
                    >
                      <MaterialIcons name="edit" size={20} color="#4B5563" />
                      <Text style={styles.menuText}>Edit Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("AdminChangePassword");
                        setShowProfileDropdown(false);
                      }}
                      style={styles.menuItem}
                    >
                      <MaterialIcons name="vpn-key" size={20} color="#4B5563" />
                      <Text style={styles.menuText}>Change Password</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleLogout}
                      style={styles.menuItem}
                    >
                      <MaterialIcons name="logout" size={20} color="#4B5563" />
                      <Text style={styles.menuText}>Logout</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 100,
  },
  navbar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    padding: 8,
    marginRight: 12,
  },
  logoContainer: {
    marginRight: 16,
  },
  logo: {
    width: 120,
    height: 40,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginLeft: 12,
  },
  iconButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  languageText: {
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
    maxWidth: 80,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  languageDropdown: {
    width: 200,
    maxHeight: Dimensions.get('window').height * 0.5,
    position: 'absolute',
    top: 50,
    right: 10,
  },
  dropdownScroll: {
    maxHeight: Dimensions.get('window').height * 0.5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  profileDropdown: {
    width: 280,
    position: 'absolute',
    top: 50,
    right: 10,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImageWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  largeProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  profilePhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  profileBalance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
    textAlign: 'center',
  },
  profileMenu: {
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
});

export default BackendNavbar;