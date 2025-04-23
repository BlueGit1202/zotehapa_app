import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import ProductVariationsComponent from "./ProductVariationsComponent";
import appService from "../../../../../services/appService";
import taxActions from "../../../../store/actions/taxActions";
import { ancestorsToString } from "../../../../store/actions/productVariationActions";

const ProductModalComponent = ({ item, visible, onClose, onSubmit }) => {
  const dispatch = useDispatch();
  const [finalVariation, setFinalVariation] = useState(null);
  const [formData, setFormData] = useState({
    tax_id: [],
    quantity: "",
    discount: "",
    price: "",
    ...item,
  });

  // Get data from Redux store
  const taxes = useSelector(state => state.tax.lists);
  const initialVariations = useSelector(
    state => state.productVariation.initialVariation
  );

  useEffect(() => {
    taxList();
  }, []);

  const taxList = (page = 1) => {
    dispatch(taxActions.lists({ page }));
  };

  const handleSubmit = () => {
    if (item.is_variation && !finalVariation) {
      return;
    }

    const submittedItem = { ...formData };
    if (item.is_variation) {
      submittedItem.variation_id = finalVariation.id;
      submittedItem.sku = finalVariation.sku;
    }

    onSubmit(submittedItem);
  };

  const handleVariationSelect = variation => {
    setFinalVariation(variation);
    if (variation) {
      dispatch(ancestorsToString(variation.id)).then(res => {
        setFormData(prev => ({
          ...prev,
          variation_names: res.data.data,
        }));
      });
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 p-4">
        <View className="w-full max-w-3xl bg-white rounded-xl">
          {/* Header */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
            <Text className="text-lg font-bold capitalize">
              {item.name}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#EF4444" />
            </TouchableOpacity>
          </View>

          <ScrollView className="p-4">
            {/* Tax Selection */}
            <View className="mb-4">
              <Text className="text-sm font-medium mb-1">
                {"tax"}
              </Text>
              <SelectDropdown
                data={taxes}
                defaultButtonText={"select one"}
                buttonTextAfterSelection={selectedItem => selectedItem.name}
                rowTextForSelection={item => item.name}
                onSelect={selectedItem =>
                  handleInputChange("tax_id", selectedItem.id)}
                buttonStyle={{
                  width: "100%",
                  backgroundColor: "#FFF",
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                  borderRadius: 6,
                  height: 40,
                }}
              />
            </View>

            {/* Quantity */}
            <View className="mb-4">
              <Text className="text-sm font-medium mb-1">
                {"quantity"}*
              </Text>
              <TextInput
                value={formData.quantity}
                onChangeText={text =>
                  handleInputChange("quantity", appService.onlyNumber(text))}
                keyboardType="numeric"
                className="border border-gray-300 rounded p-2"
              />
            </View>

            {/* Discount */}
            <View className="mb-4">
              <Text className="text-sm font-medium mb-1">
                {"discount"}
              </Text>
              <TextInput
                value={formData.discount}
                onChangeText={text =>
                  handleInputChange("discount", appService.floatNumber(text))}
                keyboardType="numeric"
                className="border border-gray-300 rounded p-2"
              />
            </View>

            {/* Unit Cost */}
            <View className="mb-4">
              <Text className="text-sm font-medium mb-1">
                {"unit_cost"}*
              </Text>
              <TextInput
                value={formData.price}
                onChangeText={text =>
                  handleInputChange("price", appService.floatNumber(text))}
                keyboardType="numeric"
                className="border border-gray-300 rounded p-2"
              />
            </View>

            {/* Variations */}
            {item.is_variation &&
              initialVariations.length > 0 &&
              <ProductVariationsComponent
                variations={initialVariations}
                mode={item.mode}
                item={item}
                onSelect={handleVariationSelect}
              />}

            {/* Buttons */}
            <View className="flex-row justify-end space-x-3 mt-8">
              <TouchableOpacity
                className="px-4 py-2 bg-blue-500 rounded flex-row items-center"
                onPress={handleSubmit}
                disabled={item.is_variation && !finalVariation}
              >
                <MaterialIcons name="check-circle" size={16} color="white" />
                <Text className="text-white ml-1">
                  {"save"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-4 py-2 border border-gray-300 rounded flex-row items-center"
                onPress={onClose}
              >
                <MaterialIcons name="cancel" size={16} color="#6B7280" />
                <Text className="text-gray-700 ml-1">
                  {"close"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ProductModalComponent;
