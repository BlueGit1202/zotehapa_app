import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTailwind } from "tailwind-rn";
import { useDispatch, useSelector } from "react-redux";
import { fetchChildrenVariation } from "../../../store/actions/frontend/frontendProductVariationActions";

const VariationComponent = ({ variations, method }) => {
  const tailwind = useTailwind();
  const dispatch = useDispatch();
  const [selectedVariationId, setSelectedVariationId] = useState(null);
  const [selectedVariations, setSelectedVariations] = useState([]);
  const [finalSelectedVariation, setFinalSelectedVariation] = useState(null);

  const { childrenVariation: reduxChildrenVariation } = useSelector(
    state => state.frontendProductVariation
  );

  useEffect(
    () => {
      if (selectedVariationId) {
        dispatch(fetchChildrenVariation(selectedVariationId))
          .then(() => {
            setSelectedVariations(reduxChildrenVariation);
          })
          .catch(err => {
            console.error(err);
          });
      }
    },
    [selectedVariationId, dispatch]
  );

  const selectVariation = variation => {
    setSelectedVariationId(variation.id);

    if (!variation.sku) {
      setFinalSelectedVariation(null);
      method(null);
    } else {
      setFinalSelectedVariation(variation);
      method(variation);
    }
  };

  if (!variations || variations.length === 0) {
    return null;
  }

  const firstVariation = variations[0];

  return (
    <View style={tailwind("mb-6")}>
      <View style={tailwind("flex-row flex-wrap items-center gap-x-6 gap-y-3")}>
        <Text style={tailwind("capitalize text-lg font-semibold")}>
          {firstVariation.product_attribute_name}:
        </Text>
        <View style={tailwind("flex-row flex-wrap items-center gap-3")}>
          {variations.map((variation, index) =>
            <TouchableOpacity
              key={index}
              onPress={() => selectVariation(variation)}
              style={[
                tailwind("px-3 h-8 rounded-full items-center justify-center"),
                tailwind("bg-gray-100"),
                selectedVariationId === variation.id
                  ? tailwind("bg-blue-500")
                  : tailwind("bg-gray-100")
              ]}
            >
              <Text
                style={[
                  tailwind("text-sm font-medium capitalize"),
                  selectedVariationId === variation.id
                    ? tailwind("text-white")
                    : tailwind("text-gray-800")
                ]}
              >
                {variation.product_attribute_option_name}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {selectedVariations.length > 0 &&
        <VariationComponent
          method={method}
          variations={selectedVariations}
          key={JSON.stringify(selectedVariations)}
        />}
    </View>
  );
};

export default VariationComponent;
