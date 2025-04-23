import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

const MenuChildrenComponent = ({ categories = [], icon = false }) => {
  const navigation = useNavigation();

  if (categories.length === 0) return null;

  return (
    <View style={styles.container}>
      {categories.map(category =>
        <View key={category.slug} style={styles.itemContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Product", { category: category.slug })}
            style={styles.link}
          >
            {icon &&
              <Icon name="chevron-forward" size={14} style={styles.icon} />}
            <Text style={[styles.text, !icon && styles.boldText]}>
              {category.name}
            </Text>
          </TouchableOpacity>

          {category.children &&
            <View style={styles.childrenContainer}>
              <MenuChildrenComponent
                icon={true}
                categories={category.children}
              />
            </View>}
        </View>
      )}
    </View>
  );
};

const styles = {
  container: {
    padding: 0,
    margin: 0,
  },
  itemContainer: {
    marginBottom: 8,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    textTransform: "capitalize",
    color: "#333",
  },
  boldText: {
    fontWeight: "500",
  },
  childrenContainer: {
    marginLeft: 12, // ml-3 equivalent
    marginTop: 4,
  },
};

export default MenuChildrenComponent;
