import React, { useEffect, useState, useRef } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { frontendAddressActions } from "../../../../store/actions/frontend/frontendAddressActions";
import AddressCreateComponent from "./AddressCreateComponent";
import alertService from "../../../../../services/alertService";
import { fetchSettings } from "../../../../store/actions/frontend/frontendSettingActions";
import { fetchCountryCode } from "../../../../store/actions/frontend/frontendCountryCodeActions";

const AddressListComponent = ({ navigation }) => {
  const dispatch = useDispatch();
  const { lists: addresses = [], loading = false } = useSelector(
    state => ({
      lists: state.frontendAddress.lists || [],
      loading: state.frontendAddress.loading || false
    }),
    shallowEqual
  );
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [flag, setFlag] = useState("🇺🇸");
  const [callingCode, setCallingCode] = useState("+1");
  const [activeMenu, setActiveMenu] = useState(null); // Track which address menu is open
  const menuRefs = useRef({}); // Refs for each menu

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenu && !menuRefs.current[activeMenu]?.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    // In React Native, we need to handle touches differently
    // This is a simplified approach - in a real app you might need a more robust solution
    return () => {
      // Cleanup if needed
    };
  }, [activeMenu]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(frontendAddressActions.lists());
        await loadCountries();
        await loadDefaultCountryCode();
      } catch (error) {
        console.error("Failed to load data:", error);
        alertService.error("Failed to load address data");
      }
    };

    loadData();
  }, [dispatch]);

  const loadCountries = async () => {
    try {
      const staticCountries = [
        { name: 'United States', code: 'US' },
        { name: 'Canada', code: 'CA' },
        { name: 'United Kingdom', code: 'UK' },
        { name: 'Australia', code: 'AU' }
      ];
      setCountries(staticCountries);
    } catch (error) {
      console.error("Failed to load countries:", error);
      alertService.error("Failed to load countries");
    }
  };

  const loadDefaultCountryCode = async () => {
    try {
      const companyRes = await dispatch(fetchSettings());
      const countryCode = companyRes?.data?.data?.company_country_code || 'US';
      const codeRes = await dispatch(fetchCountryCode(countryCode));
      setCallingCode(codeRes?.data?.data?.calling_code || '+1');
      setFlag(codeRes?.data?.data?.flag_emoji || '🇺🇸');
    } catch (error) {
      console.error("Failed to load default country code", error);
      setCallingCode('+1');
      setFlag('🇺🇸');
    }
  };

  const toggleMenu = (addressId) => {
    setActiveMenu(activeMenu === addressId ? null : addressId);
  };

  const handleEdit = (address) => {
    try {
      setSelectedAddress(address);
      dispatch(frontendAddressActions.edit(address.id));
      setActiveMenu(null); // Close the menu
      
      // For demo purposes
      setStates([
        { name: 'California', code: 'CA' },
        { name: 'New York', code: 'NY' }
      ]);
      
      if (address.state) {
        setCities([
          { name: 'Los Angeles', code: 'LA' },
          { name: 'San Francisco', code: 'SF' }
        ]);
      }
      
      setModalVisible(true);
    } catch (error) {
      console.error("Error in handleEdit:", error);
      alertService.error("Failed to load address details");
    }
  };

  const handleDelete = (addressId) => {
    setActiveMenu(null); // Close the menu
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => confirmDelete(addressId)
        }
      ]
    );
  };

  const confirmDelete = async (addressId) => {
    try {
      await dispatch(frontendAddressActions.destroy({ id: addressId }));
      alertService.success("Address deleted successfully");
      dispatch(frontendAddressActions.lists());
    } catch (error) {
      console.error("Delete error:", error);
      alertService.error(error.message || "Failed to delete address");
    }
  };

  const resetForm = () => {
    setSelectedAddress(null);
    dispatch(frontendAddressActions.reset());
    setStates([]);
    setCities([]);
  };

  const formatAddressText = (address) => {
    if (!address) return '';
    
    const parts = [
      address.full_name,
      address.email,
      address.phone,
      address.address,
      address.city,
      address.state,
      address.country,
      address.zip_code
    ].filter(Boolean);
    
    return parts.join(", ");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Addresses</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4B6FED" style={styles.loader} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <View key={address.id} style={styles.addressCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.name} numberOfLines={1}>
                    {address.full_name || 'No Name'}
                  </Text>
                  <View style={styles.menuContainer}>
                    <TouchableOpacity onPress={() => toggleMenu(address.id)}>
                      <Text style={styles.menuIcon}>•••</Text>
                    </TouchableOpacity>
                    
                    {activeMenu === address.id && (
                      <View 
                        style={styles.dropdownMenu}
                        ref={ref => menuRefs.current[address.id] = ref}
                      >
                        <TouchableOpacity
                          style={styles.menuItem}
                          onPress={() => handleEdit(address)}
                        >
                          <Text style={styles.menuItemText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.menuItem}
                          onPress={() => handleDelete(address.id)}
                        >
                          <Text style={[styles.menuItemText, styles.deleteText]}>
                            Delete
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
                <Text style={styles.addressText}>
                  {formatAddressText(address)}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No addresses saved yet</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              resetForm();
              setModalVisible(true);
            }}
          >
            <Text style={styles.addButtonText}>+ Add New Address</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <AddressCreateComponent
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          resetForm();
        }}
        address={selectedAddress}
        countries={countries}
        states={states}
        cities={cities}
        flag={flag}
        callingCode={callingCode}
        onSuccess={() => {
          setModalVisible(false);
          dispatch(frontendAddressActions.lists());
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingBottom: 16,
  },
  addressCard: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  menuContainer: {
    position: 'relative',
    zIndex: 1,
  },
  menuIcon: {
    color: '#3B82F6',
    fontSize: 16,
    padding: 8,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 120,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  deleteText: {
    color: '#EF4444',
  },
  addressText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  addButton: {
    width: '100%',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEDD5',
    borderWidth: 2,
    borderColor: '#F97316',
    borderStyle: 'dashed',
    marginTop: 16,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F97316',
  },
});

export default AddressListComponent;