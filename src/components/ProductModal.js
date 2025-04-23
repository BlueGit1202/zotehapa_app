import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const ProductModal = ({ visible, onClose, product, onSubmit }) => {
  const [form, setForm] = useState(product);

  const handleSubmit = () => {
    onSubmit(form);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="bg-white p-4 rounded-lg w-11/12 max-h-[80%]">
          <Text className="text-lg font-bold mb-4">Product Details</Text>

          <ScrollView className="mb-4">
            <View className="mb-4">
              <Text className="text-sm font-medium mb-1">Quantity</Text>
              <TextInput
                className="border border-gray-300 rounded p-2"
                value={form.quantity.toString()}
                onChangeText={text =>
                  setForm({ ...form, quantity: Number(text) || 0 })}
                keyboardType="numeric"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium mb-1">Price</Text>
              <TextInput
                className="border border-gray-300 rounded p-2"
                value={form.price.toString()}
                onChangeText={text =>
                  setForm({ ...form, price: Number(text) || 0 })}
                keyboardType="numeric"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium mb-1">Discount</Text>
              <TextInput
                className="border border-gray-300 rounded p-2"
                value={form.discount.toString()}
                onChangeText={text =>
                  setForm({ ...form, discount: Number(text) || 0 })}
                keyboardType="numeric"
              />
            </View>

            {form.is_variation &&
              <View className="mb-4">
                <Text className="text-sm font-medium mb-1">Variation</Text>
                {/* Variation selection would go here */}
              </View>}

            <View className="mb-4">
              <Text className="text-sm font-medium mb-1">Taxes</Text>
              {/* Tax selection would go here */}
            </View>
          </ScrollView>

          <View className="flex-row justify-between">
            <TouchableOpacity
              className="bg-gray-500 px-4 py-2 rounded"
              onPress={onClose}
            >
              <Text className="text-white">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-blue-500 px-4 py-2 rounded"
              onPress={handleSubmit}
            >
              <Text className="text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ProductModal;
