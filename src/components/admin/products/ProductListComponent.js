import React, { useCallback, useEffect, useState, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  MaterialIcons,
  Ionicons,
  Feather,
  FontAwesome,
} from "@expo/vector-icons";
import {
  listProducts,
  deleteProduct,
} from "../../../store/actions/productActions";
import LoadingComponent from "../components/LoadingComponent";
import ProductCreateComponent from "./ProductCreateComponent";
import { Picker } from "@react-native-picker/picker";
import statusEnum from "../../../enums/modules/statusEnum";
import appService from "../../../../services/appService";
import { productBrandActions } from "../../../store/actions/productBrandActions";
import { taxActions } from "../../../store/actions/taxActions";
import { fetchBarcode } from "../../../store/actions/barcodeActions";
import { unitActions } from "../../../store/actions/unitActions";
import { productCategoryActions } from "../../../store/actions/productCategoryActions";
import alertService from "../../../../services/alertService";

const initialSearchState = {
  paginate: 1,
  page: 1,
  per_page: 10,
  order_column: "id",
  order_type: "desc",
  name: "",
  sku: "",
  buying_price: "",
  selling_price: "",
  product_category_id: null,
  product_brand_id: null,
  barcode_id: null,
  tax_id: null,
  unit_id: null,
  status: null,
  can_purchasable: null,
  show_stock_out: null,
  refundable: null,
};

const ProductListComponent = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [search, setSearch] = useState(initialSearchState);

  const { lists, pagination, page } = useSelector(state => state.product);
  const productCategories = useSelector(state => state.productCategory.lists);
  const productBrands = useSelector(state => state.productBrand.lists);
  const taxes = useSelector(state => state.tax.lists);
  const units = useSelector(state => state.unit.lists);
  const barcode = useSelector(state => state.barcode.lists);

  // Load initial data
  useEffect(
    () => {
      setLoading(true);
      Promise.all([
        dispatch(productCategoryActions.lists()),
        dispatch(productBrandActions.lists()),
        dispatch(unitActions.lists()),
        dispatch(taxActions.lists()),
        dispatch(fetchBarcode()),
        dispatch(listProducts(initialSearchState)),
      ]).finally(() => setLoading(false));
    },
    [dispatch]
  );

  const fetchProducts = (page = 1) => {
    setLoading(true);
    const payload = { ...search, page };
    dispatch(listProducts(payload))
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };

  const handleDelete = useCallback(
    productId => {
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this product?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            onPress: () => {
              setLoading(true);
              dispatch(deleteProduct(productId))
                .then(() => {
                  alertService.success("Product deleted successfully");
                  fetchProducts();
                })
                .finally(() => setLoading(false));
            },
            style: "destructive",
          },
        ]
      );
    },
    [dispatch]
  );

  const handleEdit = useCallback(product => {
    setCurrentProductId(product.id);
    setShowCreateModal(true);
  }, []);

  const handleSearch = useCallback(
    () => {
      fetchProducts();
    },
    [search]
  );

  const handleClear = useCallback(() => {
    setSearch(initialSearchState);
    fetchProducts();
  }, []);

  const closeModal = useCallback(() => {
    setShowCreateModal(false);
    setCurrentProductId(null);
    fetchProducts();
  }, []);

  const statusClass = status => {
    return status === statusEnum.ACTIVE
      ? styles.statusActive
      : styles.statusInactive;
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Products</Text>
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
              onPress={() => setShowCreateModal(true)}
            >
              <Text style={styles.addButtonText}>Add Product</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Create Product Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={false}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <ProductCreateComponent
            onClose={closeModal}
            isEditing={!!currentProductId}
            productId={currentProductId}
          />
        </View>
      </Modal>

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
                <Text style={styles.label}>SKU</Text>
                <TextInput
                  style={styles.input}
                  value={search.sku}
                  onChangeText={text => setSearch({ ...search, sku: text })}
                  placeholder="Search by SKU"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.searchField}>
                <Text style={styles.label}>Buying Price</Text>
                <TextInput
                  style={styles.input}
                  value={search.buying_price}
                  onChangeText={text =>
                    setSearch({ ...search, buying_price: text })}
                  placeholder="Search by buying price"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.searchField}>
                <Text style={styles.label}>Selling Price</Text>
                <TextInput
                  style={styles.input}
                  value={search.selling_price}
                  onChangeText={text =>
                    setSearch({ ...search, selling_price: text })}
                  placeholder="Search by selling price"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.searchField}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={search.product_category_id}
                    onValueChange={value =>
                      setSearch({ ...search, product_category_id: value })}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Category" value={null} />
                    {productCategories.map(category =>
                      <Picker.Item
                        key={category.id}
                        label={category.name}
                        value={category.id}
                      />
                    )}
                  </Picker>
                </View>
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
                    <Picker.Item label="Select Status" value={null} />
                    <Picker.Item label="Active" value={statusEnum.ACTIVE} />
                    <Picker.Item label="Inactive" value={statusEnum.INACTIVE} />
                  </Picker>
                </View>
              </View>
            </View>
            <View style={styles.searchButtons}>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
              >
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClear}
              >
                <Text style={styles.buttonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>}

        {/* Product List */}
        {loading
          ? <LoadingComponent />
          : <View style={styles.listSection}>
              <View style={styles.listContainer}>
                <View style={styles.listHeader}>
                  <Text style={[styles.headerText, { flex: 2 }]}>Name</Text>
                  <Text style={styles.headerText}>Buy Price</Text>
                  <Text style={styles.headerText}>Sell Price</Text>
                  <Text style={styles.headerText}>Status</Text>
                  <Text style={[styles.headerText, { flex: 1.2 }]}>
                    Actions
                  </Text>
                </View>
                {lists.length > 0
                  ? lists.map(product =>
                      <View key={product.id} style={styles.listItem}>
                        <Text style={[styles.itemText, { flex: 2 }]}>
                          {appService.textShortener(product.name, 20)}
                        </Text>
                        <Text style={styles.itemText}>
                          {product.flat_buying_price}
                        </Text>
                        <Text style={styles.itemText}>
                          {product.flat_selling_price}
                        </Text>
                        <Text
                          style={[
                            styles.statusText,
                            statusClass(product.status),
                          ]}
                        >
                          {statusEnum[product.status]}
                        </Text>
                        <View style={[styles.actions, { flex: 1.2 }]}>
                          <TouchableOpacity
                            onPress={() => handleEdit(product)}
                            style={styles.actionButton}
                          >
                            <Feather name="edit" size={16} color="#d97706" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleDelete(product.id)}
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
                      <Text style={styles.noItems}>No products found</Text>
                    </View>}
              </View>
            </View>}
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
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  closeButton: {
    fontSize: 24,
    color: "#6b7280",
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
});

export default ProductListComponent;
