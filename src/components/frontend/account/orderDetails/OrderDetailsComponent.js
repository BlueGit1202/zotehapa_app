import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  StyleSheet,
  Linking,
  Modal 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderDetails, changeOrderStatus } from '../../../../store/actions/frontend/frontendOrderActions';
import { useNavigation, useRoute } from '@react-navigation/native';
import orderStatusEnum from '../../../../enums/modules/orderStatusEnum';
import paymentStatusEnum from '../../../../enums/modules/paymentStatusEnum';
import addressTypeEnum from "../../../../enums/modules/addressTypeEnum";
import orderTypeEnum from "../../../../enums/modules/orderTypeEnum";
import OrderReceiptComponent from './OrderReceiptComponent';

const OrderDetailsComponent = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { 
    show: order, 
    orderProducts, 
    orderUser, 
    orderAddress, 
    outletAddress 
  } = useSelector(state => state.frontendOrder);
  const [loading, setLoading] = useState(true);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    if (route.params?.id) {
      loadOrderDetails();
    }
  }, [route.params?.id]);

  const loadOrderDetails = () => {
    setLoading(true);
    dispatch(fetchOrderDetails(route.params.id))
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };

  const orderStatusClass = (status) => {
    switch(status) {
      case orderStatusEnum.PENDING: return styles.pendingStatus;
      case orderStatusEnum.CONFIRMED: return styles.confirmedStatus;
      case orderStatusEnum.ON_THE_WAY: return styles.onTheWayStatus;
      case orderStatusEnum.DELIVERED: return styles.deliveredStatus;
      case orderStatusEnum.CANCELED: 
      case orderStatusEnum.REJECTED: 
        return styles.canceledStatus;
      default: return styles.defaultStatus;
    }
  };

  const handleStatusChange = (status) => {
    setLoading(true);
    dispatch(changeOrderStatus({ id: order.id, status }))
      .then(() => {
        setLoading(false);
        alert('Order status updated successfully');
      })
      .catch(() => setLoading(false));
  };

  const tracks = [
    { step: 1, title: 'Order Pending' },
    { step: 5, title: 'Order Confirmed' },
    { step: 7, title: 'Order On The Way' },
    { step: 10, title: 'Order Delivered' },
  ];

  const pickupTracks = [
    { step: 1, title: 'Order Pending' },
    { step: 5, title: 'Order Confirmed' },
    { step: 10, title: 'Order Delivered' },
  ];

  const renderTrack = (track, index, tracks) => {
    const isActive = track.step <= order.status;
    return (
      <View key={index} style={styles.trackItem}>
        <View style={[styles.trackLine, isActive && styles.activeTrackLine]} />
        <View style={[styles.trackIcon, isActive && styles.activeTrackIcon]}>
          <Text style={isActive ? styles.activeTrackText : styles.trackText}>
            {index + 1}
          </Text>
        </View>
        <View style={[styles.trackLine, isActive && styles.activeTrackLine]} />
        <Text style={styles.trackTitle}>{track.title}</Text>
      </View>
    );
  };

  if (loading && !order.id) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B6FED"/>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.thankYouSection}>
          <Text style={styles.thankYouTitle}>Thank You</Text>
          <Text style={styles.orderFollowText}>Order status follows</Text>
          <Text style={styles.orderIdText}>
            Order ID: <Text style={styles.orderIdHighlight}>#{order.order_serial_no}</Text>
          </Text>

          {order.status !== orderStatusEnum.CANCELED && 
           order.status !== orderStatusEnum.REJECTED && 
           order.order_type !== orderTypeEnum.PICK_UP && (
            <View style={styles.trackContainer}>
              {tracks.map((track, index) => renderTrack(track, index, tracks))}
            </View>
          )}

          {order.status !== orderStatusEnum.CANCELED && 
           order.status !== orderStatusEnum.REJECTED && 
           order.order_type === orderTypeEnum.PICK_UP && (
            <View style={styles.trackContainer}>
              {pickupTracks.map((track, index) => renderTrack(track, index, pickupTracks))}
            </View>
          )}

          {order.status === orderStatusEnum.CANCELED && (
            <TouchableOpacity style={styles.canceledButton}>
              <Text style={styles.canceledButtonText}>Order Cancelled</Text>
            </TouchableOpacity>
          )}

          {order.status === orderStatusEnum.REJECTED && (
            <TouchableOpacity style={styles.rejectedButton}>
              <Text style={styles.rejectedButtonText}>Order Rejected</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.leftColumn}>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Order ID:</Text>
                <Text style={styles.infoValue}>#{order.order_serial_no}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Order Date:</Text>
                <Text style={styles.infoValue}>{order.order_date} {order.order_time}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Order Type:</Text>
                <Text style={styles.infoValue}>
                  {orderTypeEnum[order.order_type]}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Order Status:</Text>
                <Text style={[styles.statusBadge, orderStatusClass(order.status)]}>
                  {orderStatusEnum[order.status]}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Payment Status:</Text>
                <Text style={[
                  styles.paymentBadge,
                  order.payment_status === paymentStatusEnum.PAID ? 
                    styles.paidBadge : styles.unpaidBadge
                ]}>
                  {paymentStatusEnum[order.payment_status]}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Payment Method:</Text>
                <Text style={styles.infoValue}>{order.payment_method_name}</Text>
              </View>
            </View>

            {order.order_type === orderTypeEnum.DELIVERY && orderAddress.length > 0 && (
              orderAddress.map((address, index) => (
                <View key={index} style={[
                  styles.addressCard,
                  address.address_type === addressTypeEnum.SHIPPING ? styles.mb6 : ''
                ]}>
                  <Text style={styles.addressTitle}>
                    {address.address_type === addressTypeEnum.SHIPPING ? 
                      'Shipping Address' : 'Billing Address'}
                  </Text>
                  <View style={styles.addressDetails}>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Name:</Text>
                      <Text style={styles.infoValue}>{address.full_name}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Phone:</Text>
                      <Text style={styles.infoValue}>
                        {address.country_code} {address.phone}
                      </Text>
                    </View>
                    {address.email && (
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Email:</Text>
                        <Text style={styles.infoValue}>{address.email}</Text>
                      </View>
                    )}
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Address:</Text>
                      <Text style={styles.infoValue}>
                        {address.address && <Text>{address.address}</Text>}
                        {(address.city || address.state || address.country || address.zip_code) && (
                          <Text style={address.address ? styles.addressLine : ''}>
                            {address.city && `${address.city}, `}
                            {address.state && `${address.state}, `}
                            {address.country && `${address.country}, `}
                            {address.zip_code && address.zip_code}
                          </Text>
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}

            {order.order_type === orderTypeEnum.PICK_UP && Object.keys(outletAddress).length > 0 && (
              <View style={styles.addressCard}>
                <Text style={styles.addressTitle}>Pick Up Address</Text>
                <View style={styles.addressDetails}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Name:</Text>
                    <Text style={styles.infoValue}>{outletAddress.name}</Text>
                  </View>
                  {outletAddress.phone && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Phone:</Text>
                      <Text style={styles.infoValue}>
                        {outletAddress.country_code} {outletAddress.phone}
                      </Text>
                    </View>
                  )}
                  {outletAddress.email && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Email:</Text>
                      <Text style={styles.infoValue}>{outletAddress.email}</Text>
                    </View>
                  )}
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Address:</Text>
                    <Text style={styles.infoValue}>
                      {outletAddress.address && <Text>{outletAddress.address}</Text>}
                      {(outletAddress.city || outletAddress.state || outletAddress.zip_code) && (
                        <Text style={outletAddress.address ? styles.addressLine : ''}>
                          {outletAddress.city && `${outletAddress.city}, `}
                          {outletAddress.state && `${outletAddress.state}, `}
                          {outletAddress.zip_code && outletAddress.zip_code}
                        </Text>
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          <View style={styles.rightColumn}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <View style={styles.productsList}>
                {orderProducts.map((product, index) => (
                  <View key={index} style={styles.productItem}>
                    <Image 
                      source={{ uri: product.product_image }} 
                      style={styles.productImage} 
                    />
                    <View style={styles.productDetails}>
                      <Text 
                        style={[
                          styles.productName,
                          !product.variation_names && styles.mb4
                        ]}
                        numberOfLines={1}
                      >
                        {product.product_name}
                      </Text>
                      {product.variation_names && (
                        <Text style={styles.productVariation} numberOfLines={1}>
                          {product.variation_names}
                        </Text>
                      )}
                      <View style={styles.productFooter}>
                        <View style={styles.productPriceContainer}>
                          <Text style={styles.productPrice}>
                            {product.subtotal_currency_price}
                          </Text>
                          <Text style={styles.productQuantity}>
                            Quantity: {product.quantity}
                          </Text>
                        </View>
                        {order.status === orderStatusEnum.DELIVERED && (
                          <TouchableOpacity 
                            style={styles.reviewButton}
                            onPress={() => navigation.navigate(
                              product.product_user_review ? 
                                'ProductReviewEdit' : 'ProductReview',
                              { 
                                slug: product.product_slug,
                                ...(product.product_user_review && { 
                                  id: product.product_user_review_id 
                                })
                              }
                            )}
                          >
                            <Text style={styles.reviewButtonText}>
                              {product.product_user_review ? 
                                'Edit Review' : 'Write Review'}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
              <View style={styles.summaryDetails}>
                <View style={styles.summaryRow}>
                  <Text>Subtotal</Text>
                  <Text style={styles.summaryValue}>{order.subtotal_currency_price}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text>Tax Fee</Text>
                  <Text style={styles.summaryValue}>{order.tax_currency_price}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text>Shipping Charge</Text>
                  <Text style={styles.summaryValue}>{order.shipping_charge_currency_price}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text>Discount</Text>
                  <Text style={styles.summaryValue}>{order.discount_currency_price}</Text>
                </View>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{order.total_currency_price}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {order.status !== orderStatusEnum.CANCELED && (
        <View style={styles.actionButtons}>
          <OrderReceiptComponent 
            order={order} 
            orderProducts={orderProducts} 
            orderUser={orderUser}
            orderAddress={orderAddress[0]}
          />
          
          {order.status === orderStatusEnum.PENDING && (
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => handleStatusChange(orderStatusEnum.CANCELED)}
            >
              <Text style={styles.cancelButtonText}>Cancel Order</Text>
            </TouchableOpacity>
          )}
          
          {order.status === orderStatusEnum.DELIVERED && order.return_and_refund && (
            <TouchableOpacity 
              style={styles.returnButton}
              onPress={() => navigation.navigate('ReturnOrderRequest', { id: order.id })}
            >
              <Text style={styles.returnButtonText}>Return Request</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={showReceiptModal}
        onRequestClose={() => setShowReceiptModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <OrderReceiptComponent 
              order={order} 
              orderProducts={orderProducts} 
              orderUser={orderUser}
              orderAddress={orderAddress[0]}
              onClose={() => setShowReceiptModal(false)}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  backButton: {
    marginRight: 16,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B6FED',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B6FED',
  },
  card: {
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
    padding: 16,
  },
  thankYouSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  thankYouTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  orderFollowText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  orderIdText: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderIdHighlight: {
    color: '#4B6FED',
  },
  trackContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 48,
    marginTop: 32,
  },
  trackItem: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  trackLine: {
    width: '100%',
    height: 2,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  activeTrackLine: {
    backgroundColor: '#10B981',
  },
  trackIcon: {
    width: 28,
    height: 28,
    lineHeight: 28,
    textAlign: 'center',
    borderRadius: 9999,
    backgroundColor: '#e5e7eb',
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTrackIcon: {
    backgroundColor: '#10B981',
  },
  trackText: {
    fontSize: 16,
  },
  activeTrackText: {
    color: '#fff',
  },
  trackTitle: {
    position: 'absolute',
    top: 40,
    left: '50%',
    transform: [{ translateX: -50 }],
    width: 80,
    fontSize: 12,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  canceledButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginTop: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#FB4E4E',
    backgroundColor: '#fff',
  },
  canceledButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FB4E4E',
    textTransform: 'capitalize',
  },
  rejectedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginTop: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#FB4E4E',
    backgroundColor: '#fff',
  },
  rejectedButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FB4E4E',
    textTransform: 'capitalize',
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  leftColumn: {
    width: '100%',
    paddingRight: 0,
    marginBottom: 16,
  },
  rightColumn: {
    width: '100%',
  },
  infoCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 112,
    flexShrink: 0,
    textTransform: 'capitalize',
  },
  infoValue: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  statusBadge: {
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    textTransform: 'capitalize',
  },
  pendingStatus: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  confirmedStatus: {
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
  },
  onTheWayStatus: {
    backgroundColor: '#EDE9FE',
    color: '#5B21B6',
  },
  deliveredStatus: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
  canceledStatus: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
  },
  defaultStatus: {
    backgroundColor: '#F3F4F6',
    color: '#374151',
  },
  paymentBadge: {
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    textTransform: 'capitalize',
  },
  paidBadge: {
    backgroundColor: '#E2FFEE',
    color: '#2AC769',
  },
  unpaidBadge: {
    backgroundColor: '#FFE8E8',
    color: '#FB4E4E',
  },
  addressCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  mb6: {
    marginBottom: 16,
  },
  addressTitle: {
    padding: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  addressDetails: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    borderStyle: 'dashed',
  },
  addressLine: {
    marginTop: 8,
    display: 'block',
  },
  summaryCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  summaryTitle: {
    padding: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  productsList: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
    borderStyle: 'dashed',
  },
  productItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    borderStyle: 'dashed',
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    flexShrink: 0,
  },
  productDetails: {
    flex: 1,
    overflow: 'hidden',
  },
  productName: {
    fontSize: 14,
    textTransform: 'capitalize',
    overflow: 'hidden',
  },
  mb4: {
    marginBottom: 16,
  },
  productVariation: {
    fontSize: 14,
    overflow: 'hidden',
  },
  productFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 16,
  },
  productPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  productQuantity: {
    fontSize: 14,
    fontWeight: '500',
  },
  reviewButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 9999,
    backgroundColor: '#FFF4F1',
  },
  reviewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B6FED',
    textTransform: 'capitalize',
  },
  summaryDetails: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF0F6',
    borderStyle: 'dashed',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  summaryValue: {
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  totalLabel: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  totalValue: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    marginBottom: 80,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#FB4E4E',
    backgroundColor: '#fff',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FB4E4E',
    textTransform: 'capitalize',
  },
  returnButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#FB4E4E',
    backgroundColor: '#fff',
  },
  returnButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FB4E4E',
    textTransform: 'capitalize',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
});

export default OrderDetailsComponent;