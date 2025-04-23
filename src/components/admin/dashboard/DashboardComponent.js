import React, { useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import OverviewComponent from "./OverviewComponent";
import OrderStatisticsComponent from "./OrderStatisticsComponent";
import SalesSummaryComponent from "./SalesSummaryComponent";
import OrderSummaryComponent from "./OrderSummaryComponent";
import CustomerStatsComponent from "./CustomerStatsComponent";
import { dashboardActions } from "../../../store/actions/dashboardActions";

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const { auth, dashboard } = useSelector(state => state);
  const demo = false; // Replace with your demo flag logic

  useEffect(() => {
    // Fetch all dashboard data
    dispatch(dashboardActions.fetchTotalSales());
    dispatch(dashboardActions.fetchTotalOrders());
    dispatch(dashboardActions.fetchTotalCustomers());
    dispatch(dashboardActions.fetchTotalProducts());
    dispatch(dashboardActions.fetchOrderStatistics());
    dispatch(dashboardActions.fetchOrderSummary());
    dispatch(dashboardActions.fetchSalesSummary());
    dispatch(dashboardActions.fetchCustomerStates());
    dispatch(dashboardActions.fetchTopProducts());
    dispatch(dashboardActions.fetchTopCustomers());
  }, []);

  const visitorMessage = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return "Good morning";
    if (hrs >= 12 && hrs <= 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <ScrollView style={styles.container}>
      {demo &&
        <View style={styles.demoBanner}>
          <Text style={styles.demoBannerTitle}>Reminder</Text>
          <Text>Data reset notification</Text>
        </View>}

      <View style={styles.headerContainer}>
        <Text style={styles.greetingText}>
          {visitorMessage()}
        </Text>
        <Text style={styles.userName}>
          {auth.authInfo.name}
        </Text>
      </View>

      {/* Overview Section */}
      <OverviewComponent />

      {/* Order Statistics Section */}
      <OrderStatisticsComponent />

      <View style={styles.contentContainer}>
        {/* Sales Summary */}
        <SalesSummaryComponent />

        {/* Order Summary */}
        <OrderSummaryComponent />

        {/* Customer Stats */}
        <CustomerStatsComponent />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9fafb", // equivalent to bg-gray-50
  },
  demoBanner: {
    marginBottom: 16,
    backgroundColor: "#fee2e2", // equivalent to bg-red-100
    padding: 16,
    borderRadius: 8,
  },
  demoBannerTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerContainer: {
    marginBottom: 32,
  },
  greetingText: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#2563eb", // equivalent to text-blue-600
    marginBottom: 8,
  },
  userName: {
    fontWeight: "500",
    fontSize: 20,
    color: "#374151", // equivalent to text-gray-700
  },
  contentContainer: {
    flexDirection: "column",
    gap: 16,
  },
});

export default DashboardScreen;
