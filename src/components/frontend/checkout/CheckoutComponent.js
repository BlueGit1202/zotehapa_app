import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import LoadingComponent from "../components/LoadingComponent";
import { listChecker } from "../../../store/actions/frontend/frontendCartActions";

const CheckoutComponent = ({ children }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState({ isActive: false });
  const [currentRoute, setCurrentRoute] = useState(route.path);
  const dispatch = useDispatch();

  useEffect(
    () => {
      setCurrentRoute(route.path);
      setLoading({ isActive: true });
      dispatch(listChecker())
        .then(res => {
          if (!res.status) {
            navigation.navigate("Home");
          }
          setLoading({ isActive: false });
        })
        .catch(() => {
          setLoading({ isActive: false });
          navigation.navigate("Home");
        });
    },
    [route.path, dispatch, navigation]
  );

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View className="mb-28 sm:mb-20 flex-1">
      <LoadingComponent loading={loading} />
      <View className="container p-4">
        {/* Header Route Start */}
        <View className="flex flex-row items-start gap-4 mb-7">
          <TouchableOpacity
            onPress={goBack}
            className="text-xl font-bold text-blue-500"
          >
            <Text>←</Text>
          </TouchableOpacity>
          {children}
        </View>
        {/* Header Route Close */}

        {/* Checkbox Start */}
        <View className="w-full max-w-lg mx-auto my-12 pt-2 pb-5 px-4">
          <View className="flex flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => navigation.navigate("CartList")}
              className="flex flex-col items-center gap-4 -mt-[13px] relative"
            >
              {currentRoute === "/checkout/checkout" ||
              currentRoute === "/checkout/payment"
                ? <View className="w-[30px] h-[30px] rounded-full bg-green-500 flex items-center justify-center">
                    <Text className="text-white">✓</Text>
                  </View>
                : <View className="w-[30px] h-[30px] border-4 rounded-full border-green-500 bg-white" />}
              <Text
                className={`text-sm font-medium absolute -bottom-8 ${currentRoute ===
                "/checkout/cart-list"
                  ? "text-green-500"
                  : "text-gray-500"}`}
              >
                Cart
              </Text>
            </TouchableOpacity>

            <View className="flex-1 h-1 mx-2 bg-gray-200">
              {(currentRoute === "/checkout/checkout" ||
                currentRoute === "/checkout/payment") &&
                <View className="h-full bg-green-500" />}
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("Checkout")}
              className="flex flex-col items-center gap-4 -mt-[13px] relative"
            >
              {currentRoute === "/checkout/payment"
                ? <View className="w-[30px] h-[30px] rounded-full bg-green-500 flex items-center justify-center">
                    <Text className="text-white">✓</Text>
                  </View>
                : <View className="w-[30px] h-[30px] border-4 rounded-full border-gray-300 bg-gray-300" />}
              <Text
                className={`text-sm font-medium absolute -bottom-8 ${currentRoute ===
                "/checkout/checkout"
                  ? "text-green-500"
                  : "text-gray-500"}`}
              >
                Checkout
              </Text>
            </TouchableOpacity>

            <View className="flex-1 h-1 mx-2 bg-gray-200" />

            <TouchableOpacity
              onPress={() => navigation.navigate("Payment")}
              className="flex flex-col items-center gap-4 -mt-[13px] relative"
            >
              <View className="w-[30px] h-[30px] border-4 rounded-full border-gray-300 bg-gray-300" />
              <Text
                className={`text-sm font-medium absolute -bottom-8 ${currentRoute ===
                "/checkout/payment"
                  ? "text-green-500"
                  : "text-gray-500"}`}
              >
                Payment
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Checkbox Close */}

        {/* Default Router */}
        {children}
        {/* Default Router */}
      </View>
    </View>
  );
};

export default CheckoutComponent;
