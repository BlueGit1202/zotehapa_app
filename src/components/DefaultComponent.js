import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch } from "react-redux";

import FrontendHeaderbar from "./layouts/frontend/FrontendHeaderComponent";
import FrontendMobileNavbar from "./layouts/frontend/FrontendMobileNavBarComponent";
import FrontendMobileCategory from "./layouts/frontend/FrontendMobileCategoryComponent";
import FrontendCart from "./layouts/frontend/FrontendCartComponent";
import FrontendProfile from "./layouts/frontend/FrontendMobileAccountComponent";
import HomeComponent from "./frontend/home/HomeComponent";
import Chatbot from "./Chatbot";
import { fetchSettings } from "../store/actions/frontend/frontendSettingActions";
import { initGlobal } from "../store/actions/globalStateActions";

const DefaultComponent = () => {
  const [categoryDrawerVisible, setCategoryDrawerVisible] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize frontend settings
        await dispatch(fetchSettings()).then(res => {
          dispatch(
            initGlobal({
              language_id: res.site_default_language,
              search_restaurant: "",
              location: null,
              latitude: null,
              longitude: null,
            })
          );
        });
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setIsLoading(false); // Hide loading when done
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B6FED" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <FrontendHeaderbar />
      </View>

      {/* Modals/Drawers */}
      <FrontendMobileCategory
        visible={categoryDrawerVisible}
        onClose={() => setCategoryDrawerVisible(false)}
      />
      <FrontendCart
        visible={cartVisible}
        onClose={() => setCartVisible(false)}
      />
      <FrontendProfile
        visible={profileVisible}
        onClose={() => setProfileVisible(false)}
      />

      {/* Main Content */}
      <View style={styles.contentWrapper}>
        <HomeComponent />
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavbar}>
        <FrontendMobileNavbar
          onShowCategories={() => setCategoryDrawerVisible(true)}
          onShowCart={() => setCartVisible(true)}
          onShowProfile={() => setProfileVisible(true)}
        />
      </View>

      {/* Chatbot */}
      <View style={styles.chatbot}>
        <Chatbot />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 10,
  },
  contentWrapper: {
    flex: 1,
    marginTop: 60,
    marginBottom: 60,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  content: {
    flex: 1,
  },
  bottomNavbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 10,
  },
  chatbot: {
    position: "absolute",
    bottom: 60,
    right: 5,
    zIndex: 200,
    elevation: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default DefaultComponent;
