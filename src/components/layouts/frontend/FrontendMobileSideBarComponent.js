import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { changeLanguage } from "../../../store/actions/frontend/frontendLanguageActions";

const FrontendMobileSideBar = ({ isVisible, onClose }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Get data from Redux store
  const setting = useSelector(state => state.frontendSetting.lists);
  const language = useSelector(state => state.frontendLanguage.show);
  const languages = useSelector(state => state.frontendLanguage.lists);
  const pages = useSelector(state => state.frontendPage.lists);

  const [activeLanguageMenu, setActiveLanguageMenu] = useState(false);

  const handleLanguageChange = (id, code, display_mode) => {
    dispatch(changeLanguage(id, code, display_mode));
    setActiveLanguageMenu(false);
  };

  const handleNavigation = (routeName, params) => {
    navigation.navigate(routeName, params);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <View className="fixed inset-0 z-30 bg-black/50">
      <View className="w-full max-w-xs h-screen bg-white">
        {/* Header */}
        <View className="py-4 flex flex-row items-center justify-between px-4 border-b border-slate-100">
          <TouchableOpacity onPress={() => handleNavigation("Home")}>
            <Image
              source={{ uri: setting.theme_logo }}
              className="w-28 sm:w-32 h-10"
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text className="text-xl text-danger">×</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="px-3 pb-10">
          {/* Navigation Links */}
          <View className="flex flex-col">
            <TouchableOpacity
              onPress={() => handleNavigation("Home")}
              className="py-3 border-b border-slate-100"
            >
              <Text className="text-base font-medium capitalize text-heading">
                Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleNavigation("Offers")}
              className="py-3 border-b border-slate-100"
            >
              <Text className="text-base font-medium capitalize text-heading">
                Offers
              </Text>
            </TouchableOpacity>

            {pages.length > 0 &&
              pages.map(page =>
                <TouchableOpacity
                  key={page.id}
                  onPress={() => handleNavigation("Page", { slug: page.slug })}
                  className="py-3 border-b border-slate-100"
                >
                  <Text className="text-base font-medium capitalize text-heading">
                    {page.title}
                  </Text>
                </TouchableOpacity>
              )}
          </View>

          {/* Language Selector */}
          {setting.site_language_switch === "enable" &&
            <View className="mt-4">
              <TouchableOpacity
                className="flex flex-row items-center justify-between py-3 w-full border-b border-slate-100"
                onPress={() => setActiveLanguageMenu(!activeLanguageMenu)}
              >
                <View className="flex flex-row items-center gap-2">
                  <Image
                    source={{ uri: language.image }}
                    className="w-4 h-4 rounded-full"
                  />
                  <Text className="font-medium capitalize text-heading">
                    {language.name}
                  </Text>
                </View>
                <Text className="text-sm font-bold">
                  {activeLanguageMenu ? "↑" : "↓"}
                </Text>
              </TouchableOpacity>

              {activeLanguageMenu &&
                <View className="w-full flex flex-col gap-2 mb-3">
                  {languages.map(lang =>
                    <TouchableOpacity
                      key={lang.id}
                      onPress={() =>
                        handleLanguageChange(
                          lang.id,
                          lang.code,
                          lang.display_mode
                        )}
                      className="flex flex-row items-center gap-3 px-2.5 py-2 rounded-lg bg-slate-100"
                    >
                      <Image source={{ uri: lang.image }} className="w-4 h-4" />
                      <Text className="text-sm font-medium capitalize text-heading">
                        {lang.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>}
            </View>}

          {/* Contact Information */}
          <Text className="text-base font-bold capitalize mb-3 text-heading">
            Contact
          </Text>
          <View className="flex flex-col gap-5 mb-4">
            <View className="flex flex-row gap-3">
              <Text className="text-sm text-heading">📍</Text>
              <Text className="text-sm font-medium text-heading">
                {setting.company_address}
              </Text>
            </View>
            <View className="flex flex-row gap-3">
              <Text className="text-sm text-heading">✉️</Text>
              <Text className="text-sm font-medium text-heading">
                {setting.company_email}
              </Text>
            </View>
            <View className="flex flex-row gap-3">
              <Text className="text-sm text-heading">📞</Text>
              <Text className="text-sm font-medium text-heading">
                {setting.company_phone}
              </Text>
            </View>
          </View>

          {/* Social Media */}
          <Text className="text-base font-bold capitalize mt-3 mb-3 text-heading">
            Follow Us
          </Text>
          <View className="flex flex-row flex-wrap items-center gap-6 mb-7">
            {setting.social_media_facebook &&
              <TouchableOpacity
                onPress={() => Linking.openURL(setting.social_media_facebook)}
              >
                <Text className="w-7 h-7 leading-7 text-center rounded-full text-sm text-heading bg-slate-200">
                  f
                </Text>
              </TouchableOpacity>}
            {setting.social_media_tiktok &&
              <TouchableOpacity
                onPress={() => Linking.openURL(setting.social_media_tiktok)}
              >
                <Text className="w-7 h-7 leading-7 text-center rounded-full text-sm text-heading bg-slate-200">
                  t
                </Text>
              </TouchableOpacity>}
            {setting.social_media_twitter &&
              <TouchableOpacity
                onPress={() => Linking.openURL(setting.social_media_twitter)}
              >
                <Text className="w-7 h-7 leading-7 text-center rounded-full text-sm text-heading bg-slate-200">
                  t
                </Text>
              </TouchableOpacity>}
            {setting.social_media_instagram &&
              <TouchableOpacity
                onPress={() => Linking.openURL(setting.social_media_instagram)}
              >
                <Text className="w-7 h-7 leading-7 text-center rounded-full text-sm text-heading bg-slate-200">
                  i
                </Text>
              </TouchableOpacity>}
            {setting.social_media_youtube &&
              <TouchableOpacity
                onPress={() => Linking.openURL(setting.social_media_youtube)}
              >
                <Text className="w-7 h-7 leading-7 text-center rounded-full text-sm text-heading bg-slate-200">
                  y
                </Text>
              </TouchableOpacity>}
          </View>

          {/* Copyright */}
          <Text className="text-xs font-medium text-heading">
            {setting.site_copyright}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

export default FrontendMobileSideBar;
