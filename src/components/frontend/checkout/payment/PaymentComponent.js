import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import CouponComponent from '../CouponComponent';
import SummeryComponent from '../SummeryComponent';
import LoadingComponent from '../../components/LoadingComponent';
import alertService from '../../../../../services/alertService';
import appService from '../../../../../services/appService';
import { fetchPaymentGateways } from '../../../../store/actions/frontend/frontendPaymentGatewayActions';
import { updatePaymentMethod } from '../../../../store/actions/frontend/frontendCartActions';
import { createOrder } from '../../../../store/actions/frontend/frontendOrderActions';

const PaymentComponent = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState({ isActive: false });
  const [paymentGateways, setPaymentGateways] = useState([]);
  const [credit, setCredit] = useState({});
  const [cashOnDelivery, setCashOnDelivery] = useState({});
  const [form, setForm] = useState({});

  const setting = useSelector(state => state.frontendSetting.lists);
  const profile = useSelector(state => state.authInfo);
  const paymentMethod = useSelector(state => state.frontendCart.paymentMethod);
  const subtotal = useSelector(state => state.frontendCart.subtotal);
  const discount = useSelector(state => state.frontendCart.discount);
  const total = useSelector(state => state.frontendCart.total);
  const orderType = useSelector(state => state.frontendCart.orderType);
  const getShippingAddress = useSelector(state => state.frontendCart.shippingAddress);
  const getBillingAddress = useSelector(state => state.frontendCart.billingAddress);
  const getOutletAddress = useSelector(state => state.frontendCart.outletAddress);
  const cartCoupon = useSelector(state => state.frontendCart.coupon);
  const products = useSelector(state => state.frontendCart.lists);
  const shippingCharge = useSelector(state => state.frontendCart.shippingCharge);
  const totalTax = useSelector(state => state.frontendCart.totalTax);

  useEffect(() => {
    setLoading({ isActive: true });
    dispatch(fetchPaymentGateways({ status: 'active' })).then(res => {
      if (res.data.data.length > 0) {
        res.data.data.forEach(gateway => {
          if (gateway.slug === "credit") {
            setCredit(gateway);
          } else if (gateway.slug === "cashondelivery") {
            setCashOnDelivery(gateway);
            if (setting.site_cash_on_delivery === 'enable') {
              selectPaymentMethod(gateway);
            }
          } else {
            setPaymentGateways(prev => [...prev, gateway]);
          }
        });
      }
      setLoading({ isActive: false });
    }).catch(() => setLoading({ isActive: false }));
  }, [dispatch, setting]);

  const selectPaymentMethod = (method) => {
    dispatch(updatePaymentMethod(method));
  };

  const confirmOrder = () => {
    const orderData = {
      subtotal: subtotal,
      discount: discount,
      tax: totalTax,
      shipping_charge: shippingCharge,
      total: total,
      order_type: orderType,
      shipping_id: Object.keys(getShippingAddress).length > 0 ? getShippingAddress.id : 0,
      billing_id: Object.keys(getBillingAddress).length > 0 ? getBillingAddress.id : 0,
      outlet_id: Object.keys(getOutletAddress).length > 0 ? getOutletAddress.id : 0,
      coupon_id: Object.keys(cartCoupon).length > 0 ? cartCoupon.id : 0,
      source: 'web',
      payment_method: Object.keys(paymentMethod).length > 0 ? paymentMethod.id : 0,
      products: JSON.stringify(products)
    };

    setLoading({ isActive: true });
    dispatch(createOrder(orderData)).then(orderResponse => {
      setLoading({ isActive: false });
      const paymentSlug = Object.keys(paymentMethod).length > 0 ? paymentMethod.slug : '';
      if (paymentSlug) {
        // For React Native, you would typically open a WebView or deep link to payment
        Linking.openURL(`${appService.apiUrl()}/payment/${paymentSlug}/pay/${orderResponse.data.data.id}`);
      } else {
        alertService.error('Payment method is required');
      }
    }).catch((err) => {
      setLoading({ isActive: false });
      if (typeof err.response?.data?.errors === 'object') {
        Object.values(err.response.data.errors).forEach(error => {
          alertService.error(error[0]);
        });
      }
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <LoadingComponent loading={loading} />
      <ScrollView className="p-4">
        <View className="flex flex-col lg:flex-row">
          <View className="w-full lg:w-8/12">
            <View className="mb-6 rounded-2xl shadow-md bg-white">
              <Text className="font-bold capitalize p-4 border-b border-gray-100">
                Select Payment Method
              </Text>

              <View className="grid grid-cols-2 sm:grid-cols-5 gap-4 p-4">
                {Object.keys(cashOnDelivery).length > 0 && setting.site_cash_on_delivery === 'enable' && (
                  <TouchableOpacity
                    onPress={() => selectPaymentMethod(cashOnDelivery)}
                    className={`flex flex-col items-center justify-center gap-2.5 py-4 rounded-lg shadow-xs border ${Object.keys(paymentMethod).length > 0 && cashOnDelivery.id === paymentMethod.id ? 'border-orange-300 bg-orange-50' : 'border-white bg-white'}`}
                  >
                    <Image className="h-6 w-6" source={{ uri: cashOnDelivery.image }} />
                    <Text className="text-xs font-medium">{cashOnDelivery.name}</Text>
                  </TouchableOpacity>
                )}

                {profile.balance >= total && (
                  <TouchableOpacity
                    onPress={() => selectPaymentMethod(credit)}
                    className={`flex flex-col items-center justify-center gap-2.5 py-4 rounded-lg shadow-xs border ${Object.keys(paymentMethod).length > 0 && credit.id === paymentMethod.id ? 'border-orange-300 bg-orange-50' : 'border-white bg-white'}`}
                  >
                    <Image className="h-6 w-6" source={{ uri: credit.image }} />
                    <Text className="text-xs font-medium">{credit.name} ({profile.balance})</Text>
                  </TouchableOpacity>
                )}

                {setting.site_online_payment_gateway === 'enable' && paymentGateways.map(gateway => (
                  <TouchableOpacity
                    key={gateway.id}
                    onPress={() => selectPaymentMethod(gateway)}
                    className={`flex flex-col items-center justify-center gap-2.5 py-4 rounded-lg shadow-xs border ${Object.keys(paymentMethod).length > 0 && gateway.id === paymentMethod.id ? 'border-orange-300 bg-orange-50' : 'border-white bg-white'}`}
                  >
                    <Image className="h-6 w-6" source={{ uri: gateway.image }} />
                    <Text className="text-xs font-medium">{gateway.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="hidden lg:flex flex-row items-center justify-between gap-5 mt-10">
              <TouchableOpacity 
                onPress={() => navigation.goBack()}
                className="bg-gray-100 px-6 py-2 rounded-full"
              >
                <Text className="text-gray-700 font-semibold">Back to Checkout</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={confirmOrder}
                className="bg-blue-500 px-6 py-2 rounded-full"
              >
                <Text className="text-white font-semibold">Confirm Order</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="w-full lg:w-4/12 mt-4 lg:mt-0 lg:pl-4">
            <CouponComponent />
            <SummeryComponent />

            <View className="lg:hidden flex flex-col-reverse sm:flex-row items-center justify-between gap-5 mt-10">
              <TouchableOpacity 
                onPress={() => navigation.goBack()}
                className="bg-gray-100 px-6 py-3 rounded-full flex-1 sm:flex-none"
              >
                <Text className="text-gray-700 font-semibold text-center">Back to Checkout</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={confirmOrder}
                className="bg-blue-500 px-6 py-3 rounded-full flex-1 sm:flex-none"
              >
                <Text className="text-white font-semibold text-center">Confirm Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PaymentComponent;