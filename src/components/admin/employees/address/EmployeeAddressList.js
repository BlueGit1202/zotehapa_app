import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { employeeAddressActions } from "../../../../store/actions/employeeAddressActions";
import LoadingComponent from "../../components/LoadingComponent";
import EmployeeAddressCreateComponent from "./EmployeeAddressCreateComponent";
import TableLimitComponent from "../../components/TableLimitComponent";
import PaginationTextComponent from "../../components/pagination/PaginationTextComponent";
import PaginationBox from "../../components/pagination/PaginationBox";
import PaginationSMBox from "../../components/pagination/PaginationSMBox";
import worldMapData from "city-state-country";
import { fetchCallingCode } from "../../../../store/actions/countryCodeActions";

const EmployeeAddressList = ({ props: employeeId }) => {
  const dispatch = useDispatch();
  const { lists, pagination, page } = useSelector(
    state => state.employeeAddress
  );
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState({
    paginate: 1,
    page: 1,
    per_page: 10,
    order_column: "id",
    order_type: "desc"
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    id: null,
    full_name: "",
    email: "",
    country_code: "+1",
    phone: "",
    country: null,
    state: null,
    city: null,
    zip_code: "",
    address: ""
  });
  const [editStates, setEditStates] = useState([]);
  const [editCities, setEditCities] = useState([]);
  const [editFlag, setEditFlag] = useState("");

  useEffect(() => {
    list();
  }, [employeeId]);

  const list = (page = 1) => {
    setLoading(true);
    const payload = { id: employeeId, search: { ...search, page } };
    dispatch(employeeAddressActions.lists(payload))
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };

  const destroy = addressId => {
    Alert.alert(
      "confirmation",
      "Are you going to delete this?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            setLoading(true);
            dispatch(employeeAddressActions.destroy({
              id: employeeId,
              addressId,
              search
            }))
            .then(() => {
              alertService.success("Address deleted successfully");
              list();
            })
            .finally(() => setLoading(false));
          }
        }
      ]
    );
  };

  const edit = (address) => {
    setLoading(true);
    setEditModalVisible(true);
    
    // Set initial form values
    setEditForm({
      id: address.id,
      full_name: address.full_name,
      email: address.email,
      country_code: address.country_code,
      phone: address.phone,
      country: address.country || null,
      state: address.state || null,
      city: address.city || null,
      zip_code: address.zip_code,
      address: address.address
    });

    // Load states and cities if country/state exists
    if (address.country) {
      const states = worldMapData.getAllStatesFromCountry(address.country);
      setEditStates(states);
      
      if (address.state) {
        const cities = worldMapData.getAllCitiesFromState(address.state);
        setEditCities(cities);
      }
    }

    // Get flag for country code
    dispatch(fetchCallingCode(address.country_code))
      .then(res => {
        setEditFlag(res.data.data.flag_emoji);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleEditChange = (name, value) => {
    setEditForm(prev => ({ ...prev, [name]: value }));
    
    // Handle country/state changes to load appropriate states/cities
    if (name === 'country') {
      const states = worldMapData.getAllStatesFromCountry(value);
      setEditStates(states);
      setEditCities([]);
      setEditForm(prev => ({ 
        ...prev, 
        state: null,
        city: null 
      }));
    }
    
    if (name === 'state') {
      const cities = worldMapData.getAllCitiesFromState(value);
      setEditCities(cities);
      setEditForm(prev => ({ 
        ...prev, 
        city: null 
      }));
    }
  };

  const updateAddress = () => {
    setLoading(true);
    dispatch(employeeAddressActions.save({
      id: employeeId,
      form: editForm,
      search
    }))
    .then(() => {
      alertService.success("Address updated successfully");
      setEditModalVisible(false);
      list();
    })
    .catch(err => {
      alertService.error(err.response?.data?.message || "Something went wrong");
    })
    .finally(() => setLoading(false));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{"Address"}</Text>
      </View>

      {loading ? (
        <LoadingComponent />
      ) : (
        <View style={styles.content}>
          {/* Table Header */}
          <ScrollView horizontal style={styles.tableHeader}>
            <View style={styles.headerRow}>
              <Text style={styles.headerCell}>{"name"}</Text>
              <Text style={styles.headerCell}>{"email"}</Text>
              <Text style={styles.headerCell}>{"phone"}</Text>
              <Text style={styles.headerCell}>{"address"}</Text>
              <Text style={styles.headerCell}>{"country"}</Text>
              <Text style={styles.headerCell}>{"state"}</Text>
              <Text style={styles.headerCell}>{"city"}</Text>
              <Text style={styles.headerCell}>{"zip_code"}</Text>
              <Text style={styles.headerCell}>{"action"}</Text>
            </View>
          </ScrollView>

          {/* Table Body */}
          {lists.length > 0 ? (
            <FlatList
              data={lists}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <ScrollView horizontal style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.full_name}</Text>
                  <Text style={styles.tableCell}>{item.email || '-'}</Text>
                  <Text style={styles.tableCell}>
                    {item.country_code} {item.phone}
                  </Text>
                  <Text style={styles.tableCell}>{item.address}</Text>
                  <Text style={styles.tableCell}>{item.country || '-'}</Text>
                  <Text style={styles.tableCell}>{item.state || '-'}</Text>
                  <Text style={styles.tableCell}>{item.city || '-'}</Text>
                  <Text style={styles.tableCell}>{item.zip_code || '-'}</Text>
                  <View style={styles.actionCell}>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => edit(item)}
                    >
                      <Text style={styles.editButtonText}>{"Edit"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => destroy(item.id)}
                    >
                      <Text style={styles.deleteButtonText}>{"Delete"}</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}
            />
          ) : (
            <Text style={styles.emptyMessage}>{"No addresses found"}</Text>
          )}

          {/* Pagination */}
          <View style={styles.paginationContainer}>
            <PaginationSMBox pagination={pagination} method={list} />
            <View style={styles.paginationDesktop}>
              <PaginationTextComponent page={page} />
              <PaginationBox pagination={pagination} method={list} />
            </View>
          </View>
        </View>
      )}

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <ScrollView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{"Edit Address"}</Text>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <Text style={styles.closeButton}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Reuse the create component for editing */}
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  tableHeader: {
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 8,
    minWidth: '100%',
  },
  headerCell: {
    width: 120,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 12,
    paddingHorizontal: 8,
    minWidth: '100%',
  },
  tableCell: {
    width: 120,
    paddingHorizontal: 8,
  },
  actionCell: {
    width: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  editButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  editButtonText: {
    color: 'white',
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
  },
  emptyMessage: {
    textAlign: 'center',
    padding: 16,
    color: '#6b7280',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  paginationDesktop: {
    display: 'none', // Will be shown on larger screens with media queries
  },
  modalContainer: {
    flex: 1,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    color: '#6b7280',
  },
};

export default EmployeeAddressList;
