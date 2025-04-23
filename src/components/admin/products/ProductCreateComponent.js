import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Modal,
  FlatList,
  Alert
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from '@react-navigation/native';
import { 
  saveProduct, 
  getSku, 
  updateProduct,
  showProduct,
  editProduct
} from "../../../store/actions/productActions";
import LoadingComponent from "../components/LoadingComponent";
import statusEnum from "../../../enums/modules/statusEnum";
import askEnum from "../../../enums/modules/askEnum";
import activityEnum from "../../../enums/modules/activityEnum";
import appService from "../../../../services/appService";
import alertService from "../../../../services/alertService";
import { MaterialIcons, Feather } from '@expo/vector-icons';

const ProductCreateComponent = ({ onClose, isEditing, productId }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    sku: "",
    product_category_id: null,
    product_category_name: "",
    barcode_id: null,
    buying_price: "",
    selling_price: "",
    tax_id: null,
    product_brand_id: null,
    product_brand_name: "",
    status: statusEnum.ACTIVE,
    can_purchasable: askEnum.YES,
    show_stock_out: activityEnum.DISABLE,
    refundable: askEnum.NO,
    maximum_purchase_quantity: "",
    low_stock_quantity_warning: "",
    unit_id: null,
    weight: "",
    tags: "",
    convertTags: [],
    description: ""
  });

  // Redux state
  const { loading, sku: generatedSku, show } = useSelector(state => state.product);
  const productCategories = useSelector(state => state.productCategory.lists);
  const productBrands = useSelector(state => state.productBrand.lists);
  const taxes = useSelector(state => state.tax.lists);
  const units = useSelector(state => state.unit.lists);
  const barcodes = useSelector(state => state.barcode.lists);
  const auth = useSelector(state => state.auth.authInfo);

  

  // State for popup selectors
    const navigation = useNavigation();
  const [currentProduct, setCurrentProduct] = useState({});
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [categoryInputRef, setCategoryInputRef] = useState(null);
const [brandInputRef, setBrandInputRef] = useState(null);

  // Initialize component
  useEffect(() => {
    // Initialize filtered lists
    setFilteredCategories(productCategories || []);
    setFilteredBrands(productBrands || []);
    
    // Generate initial SKU when creating new product
    if (!isEditing) {
      dispatch(getSku());
    }
  }, [dispatch, isEditing]);

  // Load product data when editing
 useEffect(() => {
  const loadProductData = async () => {
    if (isEditing && productId) {
      try {
        await dispatch(showProduct(productId))
        await dispatch(editProduct(productId));
        setCurrentProduct(show.data);
        // Set the product data from the response
      } catch (error) {
        alertService.error("Failed to load product data");
        onClose();
      }
    } else if (!isEditing) {
      dispatch(getSku());
    }
  };

  loadProductData();
}, [isEditing, productId, dispatch, onClose]);

  // Update form when currentProduct changes (for editing)
  useEffect(() => {
    if (isEditing && currentProduct) {
      setForm({
        name: currentProduct.name || "",
        sku: currentProduct.sku || "",
        product_category_id: currentProduct.product_category_id || null,
        product_category_name: currentProduct.product_category?.name || "",
        barcode_id: currentProduct.barcode_id || null,
        buying_price: currentProduct.buying_price?.toString() || "",
        selling_price: currentProduct.selling_price?.toString() || "",
        tax_id: currentProduct.tax_id || null,
        product_brand_id: currentProduct.product_brand_id || null,
        product_brand_name: currentProduct.product_brand?.name || "",
        status: currentProduct.status || statusEnum.ACTIVE,
        can_purchasable: currentProduct.can_purchasable || askEnum.YES,
        show_stock_out: currentProduct.show_stock_out || activityEnum.DISABLE,
        refundable: currentProduct.refundable || askEnum.NO,
        maximum_purchase_quantity: currentProduct.maximum_purchase_quantity?.toString() || "",
        low_stock_quantity_warning: currentProduct.low_stock_quantity_warning?.toString() || "",
        unit_id: currentProduct.unit_id || null,
        weight: currentProduct.weight?.toString() || "",
        tags: currentProduct.tags || "",
        convertTags: currentProduct.convertTags || [],
        description: currentProduct.description || ""
      });
    }
  }, [currentProduct, isEditing]);

  // Update filtered categories when search changes
  useEffect(() => {
    if (productCategories) {
      setFilteredCategories(
        productCategories.filter(category =>
          category.name.toLowerCase().includes(categorySearch.toLowerCase()))
      );
    }
  }, [categorySearch, productCategories]);

  // Update filtered brands when search changes
  useEffect(() => {
    if (productBrands) {
      setFilteredBrands(
        productBrands.filter(brand =>
          brand.name.toLowerCase().includes(brandSearch.toLowerCase()))
      );
    }
  }, [brandSearch, productBrands]);

  // Update form SKU when generatedSku changes (for new products only)
  useEffect(() => {
    if (!isEditing && generatedSku) {
      setForm(prevForm => ({
        ...prevForm,
        sku: generatedSku
      }));
    }
  }, [generatedSku, isEditing]);

  const generateNewSku = () => {
    dispatch(getSku());
  };
  const handleSave = () => {
    // Validate required fields
    if (!form.name || !form.sku || !form.buying_price || !form.selling_price) {
      alertService.error("Please fill in all required fields");
      return;
    }
    
    const transformData = {
      ...form,
      tags: form.tags || "[]",
      tax_id: form.tax_id ? [form.tax_id] : [],
      sku: `${ form.sku }`,
    };
    delete transformData.product_brand_name;
    delete transformData.product_category_name;
    console.log("transformData",transformData)
    const payload = {
        form: { ...transformData},
        search: { paginate: 0, order_column: "id", order_type: "desc" }
      };
      dispatch(saveProduct(payload));
    alertService.success(
            isEditing 
              ? 'Product updated successfully' 
              : 'Product created successfully'
          );
        
  };

  const handleReset = () => {
    if (isEditing && currentProduct) {
      // Reset to original values
      setForm({
        name: currentProduct.name || "",
        sku: currentProduct.sku || "",
        product_category_id: currentProduct.product_category_id || null,
        product_category_name: currentProduct.product_category?.name || "",
        barcode_id: currentProduct.barcode_id || null,
        buying_price: currentProduct.buying_price?.toString() || "",
        selling_price: currentProduct.selling_price?.toString() || "",
        tax_id: currentProduct.tax_id || null,
        product_brand_id: currentProduct.product_brand_id || null,
        product_brand_name: currentProduct.product_brand?.name || "",
        status: currentProduct.status || statusEnum.ACTIVE,
        can_purchasable: currentProduct.can_purchasable || askEnum.YES,
        show_stock_out: currentProduct.show_stock_out || activityEnum.DISABLE,
        refundable: currentProduct.refundable || askEnum.NO,
        maximum_purchase_quantity: currentProduct.maximum_purchase_quantity?.toString() || "",
        low_stock_quantity_warning: currentProduct.low_stock_quantity_warning?.toString() || "",
        unit_id: currentProduct.unit_id || null,
        weight: currentProduct.weight?.toString() || "",
        tags: currentProduct.tags || "",
        convertTags: currentProduct.convertTags || [],
        description: currentProduct.description || ""
      });
    } else {
      // Reset to empty form
      setForm({
        name: "",
        sku: generatedSku || "",
        product_category_id: null,
        product_category_name: "",
        barcode_id: null,
        buying_price: "",
        selling_price: "",
        tax_id: null,
        product_brand_id: null,
        product_brand_name: "",
        status: statusEnum.ACTIVE,
        can_purchasable: askEnum.YES,
        show_stock_out: activityEnum.DISABLE,
        refundable: askEnum.NO,
        maximum_purchase_quantity: "",
        low_stock_quantity_warning: "",
        unit_id: null,
        weight: "",
        tags: "",
        convertTags: [],
        description: ""
      });
    }
  };

  const handleSelectBrand = (brand) => {
    setForm({
      ...form,
      product_brand_id: brand.id,
      product_brand_name: brand.name
    });
    setShowBrandModal(false);
    setBrandSearch("");
  };

  const handleSelectCategory = (category) => {
    setForm({
      ...form,
      product_category_id: category.id,
      product_category_name: category.name
    });
    setShowCategoryModal(false);
    setCategorySearch("");
  };

  // Update your modal opening handlers
const handleOpenCategoryModal = () => {
  setShowBrandModal(false); // Close brand modal if open
  setShowCategoryModal(true);
  setBrandSearch(""); // Clear brand search
  if (brandInputRef) brandInputRef.blur(); // Blur brand input
};

const handleOpenBrandModal = () => {
  setShowCategoryModal(false); // Close category modal if open
  setShowBrandModal(true);
  setCategorySearch(""); // Clear category search
  if (categoryInputRef) categoryInputRef.blur(); // Blur category input
};

 // Category Select Modal
const renderCategoryModal = () => (
  <Modal
    visible={showCategoryModal}
    animationType="slide"
    transparent={false}
    onRequestClose={() => {
      setShowCategoryModal(false);
      setCategorySearch("");
    }}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Select Category</Text>
        <TouchableOpacity 
          onPress={() => {
            setShowCategoryModal(false);
            setCategorySearch("");
          }}
        >
          <MaterialIcons name="close" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories..."
          value={categorySearch}
          onChangeText={setCategorySearch}
          autoFocus={true}
          ref={input => {
            if (input && showCategoryModal) {
              input.focus();
            }
          }}
          onSubmitEditing={() => {
            if (filteredCategories.length > 0) {
              handleSelectCategory(filteredCategories[0]);
            }
          }}
          blurOnSubmit={false}
        />
      </View>
      
      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => handleSelectCategory(item)}
          >
            <Text style={styles.listItemText}>{item.name}</Text>
            {form.product_category_id === item.id && (
              <MaterialIcons name="check" size={20} color="#3b82f6" />
            )}
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
        contentContainerStyle={styles.listContainer}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  </Modal>
);

// Update your renderBrandModal function
const renderBrandModal = () => (
  <Modal
    visible={showBrandModal}
    animationType="slide"
    transparent={false}
    onRequestClose={() => {
      setShowBrandModal(false);
      setBrandSearch("");
    }}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Select Brand</Text>
        <TouchableOpacity 
          onPress={() => {
            setShowBrandModal(false);
            setBrandSearch("");
          }}
        >
          <MaterialIcons name="close" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search brands..."
          value={brandSearch}
          onChangeText={setBrandSearch}
          autoFocus={true}
          ref={input => {
            if (input && showBrandModal) {
              input.focus();
            }
          }}
          onSubmitEditing={() => {
            if (filteredBrands.length > 0) {
              handleSelectBrand(filteredBrands[0]);
            }
          }}
          blurOnSubmit={false}
        />
      </View>
      
      <FlatList
        data={filteredBrands}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => handleSelectBrand(item)}
          >
            <Text style={styles.listItemText}>{item.name}</Text>
            {form.product_brand_id === item.id && (
              <MaterialIcons name="check" size={20} color="#3b82f6" />
            )}
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
        contentContainerStyle={styles.listContainer}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  </Modal>
);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {isEditing ? "Edit Product" : "Create New Product"}
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {loading && <LoadingComponent />}

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.formContainer}>
          {/* Name Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name*</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={text => setForm({ ...form, name: text })}
              placeholder="Enter product name"
            />
          </View>

          {/* SKU Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>SKU*</Text>
            <View style={styles.skuContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={form.sku}
                onChangeText={text => setForm({ ...form, sku: text })}
                placeholder="Enter SKU"
                keyboardType="numeric"
                onKeyPress={appService.onlyNumber}
              />
              {!isEditing && (
                <TouchableOpacity
                  style={styles.generateButton}
                  onPress={generateNewSku}
                >
                  <Text style={styles.generateButtonText}>Generate</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Category Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category*</Text>
            <TouchableOpacity
              style={styles.selectorInput}
              onPress={handleOpenCategoryModal}
            >
              <Text style={form.product_category_id ? styles.selectorText : styles.selectorPlaceholder}>
                {form.product_category_name || currentProduct?.category || "Select Category"}
              </Text>
              <MaterialIcons name="keyboard-arrow-down" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Barcode Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Barcode</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.barcode_id}
                onValueChange={value => setForm({ ...form, barcode_id: value })}
                style={styles.picker}
                dropdownIconColor="#6b7280"
              >
                <Picker.Item label="Select Barcode" value={null} />
                {barcodes.map(barcode => (
                  <Picker.Item
                    key={barcode.id}
                    label={barcode.name}
                    value={barcode.id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Price Fields */}
          <View style={styles.rowContainer}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Buying Price*</Text>
              <TextInput
                style={styles.input}
                value={form.buying_price}
                onChangeText={text => setForm({ ...form, buying_price: text })}
                placeholder="0.00"
                keyboardType="numeric"
                onKeyPress={appService.floatNumber}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Selling Price*</Text>
              <TextInput
                style={styles.input}
                value={form.selling_price}
                onChangeText={text => setForm({ ...form, selling_price: text })}
                placeholder="0.00"
                keyboardType="numeric"
                onKeyPress={appService.floatNumber}
              />
            </View>
          </View>

          {/* Tax Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tax</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.tax_id}
                onValueChange={value => setForm({ ...form, tax_id: value })}
                style={styles.picker}
                dropdownIconColor="#6b7280"
              >
                <Picker.Item label="Select Tax" value={null} />
                {taxes.map(tax => (
                  <Picker.Item key={tax.id} label={tax.name} value={tax.id} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Brand Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Brand</Text>
            <TouchableOpacity
              style={styles.selectorInput}
              onPress={handleOpenBrandModal}
            >
              <Text style={form.product_brand_id ? styles.selectorText : styles.selectorPlaceholder}>
                {form.product_brand_name || currentProduct?.brand || "Select Brand"}
              </Text>
              <MaterialIcons name="keyboard-arrow-down" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Status Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status*</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setForm({ ...form, status: statusEnum.ACTIVE })}
              >
                <View style={[
                  styles.radioOuter,
                  form.status === statusEnum.ACTIVE && styles.radioOuterSelected
                ]}>
                  {form.status === statusEnum.ACTIVE && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>Active</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setForm({ ...form, status: statusEnum.INACTIVE })}
              >
                <View style={[
                  styles.radioOuter,
                  form.status === statusEnum.INACTIVE && styles.radioOuterSelected
                ]}>
                  {form.status === statusEnum.INACTIVE && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>Inactive</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Purchasable Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Can Purchasable*</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setForm({ ...form, can_purchasable: askEnum.YES })}
              >
                <View style={[
                  styles.radioOuter,
                  form.can_purchasable === askEnum.YES && styles.radioOuterSelected
                ]}>
                  {form.can_purchasable === askEnum.YES && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setForm({ ...form, can_purchasable: askEnum.NO })}
              >
                <View style={[
                  styles.radioOuter,
                  form.can_purchasable === askEnum.NO && styles.radioOuterSelected
                ]}>
                  {form.can_purchasable === askEnum.NO && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Show Stock Out Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Show Stock Out*</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setForm({ ...form, show_stock_out: activityEnum.ENABLE })}
              >
                <View style={[
                  styles.radioOuter,
                  form.show_stock_out === activityEnum.ENABLE && styles.radioOuterSelected
                ]}>
                  {form.show_stock_out === activityEnum.ENABLE && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>Enable</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setForm({ ...form, show_stock_out: activityEnum.DISABLE })}
              >
                <View style={[
                  styles.radioOuter,
                  form.show_stock_out === activityEnum.DISABLE && styles.radioOuterSelected
                ]}>
                  {form.show_stock_out === activityEnum.DISABLE && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>Disable</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Refundable Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Refundable*</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setForm({ ...form, refundable: askEnum.YES })}
              >
                <View style={[
                  styles.radioOuter,
                  form.refundable === askEnum.YES && styles.radioOuterSelected
                ]}>
                  {form.refundable === askEnum.YES && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setForm({ ...form, refundable: askEnum.NO })}
              >
                <View style={[
                  styles.radioOuter,
                  form.refundable === askEnum.NO && styles.radioOuterSelected
                ]}>
                  {form.refundable === askEnum.NO && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quantity Fields */}
          <View style={styles.rowContainer}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Max Purchase Qty*</Text>
              <TextInput
                style={styles.input}
                value={form.maximum_purchase_quantity}
                onChangeText={text => setForm({ ...form, maximum_purchase_quantity: text })}
                placeholder="0"
                keyboardType="numeric"
                onKeyPress={appService.onlyNumber}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Low Stock Warning*</Text>
              <TextInput
                style={styles.input}
                value={form.low_stock_quantity_warning}
                onChangeText={text => setForm({ ...form, low_stock_quantity_warning: text })}
                placeholder="0"
                keyboardType="numeric"
                onKeyPress={appService.onlyNumber}
              />
            </View>
          </View>

          {/* Unit Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Unit*</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.unit_id}
                onValueChange={value => setForm({ ...form, unit_id: value })}
                style={styles.picker}
                dropdownIconColor="#6b7280"
              >
                <Picker.Item label="Select Unit" value={null} />
                {units.map(unit => (
                  <Picker.Item
                    key={unit.id}
                    label={unit.name_code}
                    value={unit.id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Weight Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={form.weight}
              onChangeText={text => setForm({ ...form, weight: text })}
              placeholder="0.00"
              keyboardType="numeric"
              onKeyPress={appService.floatNumber}
            />
          </View>

          {/* Description Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              value={form.description}
              onChangeText={text => setForm({ ...form, description: text })}
              placeholder="Enter product description"
              multiline
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>
                {isEditing ? "Update Product" : "Save Product"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      {renderCategoryModal()}
      {renderBrandModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 14,
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  selectorInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 12 : 10,
    backgroundColor: '#ffffff',
  },
  selectorText: {
    fontSize: 14,
    color: '#1f2937',
  },
  selectorPlaceholder: {
    fontSize: 14,
    color: '#9ca3af',
  },
  skuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  generateButton: {
    marginLeft: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
  },
  generateButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 140 : 50,
    backgroundColor: '#ffffff',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioGroup: {
    flexDirection: 'row',
    marginTop: 4,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#9ca3af',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioOuterSelected: {
    borderColor: '#3b82f6',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3b82f6',
  },
  radioLabel: {
    fontSize: 14,
    color: '#374151',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#f3f4f6',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#1f2937',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  listItemText: {
    fontSize: 16,
    color: '#1f2937',
  },
  listSeparator: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
});

export default ProductCreateComponent;