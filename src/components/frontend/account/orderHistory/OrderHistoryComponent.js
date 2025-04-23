import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../../../store/actions/frontend/frontendOrderActions";
import OrderReceiptModal from "../../components/OrderReceiptComponent";
import orderStatusEnum from "../../../../enums/modules/orderStatusEnum";
import paymentStatusEnum from "../../../../enums/modules/paymentStatusEnum";

const OrderHistoryComponent = () => {
  const dispatch = useDispatch();
  const { lists, pagination, page } = useSelector(state => state.frontendOrder);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = (page = 1) => {
    setLoading(true);
    const payload = {
      search: {
        paginate: 1,
        page,
        per_page: 10,
        order_column: "id",
        order_by: "desc",
        active: 1,
      },
    };
    dispatch(fetchOrders(payload))
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };

  const handleOrderReceiptModal = order => {
    setSelectedOrder(order);
    setShowReceiptModal(true);
  };

  const orderStatusClass = status => {
    switch (status) {
      case orderStatusEnum.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case orderStatusEnum.CONFIRMED:
        return "bg-blue-100 text-blue-800";
      case orderStatusEnum.ON_THE_WAY:
        return "bg-purple-100 text-purple-800";
      case orderStatusEnum.DELIVERED:
        return "bg-green-100 text-green-800";
      case orderStatusEnum.CANCELED:
      case orderStatusEnum.REJECTED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderItem = ({ item }) =>
    <View style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>
          #{item.order_serial_no}
        </Text>
        <Text style={styles.orderDate}>
          {item.order_datetime}
        </Text>
      </View>

      <View style={styles.orderInfo}>
        <Text style={styles.orderText}>
          {item.order_items} Product(s)
        </Text>

        <View style={[styles.statusBadge, orderStatusClass(item.status)]}>
          <Text style={styles.statusText}>
            {orderStatusEnum[item.status]}
          </Text>
        </View>

        <View
          style={
            item.payment_status === paymentStatusEnum.PAID
              ? styles.paidStatus
              : styles.unpaidStatus
          }
        >
          <Text style={styles.paymentText}>
            {paymentStatusEnum[item.payment_status]}
          </Text>
        </View>

        <Text style={styles.orderAmount}>
          {item.total_currency_price}
        </Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleOrderReceiptModal(item)}
        >
          <Text style={styles.actionText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>;

  if (loading && lists.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B6FED" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>

      <FlatList
        data={lists}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No orders found</Text>
        }
      />

      <OrderReceiptModal
        visible={showReceiptModal}
        order={selectedOrder}
        onClose={() => setShowReceiptModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#4B6FED",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orderItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderId: {
    fontWeight: "bold",
    fontSize: 16,
  },
  orderDate: {
    fontSize: 12,
    color: "#666",
  },
  orderInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  orderText: {
    fontSize: 14,
    color: "#333",
    width: "25%",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    width: "25%",
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  paidStatus: {
    backgroundColor: "#E2FFEE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    width: "15%",
  },
  unpaidStatus: {
    backgroundColor: "#FFE8E8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    width: "15%",
  },
  paymentText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#2AC769",
    textAlign: "center",
  },
  orderAmount: {
    fontWeight: "bold",
    width: "15%",
    textAlign: "right",
  },
  actionButton: {
    backgroundColor: "#4B6FED",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    width: "15%",
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default OrderHistoryComponent;
