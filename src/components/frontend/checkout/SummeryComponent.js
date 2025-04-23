import React from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import appService from "../../../../services/appService";

const SummeryComponent = () => {
  const setting = useSelector(state => state.frontendSetting.lists);
  const subtotal = useSelector(state => state.frontendCart.subtotal);
  const discount = useSelector(state => state.frontendCart.discount);
  const totalTax = useSelector(state => state.frontendCart.totalTax);
  const shippingCharge = useSelector(
    state => state.frontendCart.shippingCharge
  );
  const total = useSelector(state => state.frontendCart.total);

  const currencyFormat = (amount, decimal, currency, position) => {
    return appService.currencyFormat(amount, decimal, currency, position);
  };

  return (
    <View className="bg-white rounded-2xl shadow-md">
      <View className="p-4 border-b border-gray-100">
        <Text className="text-lg font-semibold capitalize">Order Summary</Text>
      </View>

      <View className="flex flex-col gap-3 p-4 border-b border-gray-100">
        <View className="flex flex-row items-center justify-between">
          <Text className="capitalize">Subtotal</Text>
          <Text className="font-medium">
            {currencyFormat(
              subtotal,
              setting.site_digit_after_decimal_point,
              setting.site_default_currency_symbol,
              setting.site_currency_position
            )}
          </Text>
        </View>
        <View className="flex flex-row items-center justify-between">
          <Text className="capitalize">Tax</Text>
          <Text className="font-medium">
            {currencyFormat(
              totalTax,
              setting.site_digit_after_decimal_point,
              setting.site_default_currency_symbol,
              setting.site_currency_position
            )}
          </Text>
        </View>
        <View className="flex flex-row items-center justify-between">
          <Text className="capitalize">Shipping Charge</Text>
          <Text className="font-medium">
            {currencyFormat(
              shippingCharge,
              setting.site_digit_after_decimal_point,
              setting.site_default_currency_symbol,
              setting.site_currency_position
            )}
          </Text>
        </View>
        <View className="flex flex-row items-center justify-between">
          <Text className="capitalize">Discount</Text>
          <Text className="font-medium">
            {currencyFormat(
              discount,
              setting.site_digit_after_decimal_point,
              setting.site_default_currency_symbol,
              setting.site_currency_position
            )}
          </Text>
        </View>
      </View>
      <View className="p-4">
        <View className="flex flex-row items-center justify-between">
          <Text className="font-semibold capitalize">Total</Text>
          <Text className="font-semibold">
            {currencyFormat(
              total,
              setting.site_digit_after_decimal_point,
              setting.site_default_currency_symbol,
              setting.site_currency_position
            )}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SummeryComponent;
