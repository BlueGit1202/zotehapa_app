import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Platform, 
  StyleSheet,
  ScrollView
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from '@expo/vector-icons';
import { dashboardActions } from "../../../store/actions/dashboardActions";
import LoadingComponent from "../components/LoadingComponent";

const OrderStatisticsComponent = () => {
  const dispatch = useDispatch();
  const { orderStatistics, loading } = useSelector(state => state.dashboard);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date()
  });

  // Color mapping with 400 variants
  const colorMap = {
    'bg-pink-400': '#FD0063',
    'bg-orange-400': '#FB4E4E',
    'bg-purple-400': '#6A45FE',
    'bg-blue-400': '#426EFF',
    'bg-green-400': '#2AC769',
    'bg-red-400': '#E93C3C',
    'bg-yellow-400': '#FFBC1F',
    'bg-indigo-400': '#5E5BFF'
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      if (!dateRange.startDate || (dateRange.startDate && dateRange.endDate)) {
        // If no start date selected or both dates are already selected, start new selection
        setDateRange({
          startDate: selectedDate,
          endDate: null
        });
      } else {
        // If start date is selected but end date isn't
        const newDateRange = {
          startDate: dateRange.startDate,
          endDate: selectedDate
        };
        setDateRange(newDateRange);
        
        // Make sure end date is after start date
        if (selectedDate >= dateRange.startDate) {
          dispatch(
            dashboardActions.fetchOrderStatistics({
              first_date: newDateRange.startDate.toISOString().split('T')[0],
              last_date: newDateRange.endDate.toISOString().split('T')[0]
            })
          );
        } else {
          // If end date is before start date, swap them
          setDateRange({
            startDate: selectedDate,
            endDate: dateRange.startDate
          });
          dispatch(
            dashboardActions.fetchOrderStatistics({
              first_date: selectedDate.toISOString().split('T')[0],
              last_date: dateRange.startDate.toISOString().split('T')[0]
            })
          );
        }
      }
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const stats = [
    {
      title: "Total Orders",
      value: orderStatistics?.total_order || '0',
      bgColor: "bg-pink-400",
      icon: "list-alt"
    },
    {
      title: "Pending",
      value: orderStatistics?.pending_order || '0',
      bgColor: "bg-orange-400",
      icon: "pending"
    },
    {
      title: "Confirmed",
      value: orderStatistics?.confirmed_order || '0',
      bgColor: "bg-green-400",
      icon: "check-circle"
    },
    {
      title: "Ongoing",
      value: orderStatistics?.ongoing_order || '0',
      bgColor: "bg-blue-400",
      icon: "local-shipping"
    },
    {
      title: "Delivered",
      value: orderStatistics?.delivered_order || '0',
      bgColor: "bg-purple-400",
      icon: "done-all"
    },
    {
      title: "Canceled",
      value: orderStatistics?.canceled_order || '0',
      bgColor: "bg-red-400",
      icon: "cancel"
    },
    {
      title: "Returned",
      value: orderStatistics?.returned_order || '0',
      bgColor: "bg-indigo-400",
      icon: "assignment-return"
    },
    {
      title: "Rejected",
      value: orderStatistics?.rejected_order || '0',
      bgColor: "bg-yellow-400",
      icon: "block"
    }
  ];

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order Statistics</Text>
        <TouchableOpacity
          onPress={showDatepicker}
          style={styles.dateRangeButton}
        >
          <MaterialIcons name="event" size={16} color="#6b7280" />
          <Text style={styles.dateRangeText}>
            {formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={dateRange.startDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      <ScrollView contentContainerStyle={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <View style={[
              styles.card,
              { backgroundColor: colorMap[stat.bgColor] }
            ]}>
              <View style={styles.iconContainer}>
                <View style={styles.iconCircle}>
                  <MaterialIcons 
                    name={stat.icon} 
                    size={28} 
                    style={[styles.icon, { color: colorMap[stat.bgColor] }]}
                  />
                </View>
              </View>
              
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{stat.title}</Text>
                <Text style={styles.cardValue}>{stat.value}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  iconContainer: {
    marginRight: 12,
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
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default OrderStatisticsComponent;