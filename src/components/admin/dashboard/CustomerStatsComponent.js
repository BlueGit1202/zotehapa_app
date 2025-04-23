import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Platform, 
  StyleSheet,
  Dimensions,
  Animated,
  Easing
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import { BarChart } from "react-native-chart-kit";
import { MaterialIcons } from '@expo/vector-icons';
import { dashboardActions } from "../../../store/actions/dashboardActions";
import LoadingComponent from "../components/LoadingComponent";

const CustomerStatsComponent = () => {
  const dispatch = useDispatch();
  const { customerStats, loading } = useSelector(state => state.dashboard);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [animation] = useState(new Animated.Value(0));

  // Virtual data for when no date range is selected
  const virtualData = {
    total_customers: [120, 190, 150, 210, 180, 240, 200],
    times: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };

  useEffect(() => {
    if (dateRange?.startDate && dateRange?.endDate) {
      fetchCustomerData();
    }
    startAnimation();
  }, [dateRange]);

  const startAnimation = () => {
    animation.setValue(0);
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true
    }).start();
  };

  const fetchCustomerData = () => {
    if (dateRange?.startDate && dateRange?.endDate) {
      dispatch(
        dashboardActions.fetchCustomerStates({
          first_date: dateRange.startDate.toISOString().split('T')[0],
          last_date: dateRange.endDate.toISOString().split('T')[0]
        })
      );
    }
  };``

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      if (!dateRange?.startDate || (dateRange?.startDate && dateRange?.endDate)) {
        // Start new selection
        setDateRange({
          startDate: selectedDate,
          endDate: null
        });
      } else {
        // Complete the range
        const newRange = {
          startDate: dateRange.startDate,
          endDate: selectedDate
        };
        
        // Ensure chronological order
        if (selectedDate < dateRange.startDate) {
          newRange.startDate = selectedDate;
          newRange.endDate = dateRange.startDate;
        }
        
        setDateRange(newRange);
      }
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const clearDateRange = () => {
    setDateRange(null);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Use virtual data when no date range is selected
  const displayData = dateRange?.startDate && dateRange?.endDate ? (customerStats || virtualData) : virtualData;
  const isSampleData = !(dateRange?.startDate && dateRange?.endDate);
  const screenWidth = Dimensions.get("window").width;

  // Calculate stats
  const totalCustomers = displayData.total_customers?.reduce((a, b) => a + b, 0) || 0;
  const averageCustomers = displayData.total_customers ? Math.round(totalCustomers / displayData.total_customers.length) : 0;
  const peakCustomers = displayData.total_customers ? Math.max(...displayData.total_customers) : 0;

  // Animated opacity for the chart
  const chartOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Customer Stats</Text>
        <View style={styles.dateRangeContainer}>
          {dateRange?.startDate && dateRange?.endDate && (
            <TouchableOpacity
              onPress={clearDateRange}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={showDatepicker}
            style={styles.dateRangeButton}
          >
            <MaterialIcons name="event" size={16} color="#6b7280" />
            <Text style={styles.dateRangeText}>
              {dateRange?.startDate && dateRange?.endDate
                ? `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`
                : 'Select Date Range'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={dateRange?.startDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* Bar Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>
          {isSampleData 
            ? 'Sample Customer Data'
            : dateRange?.startDate && dateRange?.endDate
              ? `Customer Data (${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)})`
              : 'Customer Data'}
        </Text>
        
        <Animated.View style={{ opacity: chartOpacity }}>
          <BarChart
            data={{
              labels: displayData.times || [],
              datasets: [{
                data: displayData.total_customers || []
              }]
            }}
            width={screenWidth - 32}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            fromZero
            withCustomBarColorFromData={false}
            flatColor={true}
            showBarTops={false}
            withInnerLines={false}
            withHorizontalLabels={true}
            withVerticalLabels={true}
            segments={5}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#f0fdf4",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(86, 125, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
              barPercentage: 0.6,
              propsForLabels: { fontSize: 10 },
              style: { borderRadius: 16 },
              fillShadowGradient: '#567dff',
              fillShadowGradientOpacity: 1
            }}
            style={styles.chart}
          />
        </Animated.View>
        
        {isSampleData && (
          <Text style={styles.sampleNote}>
            Select a date range to view your actual customer data
          </Text>
        )}
      </View>

      {/* Summary Stats */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {peakCustomers}
          </Text>
          <Text style={styles.summaryLabel}>
            Peak {isSampleData && '(Sample)'}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {averageCustomers}
          </Text>
          <Text style={styles.summaryLabel}>
            Avg/Day {isSampleData && '(Sample)'}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {totalCustomers}
          </Text>
          <Text style={styles.summaryLabel}>
            Total {isSampleData && '(Sample)'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  clearButtonText: {
    fontSize: 12,
    color: '#374151',
  },
  dateRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  dateRangeText: {
    marginLeft: 8,
    color: '#374151',
  },
  chartContainer: {
    marginTop: 8,
  },
  chartTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    marginLeft: 4,
  },
  chart: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  sampleNote: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default CustomerStatsComponent;