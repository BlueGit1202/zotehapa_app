import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";
import LoadingComponent from "../components/LoadingComponent";
import { customerActions } from "../../../store/actions/customerActions";
import { MaterialIcons } from "@expo/vector-icons";

const CustomerShowComponent = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);

  const customer = useSelector(state => state.customer.show);

  useEffect(
    () => {
      const fetchCustomer = async () => {
        try {
          setLoading(true);
          await dispatch(customerActions.show(route.params.id));
        } catch (error) {
          console.error("Error fetching customer:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchCustomer();
    },
    [route.params.id]
  );

  if (loading || !customer) {
    return <LoadingComponent />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#3b82f6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {"Customer details"}
        </Text>
        <View style={styles.headerRightPlaceholder} />
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.card}>
          <View style={styles.profileContainer}>
            {customer.image &&
              <Image
                source={{ uri: customer.image }}
                style={styles.profileImage}
              />}
            <View style={styles.profileTextContainer}>
              <Text style={styles.nameText}>
                {customer.name}
              </Text>
              <Text style={styles.emailText}>
                {customer.email}
              </Text>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {"Phone"}
              </Text>
              <Text style={styles.detailValue}>
                {customer.country_code}
                {customer.phone}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {"Status"}
              </Text>
              <Text
                style={[
                  styles.detailValue,
                  customer.status === "active"
                    ? styles.activeStatus
                    : styles.inactiveStatus,
                ]}
              >
                {customer.status === "active" ? "Active" : "Inactive"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {"Registered at"}
              </Text>
              <Text style={styles.detailValue}>
                {customer.created_at}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {"Additional information"}
          </Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {"Total orders"}
            </Text>
            <Text style={styles.detailValue}>
              {customer.total_orders || 0}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {"Completed orders"}
            </Text>
            <Text style={styles.detailValue}>
              {customer.completed_orders || 0}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {"Canceled orders"}
            </Text>
            <Text style={styles.detailValue}>
              {customer.canceled_orders || 0}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  headerRightPlaceholder: {
    width: 32, // Same as back button for balance
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    padding: 16,
    marginBottom: 16,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileTextContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: "#6b7280",
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  detailLabel: {
    fontWeight: "500",
    color: "#374151",
  },
  detailValue: {
    color: "#6b7280",
  },
  activeStatus: {
    color: "#16a34a",
  },
  inactiveStatus: {
    color: "#dc2626",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
});

export default CustomerShowComponent;
