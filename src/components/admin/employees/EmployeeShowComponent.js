import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  FlatList,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { employeeActions } from '../../../store/actions/employeeActions';
import { useRoute, useNavigation } from '@react-navigation/native';
import LoadingComponent from '../components/LoadingComponent';
import EmployeeAddressList from './address/EmployeeAddressList';
import PaginationTextComponent from '../components/pagination/PaginationTextComponent';
import PaginationBox from '../components/pagination/PaginationBox';
import PaginationSMBox from '../components/pagination/PaginationSMBox';
import appService from '../../../../services/appService';
import alertService from '../../../../services/alertService';

const EmployeeShowComponent = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { show: employee, myOrders, orderPagination, orderPage } = useSelector((state) => state.employee);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [passwordForm, setPasswordForm] = useState({
    password: '',
    password_confirmation: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [defaultImage, setDefaultImage] = useState(null);
  const [uploadButton, setUploadButton] = useState(true);
  const [resetButton, setResetButton] = useState(false);
  const [saveButton, setSaveButton] = useState(false);
  const [search, setSearch] = useState({
    paginate: 1,
    page: 1,
    per_page: 9,
    order_column: 'id',
    active: 5,
  });
  useEffect(() => {
    if (route.params?.id) {
      setLoading(true);
      dispatch(employeeActions.show(route.params.id))
        .then((res) => {
          setDefaultImage(res.data.data.image);
          setPreviewImage(res.data.data.image);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
    orderLists();
  }, [route.params?.id]);

  const orderLists = (page = 1) => {
    setLoading(true);
    const payload = { ...search, page, id: route.params.id };
    dispatch(employeeActions.myOrders(payload))
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };

  const changePassword = () => {
    setLoading(true);
    const payload = {
      form: passwordForm,
      id: route.params.id,
    };
    dispatch(employeeActions.changePassword(payload))
      .then(() => {
        setLoading(false);
        alertService.success('Password updated successfully');
        setPasswordForm({
          password: '',
          password_confirmation: '',
        });
        setPasswordErrors({});
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.data.errors) {
          setPasswordErrors(err.response.data.errors);
        }
      });
  };

  const changePreviewImage = (image) => {
    if (image) {
      setPreviewImage(image.uri);
      setSaveButton(true);
      setResetButton(true);
    }
  };

  const resetPreviewImage = () => {
    setPreviewImage(defaultImage);
    setSaveButton(false);
    setResetButton(false);
  };


  const statusClass = (status) => {
    return status === 5 ? styles.statusActive : styles.statusInactive;
  };

  const orderStatusClass = (status) => {
    return status === 'delivered' ? styles.statusDelivered : styles.statusPending;
  };

  const textShortener = (text, number = 30) => {
    return appService.textShortener(text, number);
  };

  if (loading && Object.keys(employee).length === 0) {
    return <LoadingComponent />;
  }

  return (
    <View style={styles.container}>
      {loading && <LoadingComponent />}

      {Object.keys(employee).length > 0 && (
        <ScrollView style={styles.scrollContainer}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: previewImage || 'https://via.placeholder.com/120' }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{textShortener(employee.name, 20)}</Text>
              <Text style={styles.roleBadge}>
                {employee.role}
              </Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
              onPress={() => setActiveTab('profile')}
            >
              <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
                Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'security' && styles.activeTab]}
              onPress={() => setActiveTab('security')}
            >
              <Text style={[styles.tabText, activeTab === 'security' && styles.activeTabText]}>
                Security
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'address' && styles.activeTab]}
              onPress={() => setActiveTab('address')}
            >
              <Text style={[styles.tabText, activeTab === 'address' && styles.activeTabText]}>
                Address
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
              onPress={() => setActiveTab('orders')}
            >
              <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>
                Orders
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === 'profile' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{employee.email}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{employee.country_code}{employee.phone}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Status</Text>
                  <Text style={[styles.statusBadge, statusClass(employee.status)]}>
                    {employee.status === 5 ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'security' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Change Password</Text>
              <View style={styles.infoCard}>
                <View style={styles.formItem}>
                  <Text style={styles.formLabel}>New Password *</Text>
                  <TextInput
                    style={[styles.formInput, passwordErrors.password && styles.inputError]}
                    value={passwordForm.password}
                    onChangeText={(text) => setPasswordForm({ ...passwordForm, password: text })}
                    secureTextEntry
                  />
                  {passwordErrors.password && (
                    <Text style={styles.errorText}>{passwordErrors.password[0]}</Text>
                  )}
                </View>
                <View style={styles.formItem}>
                  <Text style={styles.formLabel}>Confirm Password *</Text>
                  <TextInput
                    style={[styles.formInput, passwordErrors.password_confirmation && styles.inputError]}
                    value={passwordForm.password_confirmation}
                    onChangeText={(text) => setPasswordForm({ ...passwordForm, password_confirmation: text })}
                    secureTextEntry
                  />
                  {passwordErrors.password_confirmation && (
                    <Text style={styles.errorText}>{passwordErrors.password_confirmation[0]}</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={changePassword}
                >
                  <Text style={styles.submitButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {activeTab === 'address' && (
            <View style={styles.tabContent}>
              <EmployeeAddressList props={route.params.id} />
            </View>
          )}

          {activeTab === 'orders' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Orders</Text>
              {myOrders.length > 0 ? (
                <View>
                  <FlatList
                    data={myOrders}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={1}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.orderCard}
                        onPress={() => navigation.navigate('EmployeeOrderDetails', { 
                          id: route.params.id, 
                          orderId: item.id 
                        })}
                      >
                        <View style={styles.orderHeader}>
                          <Text style={styles.orderNumber}>Order #{item.order_serial_no}</Text>
                          <Text style={[styles.orderStatus, orderStatusClass(item.status)]}>
                            {item.status_name}
                          </Text>
                        </View>
                        <Text style={styles.orderDetail}>{item.order_items} products</Text>
                        <Text style={styles.orderDetail}>{item.order_datetime}</Text>
                        <View style={styles.orderFooter}>
                          <Text style={styles.orderTotal}>Total: {item.total_currency_price}</Text>
                          <Text style={styles.orderLink}>See order details →</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                  <View style={styles.paginationContainer}>
                    <PaginationSMBox pagination={orderPagination} method={orderLists} />
                    <View style={styles.paginationControls}>
                      <PaginationTextComponent page={orderPage} />
                      <PaginationBox pagination={orderPagination} method={orderLists} />
                    </View>
                  </View>
                </View>
              ) : (
                <Text style={styles.noOrdersText}>No orders found</Text>
              )}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 8,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  roleBadge: {
    fontSize: 12,
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  imageButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  uploadButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  resetButton: {
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
  },
  resetButtonText: {
    color: '#EF4444',
    fontSize: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  tabContent: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    padding: 16,
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
  },
  statusBadge: {
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusActive: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
  statusInactive: {
    backgroundColor: '#FEE2E2',
    color: '#B91C1C',
  },
  formItem: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 4,
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  orderCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderNumber: {
    fontWeight: '500',
  },
  orderStatus: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDelivered: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  orderDetail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  orderTotal: {
    fontWeight: '500',
  },
  orderLink: {
    color: '#3B82F6',
    fontSize: 12,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  paginationControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noOrdersText: {
    textAlign: 'center',
    color: '#6B7280',
  },
});

export default EmployeeShowComponent;