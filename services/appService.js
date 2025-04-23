import { Alert } from "react-native";
import tw from "tailwind-react-native-classnames";

export default {
  phoneNumber: text => {
    return /^[+]?[0-9]*$/.test(text);
  },

  onlyNumber: text => {
    return /^[0-9]*$/.test(text);
  },

  floatNumber: text => {
    return /^[.]?[0-9]*$/.test(text);
  },

  currencyFormat: (amount, decimal, currency, position) => {
    if (position === "left") {
      return currency + parseFloat(amount).toFixed(decimal);
    } else {
      return parseFloat(amount).toFixed(decimal) + currency;
    }
  },

  floatFormat: (amount, decimal = 2) => {
    return parseFloat(amount).toFixed(decimal);
  },

  textShortener: (text, number = 30) => {
    if (text) {
      if (!(text.length < number)) {
        return text.substring(0, number) + "..";
      }
    }
    return text;
  },

  htmlTagRemover: text => {
    if (text != null && text !== "" && isNaN(text)) {
      return text.replace(/(<([^>]+)>)/gi, "");
    }
    return text;
  },

  statusClass: status => {
    if (status === "active") {
      return tw`text-green-600 bg-green-100`;
    } else {
      return tw`text-red-600 bg-red-100`;
    }
  },

  askClass: ask => {
    if (ask === "yes") {
      return tw`text-green-600 bg-green-100`;
    } else {
      return tw`text-red-600 bg-red-100`;
    }
  },

  requestHandler: requests => {
    let i = 1;
    let response = "";

    for (let request in requests) {
      if (requests[request] !== "" && requests[request] !== null) {
        if (i !== 1) {
          response += "&";
        }
        response += request + "=" + requests[request];
      }
      i++;
    }

    if (response) {
      response = "?" + response;
    }

    return response;
  },

  taxTypeClass: type => {
    if (type === "fixed") {
      return tw`text-blue-500 bg-blue-100`;
    } else {
      return tw`text-orange-500 bg-orange-100`;
    }
  },

  underscoreToSpace: str => {
    return str.replace(/_/g, " ");
  },

  decimalPoint: (num, length = 2) => {
    return Number.parseFloat(num).toFixed(length);
  },

  orderStatusClass: status => {
    if (status === "pending") {
      return tw`bg-amber-100 text-amber-500`;
    } else if (status === "confirmed") {
      return tw`bg-indigo-100 text-indigo-500`;
    } else if (status === "on_the_way") {
      return tw`bg-cyan-100 text-cyan-500`;
    } else if (status === "delivered") {
      return tw`bg-green-100 text-green-500`;
    } else if (status === "canceled") {
      return tw`bg-red-100 text-red-500`;
    } else {
      return tw`bg-red-100 text-red-500`;
    }
  },

  purchasePaymentStatusClass: status => {
    if (status === "pending") {
      return tw`bg-amber-100 text-amber-500`;
    } else if (status === "partial_paid") {
      return tw`bg-indigo-100 text-indigo-500`;
    } else if (status === "fully_paid") {
      return tw`bg-green-100 text-green-500`;
    }
  },

  purchaseStatusClass: status => {
    if (status === "pending") {
      return tw`bg-amber-100 text-amber-500`;
    } else if (status === "ordered") {
      return tw`bg-indigo-100 text-indigo-500`;
    } else if (status === "received") {
      return tw`bg-green-100 text-green-500`;
    }
  },

  returnStatusClass: status => {
    if (status === "pending") {
      return tw`text-yellow-500`;
    } else if (status === "accept") {
      return tw`text-green-500`;
    } else {
      return tw`text-red-500`;
    }
  },

  destroyConfirmation: () => {
    return new Promise(resolve => {
      Alert.alert(
        "Are you sure?",
        "You will not be able to recover the deleted record!",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => resolve(false),
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => resolve(true),
          },
        ]
      );
    });
  },

  cancelOrder: () => {
    return new Promise(resolve => {
      Alert.alert("Are you sure?", "You want to cancel your order?", [
        {
          text: "No",
          style: "cancel",
          onPress: () => resolve(false),
        },
        {
          text: "Yes, Cancel it",
          style: "destructive",
          onPress: () => resolve(true),
        },
      ]);
    });
  },

  acceptOrder: () => {
    return new Promise(resolve => {
      Alert.alert(
        "Are you sure?",
        "You will not be able to cancel the order!",
        [
          {
            text: "No",
            style: "cancel",
            onPress: () => resolve(false),
          },
          {
            text: "Yes, Accept it",
            onPress: () => resolve(true),
          },
        ]
      );
    });
  },
};
