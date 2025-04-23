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
import { PieChart } from "react-native-chart-kit";
import { MaterialIcons } from '@expo/vector-icons';
import { dashboardActions } from "../../../store/actions/dashboardActions";
import LoadingComponent from "../components/LoadingComponent";

const OrderSummaryComponent = () => {
  const dispatch = useDispatch();
  const { orderSummary, loading } = useSelector(state => state.dashboard);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [animation] = useState(new Animated.Value(0));

  // Virtual data for when no date range is selected
  const virtualData = {
    delivered: 85,
    canceled: 12,
    rejected: 3
  };

  useEffect(() => {
    if (dateRange?.startDate && dateRange?.endDate) {
      fetchOrderData();
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

  const fetchOrderData = () => {
    if (dateRange?.startDate && dateRange?.endDate) {
      dispatch(
        dashboardActions.fetchOrderSummary({
          first_date: dateRange.startDate.toISOString().split('T')[0],
          last_date: dateRange.endDate.toISOString().split('T')[0]
        })
      );
    }
  };

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
  const displayData = dateRange?.startDate && dateRange?.endDate ? (orderSummary || virtualData) : virtualData;
  const isSampleData = !(dateRange?.startDate && dateRange?.endDate);
  const screenWidth = Dimensions.get("window").width;

  // Animated opacity for the chart
  const chartOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  const chartData = [
    {
      name: "Delivered",
      population: displayData?.delivered || 0,
      color: "#8b5cf6", // purple-500
      legendFontColor: "#374151",
      legendFontSize: 12
    },
    {
      name: "Canceled",
      population: displayData?.canceled || 0,
      color: "#ef4444", // red-500
      legendFontColor: "#374151",
      legendFontSize: 12
    },
    {
      name: "Rejected",
      population: displayData?.rejected || 0,
      color: "#f97316", // orange-500
      legendFontColor: "#374151",
      legendFontSize: 12
    }
  ];

  const totalOrders = chartData.reduce((sum, item) => sum + item.population, 0);

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order Summary</Text>
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

      {/* Pie Chart with Legend */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>
          {isSampleData 
            ? 'Sample Order Data'
            : dateRange?.startDate && dateRange?.endDate
              ? `Order Data (${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)})`
              : 'Order Data'}
        </Text>
        
        <Animated.View style={{ opacity: chartOpacity }}>
          <View style={styles.chartContent}>
            {totalOrders > 0 ? (
              <PieChart
                data={chartData}
                width={screenWidth - 32}
                height={180}
                chartConfig={{
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                hasLegend={false}
              />
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No orders found</Text>
              </View>
            )}

            <View style={styles.legendContainer}>
              {chartData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={styles.legendRow}>
                    <View 
                      style={[styles.legendColor, { backgroundColor: item.color }]}
                    />
                    <Text style={styles.legendText}>
                      {item.name} {isSampleData && '(Sample)'}
                    </Text>
                  </View>
                  <View style={styles.legendDetails}>
                    <Text style={styles.legendDetailText}>
                      {item.population} orders
                    </Text>
                    <Text style={styles.legendDetailText}>
                      {totalOrders > 0 ? Math.round((item.population / totalOrders) * 100) : 0}%
                    </Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View 
                      style={[
                        styles.progressBar,
                        { 
                          backgroundColor: item.color,
                          width: `${totalOrders > 0 ? (item.population / totalOrders) * 100 : 0}%`
                        }
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
        
        {isSampleData && (
          <Text style={styles.sampleNote}>
            Select a date range to view your actual order data
          </Text>
        )}
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
  chartContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  noDataContainer: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  legendContainer: {
    width: '100%',
    marginTop: 16,
  },
  legendItem: {
    marginBottom: 16,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  legendDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  legendDetailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  sampleNote: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default OrderSummaryComponent;