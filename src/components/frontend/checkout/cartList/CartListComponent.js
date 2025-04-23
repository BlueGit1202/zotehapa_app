import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import appService from "../../../../../services/appService";
import CouponComponent from "../CouponComponent";
import SummeryComponent from "../SummeryComponent";

const CartListComponent = ({ navigation }) => {
  const setting = useSelector(state => state.frontendSetting.lists);
  const carts = useSelector(state => state.frontendCart.lists);
  const dispatch = useDispatch();

  const currencyFormat = (amount, decimal, currency, position) => {
    return appService.currencyFormat(amount, decimal, currency, position);
  };

  const onlyNumber = e => {
    return appService.onlyNumber(e);
  };

  const quantityUp = (id, product, value) => {
    let quantity = value;
    if (quantity === 0) quantity = 1;
    if (quantity > product.stock) quantity = product.stock;
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const quantityIncrement = (id, product) => {
    let quantity = product.quantity + 1;
    if (quantity <= 0) quantity = 1;
    if (quantity > product.stock) quantity = product.stock;
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const quantityDecrement = (id, product) => {
    let quantity = product.quantity - 1;
    if (quantity <= 0) quantity = 1;
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const removeProduct = id => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { id } });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="p-4">
        <View className="flex flex-col lg:flex-row">
          <View className="w-full lg:w-8/12">
            {carts.length > 0 &&
              <View className="p-4 mb-4 rounded-xl shadow-md bg-white">
                {carts.map((cart, index) =>
                  <View
                    key={`${cart.product_id}-${cart.variation_id}`}
                    className="flex flex-row items-start pb-4 mb-4 border-b border-gray-100 last:mb-0 last:pb-0 last:border-0"
                  >
                    <Image
                      source={{ uri: cart.image }}
                      className="w-28 h-28 rounded-lg flex-shrink-0"
                    />
                    <View className="flex-1 ml-3">
                      <Text
                        className="font-semibold capitalize truncate mb-1"
                        numberOfLines={1}
                      >
                        {cart.name}
                      </Text>
                      {cart.variation_id > 0 &&
                        <View className="flex flex-wrap mb-2">
                          <Text className="text-xs capitalize">
                            {cart.variation_names}
                          </Text>
                        </View>}
                      <View className="flex flex-row flex-wrap gap-3 mb-3">
                        <Text className="font-semibold">
                          {currencyFormat(
                            cart.price,
                            setting.site_digit_after_decimal_point,
                            setting.site_default_currency_symbol,
                            setting.site_currency_position
                          )}
                        </Text>
                        {cart.discount > 0 &&
                          <Text className="font-semibold text-red-500 line-through">
                            {currencyFormat(
                              cart.old_price,
                              setting.site_digit_after_decimal_point,
                              setting.site_default_currency_symbol,
                              setting.site_currency_position
                            )}
                          </Text>}
                      </View>

                      <View className="flex flex-row items-center justify-between">
                        <View className="flex flex-row items-center gap-1 w-20 p-1 rounded-full bg-gray-50">
                          <TouchableOpacity
                            onPress={() => quantityDecrement(index, cart)}
                            disabled={cart.quantity === 1}
                            className={`p-1 ${cart.quantity === 1
                              ? "opacity-50"
                              : ""}`}
                          >
                            <Text className="text-lg">-</Text>
                          </TouchableOpacity>
                          <TextInput
                            value={String(cart.quantity)}
                            onChangeText={value =>
                              quantityUp(index, cart, parseInt(value) || 1)}
                            keyboardType="numeric"
                            className="text-center w-full text-sm font-medium"
                          />
                          <TouchableOpacity
                            onPress={() => quantityIncrement(index, cart)}
                            disabled={cart.quantity >= cart.stock}
                            className={`p-1 ${cart.quantity >= cart.stock
                              ? "opacity-50"
                              : ""}`}
                          >
                            <Text className="text-lg">+</Text>
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                          onPress={() => removeProduct(index)}
                          className="flex flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-red-50"
                        >
                          <Text className="text-sm text-red-600">🗑️</Text>
                          <Text className="text-xs font-medium capitalize hidden sm:block text-red-600">
                            Remove
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              </View>}

            <View className="items-end">
              <TouchableOpacity
                onPress={() => navigation.navigate("Checkout")}
                className="hidden lg:flex bg-blue-500 px-6 py-2 rounded-full"
              >
                <Text className="text-white font-semibold">
                  Process to Checkout
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="w-full lg:w-4/12 mt-4 lg:mt-0 lg:pl-4">
            <CouponComponent />
            <SummeryComponent />

            <TouchableOpacity
              onPress={() => navigation.navigate("Checkout")}
              className="lg:hidden bg-blue-500 px-6 py-3 rounded-full mt-6"
            >
              <Text className="text-white font-semibold text-center">
                Process to Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CartListComponent;
