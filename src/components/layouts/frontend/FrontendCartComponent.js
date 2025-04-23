import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Dimensions,
  Animated,
  StyleSheet,
  StatusBar,
  Platform
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import appService from '../../../../services/appService';
import { updateQuantity, removeFromCart } from '../../../store/actions/frontend/frontendCartActions';

const { height } = Dimensions.get('window');

const CartScreen = ({ visible, onClose }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const setting = useSelector((state) => state.frontendSetting.lists);
  const carts = useSelector((state) => state.frontendCart.lists);
  const subtotal = useSelector((state) => state.frontendCart.subtotal);
  
  const [quantityInputs, setQuantityInputs] = useState({});
  const slideAnim = useRef(new Animated.Value(height)).current;

  // Animation handlers
  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(height);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(onClose);
  };

  // Quantity handlers
  const handleQuantityChange = (index, value) => {
    const numValue = parseInt(value) || 1;
    setQuantityInputs({ ...quantityInputs, [index]: numValue });
    dispatch(updateQuantity(index, numValue));
  };

  const handleQuantityIncrement = (index, product) => {
    const newQuantity = product.quantity + 1;
    if (newQuantity <= product.stock) {
      dispatch(updateQuantity(index, newQuantity));
    }
  };

  const handleQuantityDecrement = (index, product) => {
    if (product.quantity > 1) {
      dispatch(updateQuantity(index, product.quantity - 1));
    }
  };

  const handleRemoveProduct = (index) => {
    dispatch(removeFromCart(index));
  };

  const handleCheckout = () => {
    handleClose();
    navigation.navigate('Checkout');
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="none"
      visible={visible}
      onRequestClose={handleClose}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" />
      <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Empty State */}
        {carts.length === 0 && (
          <View style={styles.emptyContainer}>
            <Image
              source={{ uri: setting.image_cart }}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyText}>Your cart is empty</Text>
          </View>
        )}

        {/* Cart Items */}
        {carts.length > 0 && (
          <>
            <ScrollView style={styles.itemsContainer}>
              {carts.map((cart, index) => (
                <View 
                  key={`${cart.product_id}-${cart.variation_id || 0}`}
                  style={styles.cartItem}
                >
                  <Image
                    source={{ uri: cart.image }}
                    style={styles.productImage}
                  />

                  <View style={styles.productDetails}>
                    <Text 
                      style={styles.productName}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {cart.name}
                    </Text>
                    
                    {cart.variation_id > 0 && (
                      <Text style={styles.variationText}>
                        {cart.variation_names}
                      </Text>
                    )}
                    
                    <View style={styles.priceContainer}>
                      <Text style={styles.price}>
                        {appService.currencyFormat(
                          cart.price,
                          setting.site_digit_after_decimal_point,
                          setting.site_default_currency_symbol,
                          setting.site_currency_position
                        )}
                      </Text>
                      
                      {cart.discount > 0 && (
                        <Text style={styles.oldPrice}>
                          {appService.currencyFormat(
                            cart.old_price,
                            setting.site_digit_after_decimal_point,
                            setting.site_default_currency_symbol,
                            setting.site_currency_position
                          )}
                        </Text>
                      )}
                    </View>

                    <View style={styles.quantityContainer}>
                      <View style={styles.quantityControls}>
                        <TouchableOpacity
                          onPress={() => handleQuantityDecrement(index, cart)}
                          disabled={cart.quantity <= 1}
                          style={[styles.quantityButton, cart.quantity <= 1 && styles.disabledButton]}
                        >
                          <MaterialIcons name="remove" size={18} />
                        </TouchableOpacity>
                        
                        <TextInput
                          value={String(cart.quantity)}
                          onChangeText={(value) => handleQuantityChange(index, value)}
                          keyboardType="numeric"
                          style={styles.quantityInput}
                        />
                        
                        <TouchableOpacity
                          onPress={() => handleQuantityIncrement(index, cart)}
                          disabled={cart.quantity >= cart.stock}
                          style={[styles.quantityButton, cart.quantity >= cart.stock && styles.disabledButton]}
                        >
                          <MaterialIcons name="add" size={18} />
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        onPress={() => handleRemoveProduct(index)}
                        style={styles.removeButton}
                      >
                        <MaterialIcons name="delete" size={16} color="#EF4444" />
                        <Text style={styles.removeText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Checkout Section */}
            <View style={styles.checkoutContainer}>
              <View style={styles.subtotalContainer}>
                <Text style={styles.subtotalLabel}>Subtotal</Text>
                <Text style={styles.subtotalValue}>
                  {appService.currencyFormat(
                    subtotal,
                    setting.site_digit_after_decimal_point,
                    setting.site_default_currency_symbol,
                    setting.site_currency_position
                  )}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleCheckout}
                style={styles.checkoutButton}
              >
                <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              </TouchableOpacity>

              <Text style={styles.shippingText}>
                Shipping & taxes calculated at checkout
              </Text>
            </View>
          </>
        )}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyImage: {
    width: 200,
    height: 200,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: '#666',
  },
  itemsContainer: {
    flex: 1,
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productImage: {
    width: 96,
    height: 96,
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
  },
  variationText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  oldPrice: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
    textDecorationLine: 'line-through',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityButton: {
    padding: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  quantityInput: {
    width: 40,
    textAlign: 'center',
    fontSize: 16,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  removeText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#EF4444',
  },
  checkoutContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  subtotalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtotalValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  checkoutButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 12,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  shippingText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default CartScreen;