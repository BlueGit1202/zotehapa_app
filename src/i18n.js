import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization"; // Correct import

// Import language files
import en from "./languages/en.json";
import zh from "./languages/ch.json"; // Changed from "ch" to "zh" (standard language code)
import ar from "./languages/ar.json";
import tr from "./languages/tr.json";

const resources = {
  en: { translation: en },
  zh: { translation: zh }, // Use "zh" instead of "ch"
  ar: { translation: ar },
  tr: { translation: tr }
};

// Helper to find best language match
function findBestAvailableLanguage(supportedLanguages) {
  const deviceLocales = Localization.getLocales(); // Now using the imported Localization

  for (const locale of deviceLocales) {
    // 1. Check full language tag (e.g., "en-US")
    const fullMatch = supportedLanguages.find(
      lang => lang === locale.languageTag
    );
    if (fullMatch) return { languageTag: fullMatch };

    // 2. Check base language code (e.g., "en")
    const baseMatch = supportedLanguages.find(
      lang => lang === locale.languageCode
    );
    if (baseMatch) return { languageTag: baseMatch };

    // 3. Check without region (e.g., "zh" for "zh-Hans")
    const languageOnly = locale.languageCode.split("-")[0];
    const languageMatch = supportedLanguages.find(
      lang => lang === languageOnly
    );
    if (languageMatch) return { languageTag: languageMatch };
  }

  return { languageTag: "en" }; // Default to English
}

// Detect language
const { languageTag } = findBestAvailableLanguage(Object.keys(resources));

// Initialize i18n
i18n.use(initReactI18next).init({
  compatibilityJSON: "v3", // Required for React Native
  resources,
  lng: languageTag,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false // Safe in React Native
  }
});

export default i18n;
