import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import DefaultComponent from "../components/DefaultComponent";

import DashboardScreen from "../components/admin/dashboard/DashboardComponent";
import ExceptionScreen from "../components/exception/ExceptionComponent";
import NotFoundScreen from "../components/exception/NotFoundComponent";
import LoginComponent from "../components/frontend/auth/LoginComponent";
import SignupComponent from "../components/frontend/auth/SignupComponent";
import SignupVerifyComponent from "../components/frontend/auth/SignupVerifyComponent";
import WishlistComponent from "../components/frontend/wishlist/WishlistComponent";
import AdminDashboard from "../components/admin/dashboard/AdminScreen";
import OrderHistoryComponent from "../components/frontend/account/orderHistory/OrderHistoryComponent";
import ReturnOrdersComponent from "../components/frontend/account/returnOrders/ReturnOrdersComponent";
import AccountInfoComponent from "../components/frontend/account/accountInfo/AccountInfoComponent";
import ChangePasswordComponent from "../components/frontend/account/changePassword/ChangePasswordComponent";
import AddressComponent from "../components/frontend/account/address/AddressComponent";
import ProductComponent from "../components/frontend/product/ProductComponent";
import ProductDetailsScreen from "../components/frontend/product/ProductDetailsComponent";
import CustomerCreateComponent from "../components/admin/customers/CustomerCreateComponent";
import CustomerShowComponent from "../components/admin/customers/CustomerShowComponent";
import EmployeeShowComponent from "../components/admin/employees/EmployeeShowComponent";
import EmployeeCreateComponent from "../components/admin/employees/EmployeeCreateComponent";
import ProfileChangePasswordComponent from "../components/admin/profile/ProfileChangePasswordComponent"
import EditProfileComponent from "../components/admin/profile/ProfileEditProfileComponent";
import PromotionProductComponent from "../components/frontend/product/PromotionProductComponent";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const LoadingScreen = () =>
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#4B6FED" />
  </View>;

const AdminStack = () => {
  return (
    <Stack.Navigator>
      s
      <Stack.Screen
        name="AdminDashboard"
        component={DashboardScreen}
        options={{ title: "Dashboard" }}
      />
    </Stack.Navigator>
  );
};

const MainDrawer = () => {
  return (
    <Drawer.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerStyle: { backgroundColor: "#FF6B6B" },
        headerTintColor: "#fff",
        drawerActiveTintColor: "#FF6B6B"
      }}
    >
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  const { authStatus, loading } = useSelector(state => state.auth);
  const { lists: brands } = useSelector(state => state.frontendProductBrand);
  const products = useSelector((state) => state.frontendProductCategory.trees);
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!authStatus
        ? <>
          <Stack.Screen name="Home" component={DefaultComponent} />
          <Stack.Screen name="Login" component={LoginComponent} />
          <Stack.Screen name="Signup" component={SignupComponent} />
          <Stack.Screen name="SignupVerify" component={SignupVerifyComponent} />
        </>
        : <>
          <Stack.Screen name="HomeScreen" component={DefaultComponent} />
      <Stack.Screen name="Dashboard" component={AdminDashboard} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryComponent} />
      <Stack.Screen name="ReturnOrders" component={ReturnOrdersComponent} />
      <Stack.Screen name="AccountInfo" component={AccountInfoComponent} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordComponent} />
      <Stack.Screen name="Address" component={AddressComponent} />
          <Stack.Screen name="Wishlist" component={WishlistComponent} />
          <Stack.Screen name="CustomerCreate" component={CustomerCreateComponent} />
          <Stack.Screen name="AdminChangePassword" component={ProfileChangePasswordComponent} />
          <Stack.Screen name="AdminProfileEdit" component={EditProfileComponent}/>
          <Stack.Screen 
        name="CustomerEdit" 
        component={CustomerCreateComponent}
        options={({ route }) => ({ 
          title: route.params?.title || 'CustomerEdit' 
        })}
          />
          <Stack.Screen 
        name="CustomerShow" 
        component={CustomerShowComponent}
        options={({ route }) => ({ 
          title: route.params?.title || 'CustomerShow' 
        })}
          />
          <Stack.Screen 
        name="EmployeeShow" 
        component={EmployeeShowComponent}
        options={({ route }) => ({ 
          title: route.params?.title || 'EmployeeShow' 
        })}
          />
          <Stack.Screen 
        name="EmployeeEdit" 
        component={EmployeeCreateComponent}
        options={({ route }) => ({ 
          title: route.params?.title || 'EmployeeEdit' 
        })}
      />
        </>}
         {/* Product Details Screen */}
      <Stack.Screen 
        name="ProductDetails" 
        component={ProductDetailsScreen}
        options={({ route }) => ({ 
          title: route.params?.title || 'Product Details' 
        })}
      /> 
      
      {/* Product List Screen (for categories) */}
      <Stack.Screen 
        name="ProductList" 
        component={ProductComponent}
        options={({ route }) => ({ 
          title: route.params?.title || 'Products' 
        })}
      />
      
      {/* Products Screen (alternative listing) */}
      <Stack.Screen 
        name="Products" 
        component={ProductComponent}
        options={({ route }) => ({ 
          title: route.params?.title || 'Products' 
        })}
      />
      <Stack.Screen name="PromotionProducts" component={PromotionProductComponent} options={({ route }) => ({ 
          title: route.params?.title || 'PromotionProducts' 
        })}/>
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Page Not Found" }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
