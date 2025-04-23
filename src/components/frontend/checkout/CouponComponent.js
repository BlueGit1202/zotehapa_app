import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import alertService from '../../../../services/alertService';
import LoadingComponent from '../components/LoadingComponent';
import { checkCoupon, fetchCoupon } from '../../../store/actions/frontend/frontendCouponActions';
import { applyCoupon, removeCoupon } from '../../../store/actions/frontend/frontendCartActions';

const CouponComponent = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState({ isActive: false });
  const [code, setCode] = useState(null);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const coupons = useSelector(state => state.frontendCoupon.lists);
  const subtotal = useSelector(state => state.frontendCart.subtotal);
  const cartCoupon = useSelector(state => state.frontendCart.coupon);

  useEffect(() => {
    setLoading({ isActive: true });
    dispatch(fetchCoupon({})).then(() => {
      setLoading({ isActive: false });
    }).catch(() => setLoading({ isActive: false }));
  }, [dispatch]);

  const appCouponButton = (coupon) => {
    setCode(coupon.code);
  };

  const couponChecking = () => {
    setLoading({ isActive: true });
    dispatch(checkCoupon({
      total: subtotal,
      code: code
    })).then(res => {
      setError("");
      dispatch(applyCoupon(res.data.data));
      setLoading({ isActive: false });
      setModalVisible(false);
      alertService.success('Coupon added successfully');
    }).catch((err) => {
      setLoading({ isActive: false });
      setError(err.response?.data?.message || "Invalid coupon");
    });
  };

  const destroyCoupon = () => {
    setLoading({ isActive: true });
    dispatch(removeCoupon()).then(() => {
      setCode(null);
      setLoading({ isActive: false });
      alertService.success('Coupon removed successfully');
    }).catch(() => setLoading({ isActive: false }));
  };

  return (
    <>
      <LoadingComponent loading={loading} />
      
      {Object.keys(cartCoupon).length !== 0 ? (
        <TouchableOpacity 
          className="mb-6 rounded-2xl border border-green-500 flex flex-row items-center gap-3 p-4"
        >
          <View className="relative flex-shrink-0">
            <Text className="text-green-500 text-2xl opacity-30">■</Text>
            <Text className="text-green-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">%</Text>
          </View>
          <View className="flex-1 overflow-hidden">
            <Text className="font-semibold leading-5 mb-1 truncate capitalize text-green-500">
              Coupon Applied
            </Text>
            <Text className="text-xs font-normal truncate">
              You saved {cartCoupon.currency_discount}
            </Text>
          </View>
          <TouchableOpacity onPress={destroyCoupon}>
            <Text className="text-red-500 text-xl">🗑️</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          className="mb-6 rounded-2xl border border-blue-500 flex flex-row items-center gap-3 p-4"
        >
          <View className="relative flex-shrink-0">
            <Text className="text-blue-500 text-2xl opacity-30">■</Text>
            <Text className="text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">%</Text>
          </View>
          <View className="flex-1 overflow-hidden">
            <Text className="font-semibold leading-5 mb-1 truncate capitalize text-blue-500">
              Apply Coupon
            </Text>
            <Text className="text-xs font-normal truncate">
              Get discount with your order
            </Text>
          </View>
          <Text className="text-blue-500 text-xl">→</Text>
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="w-full bg-white rounded-xl max-w-[360px]">
            <View className="flex flex-row items-center justify-between p-4 border-b border-gray-100">
              <Text className="text-lg font-bold">Coupon Code</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-lg text-red-500">✕</Text>
              </TouchableOpacity>
            </View>
            <View className="w-full flex flex-row items-center px-4 mt-4">
              <TextInput
                value={code}
                onChangeText={setCode}
                className="h-11 flex-1 px-3 rounded-l-lg border border-gray-300"
                placeholder="Enter coupon code"
              />
              <TouchableOpacity 
                onPress={couponChecking}
                className="h-11 px-4 bg-blue-500 rounded-r-lg flex items-center justify-center"
              >
                <Text className="text-white font-semibold">Apply</Text>
              </TouchableOpacity>
            </View>
            {error && <Text className="text-red-500 px-4 mt-2">{error}</Text>}

            {coupons.length > 0 && (
              <View className="p-4 pt-4">
                {coupons.map(coupon => (
                  <View key={coupon.id} className="bg-blue-50 p-4 relative rounded-xl mb-4">
                    <Text className="py-1 px-2 rounded font-medium text-xs w-fit mb-2 bg-yellow-300">
                      Code: {coupon.code}
                    </Text>
                    <Text className="text-sm font-medium mb-3">
                      {coupon.description}
                    </Text>
                    <Text className="text-xs text-gray-600">{coupon.convert_start_date} - {coupon.convert_end_date}</Text>
                    <TouchableOpacity 
                      onPress={() => appCouponButton(coupon)}
                      className="absolute bottom-0 right-0 text-sm font-semibold py-1.5 px-3 rounded-br-xl rounded-tl-xl text-white bg-blue-500"
                    >
                      <Text>Apply</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CouponComponent;