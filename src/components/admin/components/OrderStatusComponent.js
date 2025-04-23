import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import orderStatusEnum from "../../../enums/modules/orderStatusEnum";
import orderTypeEnum from "../../../enums/modules/orderTypeEnum";
track;
const OrderStatusComponent = ({ order }) => {
  // Define enums

  // Track configurations
  const tracks = [
    { step: 1, title: "Order Pending" },
    { step: 5, title: "Order Confirmed" },
    { step: 7, title: "On The Way" },
    { step: 10, title: "Delivered" }
  ];

  const pickupTracks = [
    { step: 1, title: "Order Pending" },
    { step: 5, title: "Order Confirmed" },
    { step: 10, title: "Ready for Pickup" }
  ];

  const renderTrack = (track, index, tracksArray) => {
    const isActive = track.step <= order.status;
    const isFirst = index === 0;
    const isLast = index === tracksArray.length - 1;

    return (
      <View key={index} style={styles.trackContainer}>
        {/* Left line - hidden for first item */}
        {!isFirst &&
          <View style={[styles.trackLine, isActive && styles.activeLine]} />}

        {/* Circle icon */}
        <View style={[styles.trackCircle, isActive && styles.activeCircle]}>
          {isActive
            ? <MaterialIcons name="check" size={16} color="white" />
            : <MaterialIcons name="schedule" size={16} color="#6b7280" />}
        </View>

        {/* Right line - hidden for last item */}
        {!isLast &&
          <View style={[styles.trackLine, isActive && styles.activeLine]} />}

        {/* Label */}
        <Text style={styles.trackLabel}>
          {track.title}
        </Text>
      </View>
    );
  };

  if (order.status === orderStatusEnum.CANCELED) {
    return (
      <TouchableOpacity style={styles.statusButtonCanceled}>
        <MaterialIcons name="cancel" size={20} color="#ef4444" />
        <Text style={styles.statusButtonText}>Order Cancelled</Text>
      </TouchableOpacity>
    );
  }

  if (order.status === orderStatusEnum.REJECTED) {
    return (
      <TouchableOpacity style={styles.statusButtonRejected}>
        <MaterialIcons name="cancel" size={20} color="#ef4444" />
        <Text style={styles.statusButtonText}>Order Rejected</Text>
      </TouchableOpacity>
    );
  }

  if (order.order_type === orderTypeEnum.PICK_UP) {
    return (
      <View style={styles.tracksContainer}>
        {pickupTracks.map((track, index) =>
          renderTrack(track, index, pickupTracks)
        )}
      </View>
    );
  }

  return (
    <View style={styles.tracksContainer}>
      {tracks.map((track, index) => renderTrack(track, index, tracks))}
    </View>
  );
};

const styles = StyleSheet.create({
  tracksContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    marginTop: 32,
    marginBottom: 20
  },
  trackContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  trackLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#e5e7eb",
    borderRadius: 2
  },
  activeLine: {
    backgroundColor: "#10b981"
  },
  trackCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4
  },
  activeCircle: {
    backgroundColor: "#10b981"
  },
  trackLabel: {
    position: "absolute",
    top: 40,
    width: 80,
    fontSize: 12,
    textAlign: "center",
    color: "#6b7280",
    textTransform: "capitalize"
  },
  statusButtonCanceled: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginTop: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ef4444",
    backgroundColor: "white",
    alignSelf: "center",
    marginBottom: 20
  },
  statusButtonRejected: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginTop: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ef4444",
    backgroundColor: "white",
    alignSelf: "center"
  },
  statusButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ef4444",
    textTransform: "capitalize"
  }
});

export default OrderStatusComponent;
