import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Picker, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ancestorsAndSelfId, childrenVariation } from '../../../../store/actions/productVariationActions';

const ProductVariationsComponent = ({ variations, mode, item, onSelect }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedVariationIndex, setSelectedVariationIndex] = useState("-1");
  const [selectedVariations, setSelectedVariations] = useState([]);
  const [finalSelectedVariation, setFinalSelectedVariation] = useState(null);

  useEffect(() => {
    if (mode === 'edit' && item?.variation_id) {
      handleEditMode();
    }
  }, [item?.variation_id]);

  const handleEditMode = async () => {
    try {
      setLoading(true);
      const resAncestor = await dispatch(ancestorsAndSelfId(item.variation_id));
      
      variations.forEach((variation, variationIndex) => {
        resAncestor.data.data.forEach(async (list) => {
          if (variation.id === list) {
            setLoading(true);
            try {
              const res = await dispatch(childrenVariation(list));
              setSelectedVariationIndex(variationIndex.toString());
              setSelectedVariations(res.data.data);
              
              if (variationIndex.toString() !== "-1") {
                if (!variations[variationIndex].sku) {
                  setFinalSelectedVariation(null);
                  onSelect(null);
                } else {
                  setFinalSelectedVariation(variations[variationIndex]);
                  onSelect(variations[variationIndex]);
                }
              }
            } finally {
              setLoading(false);
            }
          }
        });
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVariationChange = async (index) => {
    setSelectedVariationIndex(index);
    
    if (index !== "-1") {
      const selectedVar = variations[index];
      if (!selectedVar.sku) {
        setFinalSelectedVariation(null);
        onSelect(null);
      } else {
        setFinalSelectedVariation(selectedVar);
        onSelect(selectedVar);
      }
      
      try {
        const res = await dispatch(childrenVariation(selectedVar.id));
        setSelectedVariations(res.data.data);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    } else {
      setFinalSelectedVariation(null);
      onSelect(null);
      setSelectedVariations([]);
    }
  };

  if (variations.length === 0) {
    return null;
  }

  return (
    <View className="mb-4">
      {loading && <ActivityIndicator size="small" color="#4B6FED" />}
      
      <Text className="text-sm font-medium mb-1">
        {variations[0]?.product_attribute_name}*
      </Text>
      
      <View className="border border-gray-300 rounded">
        <Picker
          selectedValue={selectedVariationIndex}
          onValueChange={handleVariationChange}
        >
          <Picker.Item label={'please select'} value="-1" />
          {variations.map((variation, index) => (
            <Picker.Item 
              key={index}
              label={variation.product_attribute_option_name}
              value={index.toString()}
            />
          ))}
        </Picker>
      </View>

      {selectedVariations.length > 0 && (
        <ProductVariationsComponent
          variations={selectedVariations}
          mode={mode}
          item={item}
          onSelect={onSelect}
        />
      )}
    </View>
  );
};

export default ProductVariationsComponent;