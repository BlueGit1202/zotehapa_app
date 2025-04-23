import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  lists,
  destroy,
} from "../../../../store/actions/productVariationActions";
import ProductVariationCreate from "./ProductVariationCreateComponent";

const ProductVariationList = ({ route }) => {
  const { productId } = route.params;
  const dispatch = useDispatch();
  const { variations, loading } = useSelector(state => state.productVariations);
  const [editMode, setEditMode] = useState(false);
  const [editingVariation, setEditingVariation] = useState(null);

  useEffect(
    () => {
      dispatch(lists(productId));
    },
    [productId]
  );

  const handleEdit = variation => {
    setEditingVariation(variation);
    setEditMode(true);
  };

  const handleDelete = id => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this variation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            dispatch(destroy({ productId, id }))
              .then(() =>
                Alert.alert("Success", "Variation deleted successfully")
              )
              .catch(err => Alert.alert("Error", err.message));
          },
        },
      ]
    );
  };

  const handleVariationSaved = () => {
    setEditMode(false);
    setEditingVariation(null);
    dispatch(lists(productId));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B6FED" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Variations</Text>
        <ProductVariationCreate
          productId={productId}
          editMode={editMode}
          variation={editingVariation}
          onSave={handleVariationSaved}
          onCancel={() => {
            setEditMode(false);
            setEditingVariation(null);
          }}
        />
      </View>

      {/* Variation List */}
      {variations.length > 0
        ? <ScrollView style={styles.listContainer}>
            {variations.map(variation =>
              <View key={variation.id} style={styles.variationItem}>
                <View style={styles.variationInfo}>
                  {Object.entries(variation.options).map(([key, value]) =>
                    <Text key={key} style={styles.optionText}>
                      {key} :: {value}
                    </Text>
                  )}
                  <Text style={styles.priceText}>
                    Price :: {variation.price}
                  </Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEdit(variation)}
                  >
                    <Icon name="pencil" size={20} color="#008BBA" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(variation.id)}
                  >
                    <Icon name="trash-can" size={20} color="#FB4E4E" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        : <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No variations found</Text>
          </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
    overflow: "hidden",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  listContainer: {
    flex: 1,
  },
  variationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  variationInfo: {
    flex: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#008BBA",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    padding: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
  },
});

export default ProductVariationList;
