import * as Font from "expo-font";

export const loadFonts = async () => {
  await Font.loadAsync({
    "Urbanist-Regular": require("../assets/fonts/Urbanist-Regular.ttf"),
    "Urbanist-Bold": require("../assets/fonts/Urbanist-Bold.ttf"),
    Iconly: require("../assets/fonts/Iconly.ttf"),
    FontAwesome: require("../assets/fonts/FontAwesome.ttf")
    // Add other font weights and styles as needed
  });
};
