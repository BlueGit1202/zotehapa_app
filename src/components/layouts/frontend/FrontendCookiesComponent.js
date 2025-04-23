import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";

const CookiesConsent = () => {
  const [visible, setVisible] = useState(false);
  const [slug, setSlug] = useState("not-found");
  const setting = useSelector(state => state.frontendSetting.lists);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkCookiesStatus();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const checkCookiesStatus = async () => {
    try {
      const response = await axios.get("frontend/cookies");
      if (response.data.data.cookies_notification === null) {
        setVisible(true);

        if (setting.cookies_details_page_id > 0) {
          try {
            const pageResponse = await axios.get(
              `frontend/page/${setting.cookies_details_page_id}`
            );
            setSlug(pageResponse.data.data.slug);
          } catch (error) {
            console.error("Error fetching page info:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error checking cookies status:", error);
    }
  };

  const handleAccept = async () => {
    try {
      await axios.post("frontend/cookies", { cookies_notification: true });
      setVisible(false);
    } catch (error) {
      console.error("Error accepting cookies:", error);
    }
  };

  const handleDecline = async () => {
    try {
      await axios.post("frontend/cookies", { cookies_notification: false });
      setVisible(false);
    } catch (error) {
      console.error("Error declining cookies:", error);
    }
  };

  const openCookiesSettings = () => {
    if (slug !== "not-found") {
      Linking.openURL(`/page/${slug}`);
    }
  };

  if (!visible || !setting.cookies_summary) {
    return null;
  }

  return (
    <View className="absolute bottom-0 left-0 right-0 sm:bottom-6 sm:left-6 sm:right-auto w-full sm:w-80 bg-white rounded-t-2xl sm:rounded-2xl shadow-lg p-4 z-50">
      <View className="flex-row items-center gap-2 mb-4">
        <MaterialIcons name="cookie" size={20} color="#333" />
        <Text className="font-bold text-lg">About Our Privacy</Text>
      </View>

      <Text className="text-sm mb-4 text-gray-800">
        {setting.cookies_summary}
      </Text>

      <View className="flex-row items-center gap-4 mb-3">
        <TouchableOpacity
          onPress={handleDecline}
          className="flex-1 h-10 rounded-r-lg sm:rounded-l-3xl sm:rounded-r-none border border-gray-300 items-center justify-center"
        >
          <Text className="font-bold text-gray-800">Decline</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleAccept}
          className="flex-1 h-10 rounded-l-lg sm:rounded-r-3xl sm:rounded-l-none bg-primary border border-primary items-center justify-center"
        >
          <Text className="font-bold text-white">Accept</Text>
        </TouchableOpacity>
      </View>

      {slug !== "not-found" &&
        <TouchableOpacity onPress={openCookiesSettings}>
          <Text className="text-sm text-primary underline">
            Cookies Settings
          </Text>
        </TouchableOpacity>}
    </View>
  );
};

export default CookiesConsent;
