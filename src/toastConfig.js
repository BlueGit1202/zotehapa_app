import Toast from "react-native-toast-message";

export const toastConfig = {
  success: ({ text1, props, ...rest }) =>
    <View style={styles.successContainer}>
      <Icon name="check-circle" size={20} color="white" />
      <Text style={styles.successText}>
        {text1}
      </Text>
    </View>,
  error: ({ text1, props, ...rest }) =>
    <View style={styles.errorContainer}>
      <Icon name="times-circle" size={20} color="white" />
      <Text style={styles.errorText}>
        {text1}
      </Text>
    </View>
  // Add other toast types as needed
};

// Then in your App.js:
// <Toast config={toastConfig} />
