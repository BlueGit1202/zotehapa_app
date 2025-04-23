import React, { useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PaginationComponent from '../../components/PaginationComponent';

const ReturnOrdersComponent = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  // Memoized selector using useMemo
  const { loading, returnOrders, pagination } = useSelector(state => {
    const { loading, lists: returnOrders, pagination } = state.frontendReturnAndRefund;
    return { loading, returnOrders, pagination };
  }, shallowEqual); // Using shallowEqual to prevent unnecessary updates
  
  // Return status enum
  const returnStatusEnum = useMemo(() => ({
    PENDING: 'Pending',
    ACCEPT: 'Accepted',
    REJECTED: 'Rejected'
  }), []);
  
  // Fetch data on component mount
  useEffect(() => {
    dispatch({ type: 'GET_RETURN_ORDERS_REQUEST' });
  }, [dispatch]);
  
  // Memoized status style getter
  const getStatusStyle = useMemo(() => (status) => {
    switch(status) {
      case 'PENDING': 
        return styles.statusPending;
      case 'ACCEPT': 
        return styles.statusAccepted;
      case 'REJECTED': 
        return styles.statusRejected;
      default: 
        return styles.statusDefault;
    }
  }, []);

  // Handle pagination
  const handlePageChange = (page) => {
    dispatch({ type: 'GET_RETURN_ORDERS_REQUEST', payload: { page } });
  };
  
  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Return Orders</Text>
      
      <View style={styles.tableContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.orderIdCell]}>Order ID</Text>
              <Text style={[styles.headerCell, styles.productsCell]}>Products</Text>
              <Text style={[styles.headerCell, styles.statusCell]}>Status</Text>
              <Text style={[styles.headerCell, styles.amountCell]}>Amount</Text>
              <Text style={[styles.headerCell, styles.actionCell]}>Action</Text>
            </View>
            
            {/* Table Rows */}
            {returnOrders && returnOrders.length > 0 ? (
              returnOrders.map((order, index) => (
                <View key={`${order.id}-${index}`} style={styles.tableRow}>
                  <View style={[styles.cell, styles.orderIdCell]}>
                    <Text style={styles.orderIdText}>{order.order_serial_no}</Text>
                    <Text style={styles.orderDateText}>{order.order_datetime}</Text>
                  </View>
                  <Text style={[styles.cell, styles.productsCell]}>{order.return_items} Product</Text>
                  <View style={[styles.cell, styles.statusCell]}>
                    <Text style={[styles.statusText, getStatusStyle(order.status)]}>
                      {returnStatusEnum[order.status]}
                    </Text>
                  </View>
                  <Text style={[styles.cell, styles.amountCell]}>{order.return_total_currency_price}</Text>
                  <View style={[styles.cell, styles.actionCell]}>
                    <TouchableOpacity 
                      style={styles.viewButton}
                      onPress={() => navigation.navigate('ReturnOrderDetails', { id: order.id })}
                    >
                      <Icon name="eye" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No return orders found</Text>
              </View>
            )}
          </View>
        </ScrollView>
        
        {/* Pagination */}
        {pagination && (
          <View style={styles.paginationContainer}>
            <PaginationComponent 
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 28,
  },
  tableContainer: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
  },
  headerCell: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    fontWeight: '600',
    color: '#374151',
  },
  orderIdCell: {
    width: 192,
  },
  productsCell: {
    width: 128,
  },
  statusCell: {
    width: 128,
  },
  amountCell: {
    width: 128,
  },
  actionCell: {
    width: 128,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  cell: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  orderIdText: {
    fontWeight: '600',
    marginBottom: 4,
  },
  orderDateText: {
    fontSize: 12,
    color: '#6b7280',
  },
  statusText: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 12,
    textAlign: 'center',
  },
  statusPending: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  statusAccepted: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  statusRejected: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  statusDefault: {
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
  },
  viewButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    padding: 16,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#6b7280',
  },
  paginationContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
});

export default ReturnOrdersComponent;