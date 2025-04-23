import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import orderTypeEnum from '../../../../enums/modules/orderTypeEnum';

const OrderReceiptComponent = ({ order, orderProducts, orderUser, orderAddress }) => {
  const { lists } = useSelector(state => state.company);
  const { outletAddress } = useSelector(state => state.frontendOrder);

  const orderTypeEnumArray = {
    [orderTypeEnum.DELIVERY]: "Delivery",
    [orderTypeEnum.PICK_UP]: "Pick Up"
  };

  const handlePrint = () => {
    // Implement print functionality
    // This might require a native module or using react-native-print
  };

  return (
    <View>
      <TouchableOpacity 
        onPress={handlePrint}
        className="px-6 py-3 rounded-full bg-primary"
      >
        <Text className="text-white text-center font-semibold">Download Receipt</Text>
      </TouchableOpacity>

      {/* Receipt content */}
      <View className="hidden" id="print">
        <View className="border-b border-dashed border-gray-400 pb-3.5 items-center">
          <Text className="font-bold mb-1">{lists.company_name}</Text>
          <Text className="text-sm">{lists.company_address}</Text>
          <Text className="text-sm">Tel: {lists.company_calling_code} {lists.company_phone}</Text>
        </View>

        <View className="my-1.5">
          <View className="flex-row justify-between">
            <Text className="text-xs py-0.5">Order ID #{order.order_serial_no}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-xs py-0.5">{order.order_date}</Text>
            <Text className="text-xs py-0.5">{order.order_time}</Text>
          </View>
        </View>

        <View className="border-t border-b border-dashed border-gray-400">
          <View className="flex-row py-1">
            <Text className="text-xs w-8">Qty</Text>
            <View className="flex-1 flex-row justify-between">
              <Text className="text-xs">Product Description</Text>
              <Text className="text-xs">Price</Text>
            </View>
          </View>
        </View>

        <View className="border-b border-dashed border-gray-400">
          {orderProducts.map((product, index) => (
            <View key={index} className="py-1 flex-row">
              <Text className="text-xs w-8">{product.quantity}</Text>
              <View className="flex-1">
                <View className="flex-row justify-between">
                  <Text className="text-xs">{product.product_name}</Text>
                  <Text className="text-xs">{product.subtotal_currency_price}</Text>
                </View>
                {product.variation_names && (
                  <Text className="text-xs max-w-[200px]">{product.variation_names}</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        <View className="py-2 pl-7">
          <View className="flex-row justify-between">
            <Text className="text-xs py-0.5 uppercase">Subtotal:</Text>
            <Text className="text-xs py-0.5">{order.subtotal_currency_price}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-xs py-0.5 uppercase">Tax Fee:</Text>
            <Text className="text-xs py-0.5">{order.tax_currency_price}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-xs py-0.5 uppercase">Discount:</Text>
            <Text className="text-xs py-0.5">{order.discount_currency_price}</Text>
          </View>
          {order.order_type === orderTypeEnum.DELIVERY && (
            <View className="flex-row justify-between">
              <Text className="text-xs py-0.5 uppercase">Shipping Charge:</Text>
              <Text className="text-xs py-0.5">{order.shipping_charge_currency_price}</Text>
            </View>
          )}
          <View className="flex-row justify-between">
            <Text className="text-xs py-0.5 font-bold uppercase">Total:</Text>
            <Text className="text-xs py-0.5 font-bold">{order.total_currency_price}</Text>
          </View>
        </View>

        <View className="py-1 border-t border-b border-dashed border-gray-400 text-xs">
          <View className="flex-row">
            <Text className="pt-1 pb-1 pr-1">Order Type:</Text>
            <Text className="pt-1 pb-1">{orderTypeEnumArray[order.order_type]}</Text>
          </View>
          <View className="flex-row">
            <Text className="pt-1 pb-1 pr-1">Payment Type:</Text>
            <Text className="pt-1 pb-1">{order.payment_method_name}</Text>
          </View>
          <View className="flex-row">
            <Text className="pt-1 pb-1 pr-1">Order Date Time:</Text>
            <Text className="pt-1 pb-1">{order.order_datetime}</Text>
          </View>
        </View>

        <View className="py-1 border-b border-dashed border-gray-400 text-xs">
          {order.order_type === orderTypeEnum.DELIVERY ? (
            <>
              <View className="flex-row">
                <Text className="pt-1 pb-1 pr-1">Customer:</Text>
                <Text className="pt-1 pb-1">{orderAddress.full_name}</Text>
              </View>
              <View className="flex-row">
                <Text className="pt-1 pb-1 pr-1">Phone:</Text>
                <Text className="pt-1 pb-1">{orderAddress.country_code}{orderAddress.phone}</Text>
              </View>
              <View className="flex-row">
                <Text className="pt-1 pb-1 pr-1">Address:</Text>
                <Text className="pt-1 pb-1">
                  {orderAddress.address && `${orderAddress.address},`}
                  {orderAddress.city && `${orderAddress.city},`}
                  {orderAddress.state && `${orderAddress.state},`}
                  {orderAddress.country && `${orderAddress.country},`}
                  {orderAddress.zip_code && orderAddress.zip_code}
                </Text>
              </View>
            </>
          ) : (
            <>
              <View className="flex-row">
                <Text className="pt-1 pb-1 pr-1">Customer:</Text>
                <Text className="pt-1 pb-1">{orderUser.name}</Text>
              </View>
              <View className="flex-row">
                <Text className="pt-1 pb-1 pr-1">Phone:</Text>
                <Text className="pt-1 pb-1">{orderUser.country_code}{orderUser.phone}</Text>
              </View>
              <View className="flex-row">
                <Text className="pt-1 pb-1 pr-1">Outlet:</Text>
                <Text className="pt-1 pb-1">
                  {outletAddress.address && `${outletAddress.address},`}
                  {outletAddress.state && `${outletAddress.state},`}
                  {outletAddress.city && `${outletAddress.city},`}
                  {outletAddress.country && `${outletAddress.country},`}
                  {outletAddress.zip_code && outletAddress.zip_code}
                </Text>
              </View>
            </>
          )}
        </View>

        <View className="py-2 pb-4 items-center">
          <Text className="text-[11px]">Thank You</Text>
          <Text className="text-[11px]">Please Come Again</Text>
        </View>

        <View className="items-end">
          <Text className="text-[8px] w-[46px]">Powered By</Text>
          <Text className="text-xs">{company.company_name}</Text>
        </View>
      </View>
    </View>
  );
};

export default OrderReceiptComponent;