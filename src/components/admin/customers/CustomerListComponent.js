import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Alert,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import {
  MaterialIcons,
  Ionicons,
  Feather,
  FontAwesome,
} from "@expo/vector-icons";
import LoadingComponent from "../components/LoadingComponent";
import PaginationWrapper from "../components/PaginationWrapper";
import { customerActions } from "../../../store/actions/customerActions";
import PaginationTextComponent from "../components/pagination/PaginationTextComponent";
import PaginationBox from "../components/pagination/PaginationBox";
import PaginationSMBox from "../components/pagination/PaginationSMBox";
import statusEnum from "../../../enums/modules/statusEnum";
import appService from "../../../../services/appService";

const CustomerListComponent = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { lists, pagination, page } = useSelector(state => state.customer);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const [search, setSearch] = useState({
    paginate: 1,
    page: 1,
    per_page: 10,
    order_column: "id",
    order_type: "desc",
    name: "",
    email: "",
    phone: "",
    status: null,
  });

  useEffect(() => {
    fetchCustomers();
    list();
  }, []);

  const list = (page = 1) => {
    setLoading(true);
    const payload = { ...search, page };
    dispatch(customerActions.lists(payload))
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };

  const fetchCustomers = (page = 1) => {
    setLoading(true);
    const payload = { ...search, page };
    dispatch(customerActions.lists(payload))
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };

  const handleDelete = async id => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this customer?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              setLoading(true);
              await dispatch(
                customerActions.destroy({
                  id,
                  search: {
                    paginate: search.paginate,
                    page: search.page,
                    per_page: search.per_page,
                    order_column: search.order_column,
                    order_type: search.order_type,
                  },
                })
              );
              alertService.success("Customer deleted successfully");
            } catch (error) {
              console.error("Delete error:", error);
              alertService.error("Failed to delete customer");
            } finally {
              setLoading(false);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const edit = customer => {
    navigation.navigate("CustomerEdit", { customer });
  };

  const searchHandler = () => {
    fetchCustomers();
  };

  const clear = () => {
    setSearch({
      paginate: 1,
      page: 1,
      name: "",
      email: "",
      phone: "",
      status: null,
    });
    fetchCustomers();
  };

  const statusClass = status => {
    return status === statusEnum.ACTIVE
      ? styles.statusActive
      : styles.statusInactive;
  };

  const textShortener = (text, number = 30) => {
    return appService.textShortener(text, number);
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Customers</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.searchIconButton}
              onPress={() => setShowSearch(!showSearch)}
            >
              <Ionicons
                name={showSearch ? "search" : "search-outline"}
                size={24}
                color="#3b82f6"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("CustomerCreate")}
            >
              <Text style={styles.addButtonText}>Add Customer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content}>
        {/* Search Section */}
        {showSearch &&
          <View style={styles.searchSection}>
            <Text style={styles.sectionTitle}>Search Filters</Text>
            <View style={styles.searchFields}>
              <View style={styles.searchField}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={search.name}
                  onChangeText={text => setSearch({ ...search, name: text })}
                  placeholder="Search by name"
                />
              </View>
              <View style={styles.searchField}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={search.email}
                  onChangeText={text => setSearch({ ...search, email: text })}
                  placeholder="Search by email"
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.searchField}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={search.phone}
                  onChangeText={text => setSearch({ ...search, phone: text })}
                  placeholder="Search by phone"
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.searchField}>
                <Text style={styles.label}>Status</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={search.status}
                    onValueChange={value =>
                      setSearch({ ...search, status: value })}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select status" value={null} />
                    <Picker.Item label="Active" value={statusEnum.ACTIVE} />
                    <Picker.Item label="Inactive" value={statusEnum.INACTIVE} />
                  </Picker>
                </View>
              </View>
            </View>
            <View style={styles.searchButtons}>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={searchHandler}
              >
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.clearButton} onPress={clear}>
                <Text style={styles.buttonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>}

        {/* Customer List */}
        {loading
          ? <LoadingComponent />
          : <View style={styles.listSection}>
              <View style={styles.listContainer}>
                <View style={styles.listHeader}>
                  <Text style={[styles.headerText, { flex: 1.5 }]}>Name</Text>
                  <Text style={styles.headerText}>Email</Text>
                  <Text style={styles.headerText}>Phone</Text>
                  <Text style={styles.headerText}>Status</Text>
                  <Text style={[styles.headerText, { flex: 1.2 }]}>
                    Actions
                  </Text>
                </View>
                {lists.length > 0
                  ? lists.map(customer =>
                      <View key={customer.id} style={styles.listItem}>
                        <Text style={[styles.itemText, { flex: 1.5 }]}>
                          {textShortener(customer.name, 20)}
                        </Text>
                        <Text style={styles.itemText}>
                          {textShortener(customer.email, 15)}
                        </Text>
                        <Text style={styles.itemText}>
                          {customer.phone
                            ? customer.country_code + customer.phone
                            : "-"}
                        </Text>
                        <Text
                          style={[
                            styles.statusText,
                            statusClass(customer.status),
                          ]}
                        >
                          {customer.status === statusEnum.ACTIVE
                            ? "Active"
                            : "Inactive"}
                        </Text>
                        <View style={[styles.actions, { flex: 1.2 }]}>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate("CustomerShow", {
                                id: customer.id,
                              })}
                            style={styles.actionButton}
                          >
                            <FontAwesome name="eye" size={16} color="#3b82f6" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => edit(customer)}
                            style={styles.actionButton}
                          >
                            <Feather name="edit" size={16} color="#d97706" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleDelete(customer.id)}
                            style={styles.actionButton}
                          >
                            <MaterialIcons
                              name="delete-outline"
                              size={18}
                              color="#ef4444"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )
                  : <View style={styles.noItemsContainer}>
                      <Text style={styles.noItems}>No customers found</Text>
                    </View>}
              </View>
            </View>}

        <View style={styles.paginationContainer}>
          <PaginationSMBox pagination={pagination} method={list} />
          <View style={styles.paginationLarge}>
            <PaginationTextComponent page={page} />
            <PaginationBox pagination={pagination} method={list} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchIconButton: {
    marginRight: 12,
    padding: 6,
  },
  actionButton: {
    padding: 6,
  },
  addButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    elevation: 2,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchSection: {
    marginBottom: 20,
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1f2937",
  },
  searchFields: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  searchField: {
    width: "48%",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#4b5563",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
  },
  picker: {
    height: 40,
  },
  searchButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  searchButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    marginRight: 12,
    elevation: 2,
  },
  clearButton: {
    backgroundColor: "#6b7280",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  listSection: {
    marginBottom: 20,
  },
  listContainer: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    overflow: "hidden",
  },
  listHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerText: {
    flex: 1,
    fontWeight: "600",
    color: "#374151",
    fontSize: 14,
    textAlign: "center",
  },
  listItem: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    alignItems: "center",
  },
  itemText: {
    flex: 1,
    fontSize: 13,
    color: "#4b5563",
    textAlign: "center",
  },
  statusText: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    textTransform: "uppercase",
  },
  statusActive: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  statusInactive: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  actions: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  noItemsContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  noItems: {
    color: "#6b7280",
    fontSize: 16,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 8,
  },
});

export default CustomerListComponent;
