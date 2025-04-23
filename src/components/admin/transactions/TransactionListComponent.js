import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { transactionActions } from "../../../store/actions/transactionActions";
import LoadingComponent from '../components/LoadingComponent';
import TableLimitComponent from '../components/TableLimitComponent';
import PaginationTextComponent from '../components/pagination/PaginationTextComponent';
import PaginationBox from '../components/pagination/PaginationBox';
import PaginationSMBox from '../components/pagination/PaginationSMBox';
import FilterComponent from '../components/buttons/collapse/FilterComponent';
import DateTimePicker from '@react-native-community/datetimepicker';


const TransactionListComponent = ({ navigation }) => {
  const dispatch = useDispatch();
  const { lists, pagination, page } = useSelector(state => state.transaction);
  const paymentGateways = useSelector(state => state.paymentGateway.lists);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState({
    paginate: 1,
    page: 1,
    per_page: 10,
    order_column: 'id',
    order_type: 'desc',
    order_serial_no: "",
    transaction_no: "",
    payment_method: null,
    from_date: "",
    to_date: ""
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    list();
  }, []);

  const list = async (page = 1) => {
    try {
      setLoading(true);
      const payload = { ...search, page };
      await dispatch(transactionActions.lists(payload));
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    list();
    setShowFilters(false);
  };

  const clearSearch = () => {
    setSearch({
      ...search,
      paginate: 1,
      page: 1,
      order_type: "desc",
      order_serial_no: "",
      transaction_no: "",
      payment_method: null,
      from_date: "",
      to_date: ""
    });
    setDateRange([new Date(), new Date()]);
    list();
    setShowFilters(false);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDateRange = [...dateRange];
      if (dateRange[0] && (!dateRange[1] || dateRange[0] === dateRange[1])) {
        newDateRange[1] = selectedDate;
        setDateRange(newDateRange);
        setSearch({
          ...search,
          from_date: newDateRange[0].toISOString().split('T')[0],
          to_date: newDateRange[1].toISOString().split('T')[0],
        });
      } else {
        setDateRange([selectedDate, null]);
      }
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <View style={styles.container}>
      <LoadingComponent loading={loading} />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Transactions</Text>
          <View style={styles.headerActions}>
            <TableLimitComponent method={list} search={search} page={page} />
            <FilterComponent onPress={toggleFilters} />
          </View>
        </View>
      </View>

      {showFilters && (
        <ScrollView style={styles.filterContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Transaction ID</Text>
            <TextInput
              value={search.transaction_no}
              onChangeText={(text) => setSearch({ ...search, transaction_no: text })}
              style={styles.input}
              placeholder="Search by transaction ID"
            />
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Order Serial No</Text>
            <TextInput
              value={search.order_serial_no}
              onChangeText={(text) => setSearch({ ...search, order_serial_no: text })}
              style={styles.input}
              placeholder="Search by order serial no"
            />
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Payment Method</Text>
            <View style={styles.input}>
              <Text>{search.payment_method?.name || 'All'}</Text>
            </View>
            {paymentGateways.map(gateway => (
              <TouchableOpacity
                key={gateway.slug}
                onPress={() => setSearch({ ...search, payment_method: gateway })}
                style={styles.paymentMethodItem}
              >
                <Text>{gateway.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Date</Text>
            <TouchableOpacity
              onPress={showDatepicker}
              style={styles.input}
            >
              <Text>
                {dateRange[0]?.toLocaleDateString()} - {dateRange[1]?.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dateRange[0] || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          <View style={styles.filterButtons}>
            <TouchableOpacity
              onPress={handleSearch}
              style={[styles.button, styles.searchButton]}
            >
              <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={clearSearch}
              style={[styles.button, styles.clearButton]}
            >
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      <ScrollView style={styles.content}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerText}>Transaction ID</Text>
            <Text style={styles.headerText}>Date</Text>
            <Text style={styles.headerText}>Payment Method</Text>
            <Text style={styles.headerText}>Order Serial No</Text>
            <Text style={styles.headerText}>Amount</Text>
          </View>

          {lists.length > 0 ? (
            lists.map((transaction) => (
              <View key={transaction.id} style={styles.tableRow}>
                <Text style={styles.cellText}>{transaction.transaction_no}</Text>
                <Text style={styles.cellText}>{transaction.date}</Text>
                <Text style={styles.cellText}>{transaction.payment_method}</Text>
                <Text style={styles.cellText}>{transaction.order_serial_no}</Text>
                <Text style={[
                  styles.cellText,
                  transaction.sign === '+' ? styles.positiveAmount : styles.negativeAmount
                ]}>
                  {transaction.sign} {transaction.amount}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text>No transactions found</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.paginationContainer}>
        <PaginationSMBox pagination={pagination} method={list} />
        <View style={styles.pagination}>
          <PaginationTextComponent props={{ page }} />
          <PaginationBox pagination={pagination} method={list} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  filterContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 8,
  },
  paymentMethodItem: {
    padding: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButton: {
    backgroundColor: '#3b82f6',
  },
  clearButton: {
    backgroundColor: '#4b5563',
  },
  buttonText: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 12,
  },
  headerText: {
    flex: 1,
    fontWeight: '500',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 12,
    alignItems: 'center',
  },
  cellText: {
    flex: 1,
  },
  positiveAmount: {
    color: '#10b981',
  },
  negativeAmount: {
    color: '#ef4444',
  },
  emptyState: {
    padding: 16,
    alignItems: 'center',
  },
  paginationContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  pagination: {
    display: 'none', // This will hide on mobile
  },
  // For larger screens you can use a media query or Platform.select
});

export default TransactionListComponent;