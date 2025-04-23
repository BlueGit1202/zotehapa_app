import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Modal,
  ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import orderTypeEnum from '../../../enums/modules/orderTypeEnum';
import { companyActions } from '../../../store/actions/companyActions';
import {getOrderDetails } from '../../../store/actions/frontend/frontendOrderActions';


const OrderReceiptComponent = ({ orderId, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  // Selectors
  const company = useSelector(state => state.company.lists);
  const order = useSelector(state => state.frontendOrder.show);
  const orderProducts = useSelector(state => state.frontendOrder.orderProducts);
  const orderUser = useSelector(state => state.frontendOrder.orderUser);
  const orderAddress = useSelector(state => state.frontendOrder.orderAddress);
  const outletAddress = useSelector(state => state.frontendOrder.outletAddress);



  const orderTypeEnumArray = {
    [orderTypeEnum.DELIVERY]: 'Delivery',
    [orderTypeEnum.PICK_UP]: 'Pick Up'
  };

  useEffect(() => {
    setVisible(true);
    dispatch(companyActions.lists());
    fetchOrder();
  }, []);

  const fetchOrder = () => {
    if (orderId) {
      setLoading(true);
      dispatch(getOrderDetails(orderId))
        .finally(() => setLoading(false));
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B6FED" />
      </View>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={() => {
        setVisible(false);
        onClose();
      }}
    >
      <ScrollView style={styles.container}>
        {/* Company Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>{company.company_name}</Text>
          <Text style={styles.companyAddress}>{company.company_address}</Text>
          <Text style={styles.companyPhone}>
            Tel: {company.company_calling_code} {company.company_phone}
          </Text>
        </View>

        {/* Order Info */}
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order #{order.order_serial_no}</Text>
          <View style={styles.dateTimeRow}>
            <Text style={styles.dateTimeText}>{order.order_date}</Text>
            <Text style={styles.dateTimeText}>{order.order_time}</Text>
          </View>
        </View>

        {/* Products Table */}
        <View style={styles.productsHeader}>
          <Text style={styles.tableHeaderText}>Qty</Text>
          <View style={styles.productDescriptionHeader}>
            <Text style={styles.tableHeaderText}>Product Description</Text>
            <Text style={styles.tableHeaderText}>Price</Text>
          </View>
        </View>

        {orderProducts.length>0 && orderProducts.map((product, index) => (
          <View key={index} style={styles.productRow}>
            <Text style={styles.productQty}>{product.quantity}</Text>
            <View style={styles.productDetails}>
              <View style={styles.productNameRow}>
                <Text style={styles.productName}>{product.product_name}</Text>
                <Text style={styles.productPrice}>{product.total_currency_price}</Text>
              </View>
              {product.variation_names && (
                <Text style={styles.variationNames}>{product.variation_names}</Text>
              )}
            </View>
          </View>
        ))}

        {/* Order Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>SUBTOTAL:</Text>
            <Text style={styles.summaryValue}>{order.subtotal_currency_price}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>TAX FEE:</Text>
            <Text style={styles.summaryValue}>{order.tax_currency_price}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>DISCOUNT:</Text>
            <Text style={styles.summaryValue}>{order.discount_currency_price}</Text>
          </View>
          {order.order_type === orderTypeEnum.DELIVERY && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>SHIPPING CHARGE:</Text>
              <Text style={styles.summaryValue}>{order.shipping_charge_currency_price}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, styles.boldText]}>TOTAL:</Text>
            <Text style={[styles.summaryValue, styles.boldText]}>{order.total_currency_price}</Text>
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order Type:</Text>
            <Text style={styles.detailValue}>{orderTypeEnumArray[order.order_type]}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Type:</Text>
            <Text style={styles.detailValue}>{order.payment_method_name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order Date/Time:</Text>
            <Text style={styles.detailValue}>{order.order_datetime}</Text>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.detailsSection}>
          {order.order_type === orderTypeEnum.DELIVERY ? (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Customer:</Text>
                <Text style={styles.detailValue}>{orderAddress[0]?.full_name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>
                  {orderAddress[0]?.country_code}{orderAddress[0]?.phone}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Address:</Text>
                <Text style={styles.detailValue}>
                  {[
                    orderAddress[0]?.address,
                    orderAddress[0]?.state,
                    orderAddress[0]?.city,
                    orderAddress[0]?.country,
                    orderAddress[0]?.zip_code
                  ].filter(Boolean).join(', ')}
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Customer:</Text>
                <Text style={styles.detailValue}>{orderUser?.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>
                  {orderUser?.country_code}{orderUser?.phone}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Outlet:</Text>
                <Text style={styles.detailValue}>
                  {[
                    outletAddress?.address,
                    outletAddress?.state,
                    outletAddress?.city,
                    outletAddress?.country,
                    outletAddress?.zip_code
                  ].filter(Boolean).join(', ')}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.thankYouText}>Thank you</Text>
          <Text style={styles.thankYouText}>Please come again</Text>
        </View>

        <View style={styles.poweredBy}>
          <Text style={styles.poweredByLabel}>Powered by</Text>
          <Text style={styles.companyNameFooter}>{company.company_name}</Text>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#A0AEC0',
    borderStyle: 'dashed',
    paddingBottom: 14,
    marginBottom: 8,
    alignItems: 'center',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  companyAddress: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  companyPhone: {
    fontSize: 12,
    textAlign: 'center',
  },
  orderInfo: {
    marginVertical: 6,
  },
  orderId: {
    fontSize: 12,
    textAlign: 'left',
    marginBottom: 4,
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTimeText: {
    fontSize: 12,
  },
  productsHeader: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#A0AEC0',
    borderStyle: 'dashed',
    paddingVertical: 4,
    marginVertical: 8,
  },
  tableHeaderText: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
  productDescriptionHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 16,
  },
  productRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#A0AEC0',
    borderStyle: 'dashed',
    paddingVertical: 4,
  },
  productQty: {
    fontSize: 12,
    width: 32,
  },
  productDetails: {
    flex: 1,
    marginLeft: 8,
  },
  productNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 12,
    flex: 1,
  },
  productPrice: {
    fontSize: 12,
  },
  variationNames: {
    fontSize: 12,
    color: '#4A5568',
    marginTop: 2,
  },
  summaryContainer: {
    paddingVertical: 8,
    paddingLeft: 28,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: 12,
  },
  boldText: {
    fontWeight: 'bold',
  },
  detailsSection: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#A0AEC0',
    borderStyle: 'dashed',
    paddingVertical: 4,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 12,
    marginRight: 8,
    width: 100,
  },
  detailValue: {
    fontSize: 12,
    flex: 1,
  },
  footer: {
    borderBottomWidth: 1,
    borderBottomColor: '#A0AEC0',
    borderStyle: 'dashed',
    paddingVertical: 8,
    alignItems: 'center',
  },
  thankYouText: {
    fontSize: 11,
    lineHeight: 14,
    textTransform: 'capitalize',
    marginBottom: 2,
  },
  poweredBy: {
    alignItems: 'flex-end',
    marginTop: 16,
  },
  poweredByLabel: {
    fontSize: 8,
    lineHeight: 10,
    width: 46,
  },
  companyNameFooter: {
    fontSize: 12,
    lineHeight: 16,
  },
});

export default OrderReceiptComponent;