import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";

const MobileNavBar = ({ onShowCategories, onShowCart, onShowProfile }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const isLoggedIn = useSelector(state => state.auth.authStatus);
  const cartItems = useSelector(state => state.frontendCart.lists);

  const isActiveRoute = routeName => {
    return route.name === routeName;
  };

  const NavItem = ({
    icon,
    label,
    isActive,
    onPress,
    showBadge = false,
    badgeCount = 0,
  }) =>
    <TouchableOpacity
      onPress={onPress}
      style={[styles.navItemContainer, isActive && styles.activeNavItem]}
    >
      <View style={styles.navItemContent}>
        <View style={{ position: "relative" }}>
          <MaterialIcons
            name={icon}
            size={24}
            color={isActive ? "#3B82F6" : "#6B7280"}
          />
          {showBadge &&
            badgeCount > 0 &&
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {badgeCount > 9 ? "9+" : badgeCount}
              </Text>
            </View>}
        </View>
        <Text
          style={[styles.navItemText, isActive && styles.activeNavItemText]}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>;

  return (
    <View style={styles.container}>
      {/* Home */}
      <NavItem
        icon="home"
        label="Home"
        isActive={isActiveRoute("Home")}
        onPress={() => navigation.navigate("Home")}
      />

      {/* Categories */}
      <NavItem
        icon="category"
        label="Categories"
        isActive={false}
        onPress={onShowCategories}
      />

      {/* Cart (floating button) */}
      <TouchableOpacity onPress={onShowCart} style={styles.cartButton}>
        <MaterialIcons name="shopping-cart" size={28} color="white" />
        {cartItems.length > 0 &&
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>
              {cartItems.length > 9 ? "9+" : cartItems.length}
            </Text>
          </View>}
      </TouchableOpacity>

      {/* Wishlist */}
      <NavItem
        icon="favorite-border"
        label="Wishlist"
        isActive={isActiveRoute("Wishlist")}
        onPress={() =>
          isLoggedIn
            ? navigation.navigate("Wishlist")
            : navigation.navigate("Login")}
        showBadge={false}
      />

      {/* Profile/Login */}
      {isLoggedIn
        ? <NavItem
            icon="person"
            label="Profile"
            isActive={isActiveRoute("Profile")}
            onPress={onShowProfile}
          />
        : <NavItem
            icon="login"
            label="Login"
            isActive={isActiveRoute("Login")}
            onPress={() => navigation.navigate("Login")}
          />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },
  activeNavItem: {
    backgroundColor: "#F3F4F6",
  },
  navItemContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  navItemText: {
    fontSize: 12,
    marginTop: 4,
    color: "#6B7280",
  },
  activeNavItemText: {
    color: "#3B82F6",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#F59E0B",
    borderRadius: 10,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
  },
  cartButton: {
    position: "absolute",
    bottom: 40,
    left: "50%",
    marginLeft: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cartBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#F59E0B",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "white",
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
  },
});

export default MobileNavBar;
