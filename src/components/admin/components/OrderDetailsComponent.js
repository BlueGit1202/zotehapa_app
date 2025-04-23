import React from "react";
import { View, Text, ScrollView } from "react-native";

const OrderDetailsComponent = ({
  order,
  orderProducts,
  orderAddresses,
  outletAddress
}) => {
  if (!order) return null;

  return (
    <ScrollView className="p-4">
      <View className="mb-6">
        <Text className="text-lg font-bold mb-4">Order Details</Text>
        <View className="bg-white rounded-lg shadow-sm p-4">
          <View className="flex-row justify-between mb-2">
            <Text className="font-medium">Order ID:</Text>
            <Text>
              #{order.order_serial_no}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="font-medium">Date:</Text>
            <Text>
              {order.order_datetime}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="font-medium">Status:</Text>
            <Text
              className={`px-2 py-1 rounded ${order.status === "delivered"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"}`}
            >
              {order.status_name}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="font-medium">Payment Method:</Text>
            <Text>
              {order.payment_method}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="font-medium">Subtotal:</Text>
            <Text>
              {order.subtotal_currency_price}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="font-medium">Tax:</Text>
            <Text>
              {order.tax_currency_price}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="font-medium">Discount:</Text>
            <Text>
              {order.discount_currency_price}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="font-medium">Total:</Text>
            <Text className="font-bold">
              {order.total_currency_price}
            </Text>
          </View>
        </View>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-bold mb-4">Products</Text>
        {orderProducts && orderProducts.length > 0
          ? orderProducts.map(product =>
              <View
                key={product.id}
                className="bg-white rounded-lg shadow-sm p-4 mb-2"
              >
                <View className="flex-row justify-between mb-2">
                  <Text className="font-medium">
                    {product.name}
                  </Text>
                  <Text>
                    {product.quantity} × {product.price_currency_price}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text>Total:</Text>
                  <Text>
                    {product.total_currency_price}
                  </Text>
                </View>
              </View>
            )
          : <Text className="text-center text-gray-500">
              No products found
            </Text>}
      </View>

      <View className="mb-6">
        <Text className="text-lg font-bold mb-4">Delivery Address</Text>
        {orderAddresses
          ? <View className="bg-white rounded-lg shadow-sm p-4">
              <Text className="font-medium mb-1">
                {orderAddresses.full_name}
              </Text>
              <Text className="mb-1">
                {orderAddresses.address}
              </Text>
              <Text className="mb-1">
                {orderAddresses.city}, {orderAddresses.state},{" "}
                {orderAddresses.country}
              </Text>
              <Text className="mb-1">
                Zip Code: {orderAddresses.zip_code}
              </Text>
              <Text>
                Phone: {orderAddresses.country_code} {orderAddresses.phone}
              </Text>
            </View>
          : <Text className="text-center text-gray-500">No address found</Text>}
      </View>

      {outletAddress &&
        <View className="mb-6">
          <Text className="text-lg font-bold mb-4">Outlet Address</Text>
          <View className="bg-white rounded-lg shadow-sm p-4">
            <Text className="font-medium mb-1">
              {outletAddress.name}
            </Text>
            <Text className="mb-1">
              {outletAddress.address}
            </Text>
            <Text className="mb-1">
              {outletAddress.city}, {outletAddress.state},{" "}
              {outletAddress.country}
            </Text>
            <Text className="mb-1">
              Zip Code: {outletAddress.zip_code}
            </Text>
            <Text>
              Phone: {outletAddress.country_code} {outletAddress.phone}
            </Text>
          </View>
        </View>}
    </ScrollView>
  );
};

export default OrderDetailsComponent;
