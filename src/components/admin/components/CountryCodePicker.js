import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const CountryCodePicker = ({ value, onValueChange, countryCodes }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredCodes = countryCodes.filter(
    code =>
      code.name.toLowerCase().includes(searchText.toLowerCase()) ||
      code.calling_code.includes(searchText)
  );

  const handleSelect = code => {
    onValueChange(code.calling_code);
    setModalVisible(false);
    setSearchText("");
  };

  return (
    <View>
      {/* Selected Country Code Display */}
      <TouchableOpacity
        style={styles.countryCodeButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.countryCodeText}>
          {value}
        </Text>
        <Icon name="chevron-down" size={16} />
      </TouchableOpacity>

      {/* Country Code Picker Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {"select country code"}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Icon name="close" size={24} />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <TextInput
              placeholder={"search country code"}
              value={searchText}
              onChangeText={setSearchText}
              style={styles.searchInput}
            />
          </View>

          {/* Country Code List */}
          <FlatList
            data={filteredCodes}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) =>
              <TouchableOpacity
                style={styles.countryItem}
                onPress={() => handleSelect(item)}
              >
                <View style={styles.countryInfo}>
                  <Text style={styles.flagEmoji}>
                    {item.flag_emoji}
                  </Text>
                  <Text style={styles.countryName}>
                    {item.name}
                  </Text>
                </View>
                <Text style={styles.callingCode}>
                  +{item.calling_code}
                </Text>
              </TouchableOpacity>}
            ListEmptyComponent={
              <View style={styles.emptyList}>
                <Text style={styles.emptyListText}>
                  {"no countries found"}
                </Text>
              </View>
            }
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  countryCodeButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 4,
    padding: 8,
  },
  countryCodeText: {
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 4,
    padding: 8,
  },
  countryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  countryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  flagEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  countryName: {
    fontSize: 16,
  },
  callingCode: {
    color: "#6b7280",
  },
  emptyList: {
    paddingVertical: 16,
  },
  emptyListText: {
    textAlign: "center",
    color: "#6b7280",
  },
});

export default CountryCodePicker;
