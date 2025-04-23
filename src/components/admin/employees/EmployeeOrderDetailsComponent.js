import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import LoadingComponent from '../components/LoadingComponent';
import OrderDetailsComponent from '../components/OrderDetailsComponent';
import { fetchMyOrderDetails } from '../../../store/actions/myOrderDetailsActions';


const EmployeeOrderDetailsComponent = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const { order, orderProducts, orderAddresses, outletAddress } = useSelector((state) => state.myOrderDetails);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.id && route.params?.orderId) {
      setLoading(true);
      dispatch(fetchMyOrderDetails({
        id: route.params.id,
        orderId: route.params.orderId
      }))
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    }
  }, [route.params?.id, route.params?.orderId]);

  return (
    <View className="flex-1 bg-white">
      {loading && <LoadingComponent />}
      <OrderDetailsComponent 
        order={order} 
        orderProducts={orderProducts} 
        orderAddresses={orderAddresses} 
        outletAddress={outletAddress} 
      />
    </View>
  );
};

export default EmployeeOrderDetailsComponent;