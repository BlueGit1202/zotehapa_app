import Toast from "react-native-toast-message";

export default {
  default: (message = "Default", position = "top") => {
    Toast.show({
      type: "default",
      text1: message,
      position: position
    });
  },

  success: (message = "Success", position = "top") => {
    Toast.show({
      type: "success",
      text1: message,
      position: position
    });
  },

  info: (message = "Info", position = "top") => {
    Toast.show({
      type: "info",
      text1: message,
      position: position
    });
  },

  warning: (message = "Warning", position = "top") => {
    Toast.show({
      type: "error", // Using error type for warning as react-native-toast-message doesn't have warning
      text1: message,
      position: position,
      props: {
        style: tw`bg-yellow-500`
      }
    });
  },

  error: (message = "Error", position = "top") => {
    Toast.show({
      type: "error",
      text1: message,
      position: position
    });
  },

  successFlip: (status = null, message = "", position = "top") => {
    if (status != null) {
      if (status) {
        message = message + " Updated Successfully.";
      } else {
        message = message + " Created Successfully.";
      }
    } else {
      message = message + " Deleted Successfully.";
    }

    Toast.show({
      type: "success",
      text1: message,
      position: position
    });
  },

  successInfo: (status = null, message = "", position = "top") => {
    Toast.show({
      type: "success",
      text1: message,
      position: position
    });
  }
};
