import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AddressComponent from './AddressComponent';
import SummeryComponent from '../SummeryComponent';
import CouponComponent from '../CouponComponent';
import alertService from '../../../../../services/alertService';
import LoadingComponent from '../../components/LoadingComponent';
import {fetchOrderAreas} from "../../../../store/actions/frontend/frontendOrderAreaActions"
import {fetchOutlets} from "../../../../store/actions/frontend/frontendOutletActions"
import {updateOrderType,updateShippingAddress,updateBillingAddress,updateOutletAddress} from "../../../../store/actions/frontend/frontendCartActions"

const CheckoutComponent = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState({ isActive: false });
  const [shippingAndBillingCheck, setShippingAndBillingCheck] = useState(true);
  const [billingStatus, setBillingStatus] = useState(false);
  const [modelOutlet, setModelOutlet] = useState(null);

  const setting = useSelector(state => state.frontendSetting.lists);
  const orderType = useSelector(state => state.frontendCart.orderType);
  const getShippingAddress = useSelector(state => state.frontendCart.shippingAddress);
  const getBillingAddress = useSelector(state => state.frontendCart.billingAddress);
  const outlets = useSelector(state => state.frontendOutlet.lists);

  useEffect(() => {
    setLoading({ isActive: true });
    dispatch(fetchOrderAreas()).finally(() => setLoading({ isActive: false }));

    setLoading({ isActive: true });
    dispatch(fetchOutlets({ status: 'active' }))
      .finally(() => setLoading({ isActive: false }));
  }, [dispatch]);

  const changeOrderType = (type) => {
    dispatch(updateOrderType(type));
  };

  const shippingAddress = (address) => {
    dispatch(updateShippingAddress(address));
    if (shippingAndBillingCheck) {
      dispatch(updateBillingAddress(address));
    }
  };

  const billingAddress = (address) => {
    dispatch(updateBillingAddress(address));
  };

  const outletAddress = (outlet) => {
    setModelOutlet(outlet);
    dispatch(updateOutletAddress(outlet));
  };

  const checkBillingCheckBox = (checked) => {
    if (checked) {
      setBillingStatus(false);
      setShippingAndBillingCheck(true);
      dispatch(updateBillingAddress(getShippingAddress));
    } else {
      setBillingStatus(true);
      setShippingAndBillingCheck(false);
    }
  };

  const selectAddress = () => {
    if (orderType === 'delivery') {
      if (Object.keys(getShippingAddress).length === 0 || Object.keys(getBillingAddress).length === 0) {
        alertService.error("Please provide shipping and billing address");
      } else {
        navigation.navigate('Payment');
      }
    } else {
      navigation.navigate('Payment');
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <LoadingComponent loading={loading} />
      <ScrollView className="p-4">
        <View className="flex flex-col lg:flex-row">
          <View className="w-full lg:w-8/12">
            <View className="flex flex-row items-center rounded-2xl mb-6 bg-blue-50 w-fit">
              <TouchableOpacity 
                onPress={() => changeOrderType('delivery')}
                className={`px-3.5 py-1.5 rounded-2xl ${orderType === 'delivery' ? 'bg-blue-500' : ''}`}
              >
                <Text className={`text-sm font-semibold capitalize ${orderType === 'delivery' ? 'text-white' : 'text-blue-500'}`}>
                  Delivery
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => changeOrderType('pick_up')}
                className={`px-3.5 py-1.5 rounded-2xl ${orderType === 'pick_up' ? 'bg-blue-500' : ''}`}
              >
                <Text className={`text-sm font-semibold capitalize ${orderType === 'pick_up' ? 'text-white' : 'text-blue-500'}`}>
                  Pick Up
                </Text>
              </TouchableOpacity>
            </View>

            {orderType === 'pick_up' && (
              <View className="mb-6 rounded-2xl shadow-md bg-white">
                <Text className="font-bold capitalize p-4 border-b border-gray-100">Store Location</Text>
                {outlets.length > 0 && (
                  <View className="px-4 pt-4">
                    {outlets.map(outlet => (
                      <View 
                        key={outlet.id}
                        className={`p-2 mb-4 border rounded-lg ${outlet.id === modelOutlet?.id ? 'border-orange-300 bg-orange-50' : 'border-gray-100 bg-gray-50'}`}
                      >
                        <View className="flex flex-row items-center">
                          <TouchableOpacity 
                            onPress={() => outletAddress(outlet)}
                            className="flex flex-row items-center"
                          >
                            <View className="w-5 h-5 border border-gray-300 rounded-full mr-2 flex items-center justify-center">
                              {outlet.id === modelOutlet?.id && (
                                <View className="w-3 h-3 bg-blue-500 rounded-full" />
                              )}
                            </View>
                            <Text className="text-sm">
                              <Text className="font-semibold">{outlet.name}</Text> - {outlet.address}, {outlet.city}, {outlet.state}, {outlet.zip_code}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {orderType === 'delivery' && (
              <AddressComponent 
                slug="shipping"
                title="Shipping Address"
                show={true}
                selectedAddress={getShippingAddress}
                method={shippingAddress}
              />
            )}

            {orderType === 'delivery' && (
              <View className="flex flex-row items-center mb-6">
                <TouchableOpacity 
                  onPress={() => checkBillingCheckBox(!shippingAndBillingCheck)}
                  className="w-5 h-5 border border-gray-300 rounded mr-3 flex items-center justify-center"
                >
                  {shippingAndBillingCheck && <Text className="text-blue-500">✓</Text>}
                </TouchableOpacity>
                <Text className="font-medium">
                  Save shipping address as a billing address
                </Text>
              </View>
            )}

            {orderType === 'delivery' && (
              <AddressComponent 
                slug="billing"
                title="Billing Address"
                show={billingStatus}
                selectedAddress={getBillingAddress}
                method={billingAddress}
              />
            )}

            <View className="hidden lg:flex flex-row items-center justify-between gap-5 mt-10">
              <TouchableOpacity 
                onPress={() => navigation.goBack()}
                className="bg-gray-100 px-6 py-2 rounded-full"
              >
                <Text className="text-gray-700 font-semibold">Back to Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={selectAddress}
                className="bg-blue-500 px-6 py-2 rounded-full"
              >
                <Text className="text-white font-semibold">Save and Pay</Text>
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
                <Text className="text-gray-700 font-semibold text-center">Back to Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={selectAddress}
                className="bg-blue-500 px-6 py-3 rounded-full flex-1 sm:flex-none"
              >
                <Text className="text-white font-semibold text-center">Save and Pay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CheckoutComponent;