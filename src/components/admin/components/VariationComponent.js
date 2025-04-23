import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { childrenVariation } from "../../../store/actions/productVariationActions";

const VariationComponent = ({ variations, method }) => {
  const [selectedVariationId, setSelectedVariationId] = useState(null);
  const [selectedVariations, setSelectedVariations] = useState([]);
  const [finalSelectedVariation, setFinalSelectedVariation] = useState(null);

  // Initialize with first variation if available
  useEffect(
    () => {
      if (variations && variations.length > 0) {
        handleSelectVariation(variations[0]);
      }
    },
    [variations]
  );

  const handleSelectVariation = variation => {
    setSelectedVariationId(variation.id);

    if (!variation.sku) {
      setFinalSelectedVariation(null);
      method(null);
    } else {
      setFinalSelectedVariation(variation);
      method(variation);
    }

    // Simulate API call to get children variations
    // In a real app, you would dispatch a Redux action here
    dispatch(childrenVariation(variation.id))
      .then(res => {
        setSelectedVariations(res.data.data);
      })
      .catch(err => {
        console.error(err);
      });
  };

  if (!variations || variations.length === 0) {
    return null;
  }

  const firstVariation = variations[0];

  return (
    <View style={styles.container}>
      <View style={styles.variationContainer}>
        <Text style={styles.variationLabel}>
          {firstVariation.product_attribute_name}:
        </Text>
        <View style={styles.variationOptions}>
          {variations.map((variation, index) =>
            <TouchableOpacity
              key={index}
              style={[
                styles.variationButton,
                selectedVariationId === variation.id && styles.selectedVariation
              ]}
              onPress={() => handleSelectVariation(variation)}
            >
              <Text
                style={[
                  styles.variationText,
                  selectedVariationId === variation.id &&
                    styles.selectedVariationText
                ]}
              >
                {variation.product_attribute_option_name}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Render child variations if any */}
      {selectedVariations.length > 0 &&
        <VariationComponent variations={selectedVariations} method={method} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24
  },
  variationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 12
  },
  variationLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 12,
    textTransform: "capitalize",
    color: "#1e293b"
  },
  variationOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8
  },
  variationButton: {
    paddingHorizontal: 12,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#f7f7fc"
  },
  selectedVariation: {
    backgroundColor: "#3B82F6"
  },
  variationText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
    textTransform: "capitalize"
  },
  selectedVariationText: {
    color: "white"
  }
});

export default VariationComponent;
