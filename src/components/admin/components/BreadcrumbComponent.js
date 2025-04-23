import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const BreadcrumbComponent = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const authDefaultPermission = useSelector(state => state.auth.authDefaultPermission);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    updateBreadcrumbs();
  }, [route]);

  const updateBreadcrumbs = () => {
    let routes = [];
    let currentRoute = route;
    
    // Build the breadcrumb trail by walking up the navigation state
    while (currentRoute) {
      if (currentRoute.params?.breadcrumb) {
        routes.unshift({
          name: currentRoute.name,
          params: currentRoute.params,
          breadcrumb: currentRoute.params.breadcrumb
        });
      }
      currentRoute = currentRoute.params?.fromRoute;
    }
    
    setBreadcrumbs(routes);
  };

  const navigateTo = (routeName, params) => {
    navigation.navigate(routeName, params);
  };

  return (
    <View className="flex-row items-center py-2 px-4 bg-gray-50">
      {/* Default Permission Link */}
      {authDefaultPermission && Object.keys(authDefaultPermission).length > 0 && (
        <>
          <TouchableOpacity onPress={() => navigateTo(authDefaultPermission.url)}>
            <Text className="text-blue-500 text-sm">
              {authDefaultPermission.name}
            </Text>
          </TouchableOpacity>
          <Text className="mx-2 text-gray-400">/</Text>
        </>
      )}

      {/* Breadcrumb Links */}
      {breadcrumbs.map((item, index) => (
        <View key={index} className="flex-row items-center">
          {index < breadcrumbs.length - 1 ? (
            <>
              <TouchableOpacity onPress={() => navigateTo(item.name, item.params)}>
                <Text className="text-blue-500 text-sm">
                  {item.breadcrumb}
                </Text>
              </TouchableOpacity>
              <Text className="mx-2 text-gray-400">/</Text>
            </>
          ) : (
            <Text className="text-gray-600 text-sm">
              {item.breadcrumb}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
};

export default BreadcrumbComponent;