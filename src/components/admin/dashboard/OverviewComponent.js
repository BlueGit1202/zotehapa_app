import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from '@expo/vector-icons';

import { dashboardActions } from "../../../store/actions/dashboardActions";
import LoadingComponent from "../components/LoadingComponent";

const OverviewComponent = () => {
  const dispatch = useDispatch();
  const {
    totalSales,
    totalOrders,
    totalCustomers,
    totalProducts,
    loading
  } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(dashboardActions.fetchTotalSales());
    dispatch(dashboardActions.fetchTotalOrders());
    dispatch(dashboardActions.fetchTotalCustomers());
    dispatch(dashboardActions.fetchTotalProducts());
  }, []);

  // Color mapping with 400 variants
  const colorMap = {
    'bg-pink-400': '#FD0063',
    'bg-orange-400': '#FB4E4E',
    'bg-purple-400': '#6A45FE',
    'bg-blue-400': '#426EFF'
  };

  const stats = [
    {
      title: "Total Earnings",
      value: `$${totalSales?.toFixed(2) || '0'}`,
      bgColor: "bg-pink-400",
      icon: "attach-money"
    },
    {
      title: "Total Orders",
      value: totalOrders || '0',
      bgColor: "bg-orange-400",
      icon: "local-shipping"
    },
    {
      title: "Total Customers",
      value: totalCustomers || '0',
      bgColor: "bg-purple-400",
      icon: "people"
    },
    {
      title: "Total Products",
      value: totalProducts || '0',
      bgColor: "bg-blue-400",
      icon: "inventory"
    }
  ];

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Overview</Text>
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            {/* Card Container */}
            <View style={[
              styles.card,
              { 
                backgroundColor: colorMap[stat.bgColor],
              }
            ]}>
              {/* Icon with white circle background */}
              <View style={styles.iconContainer}>
                <View style={styles.iconCircle}>
                  <MaterialIcons 
                    name={stat.icon} 
                    size={28} 
                    style={[styles.icon,{ 
                color: colorMap[stat.bgColor],
              }]} 
                  />
                </View>
              </View>
              
              {/* Text Content */}
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>
                  {stat.title}
                </Text>
                <Text style={styles.cardValue}>
                  {stat.value}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  title: {
    fontWeight: '600',
    fontSize: 20,
    marginBottom: 16,
    color: '#1F2937',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    paddingHorizontal: 16,
    marginVertical: 5
  },
  iconContainer: {
    marginRight: 12,
    backgroundColor: 'white',
    borderRadius:28
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: 'white',
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: '500',
    color: 'white',
    fontSize: 14,
  },
  cardValue: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  },
});

export default OverviewComponent;