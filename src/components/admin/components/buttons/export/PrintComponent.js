import React from "react";
import { TouchableOpacity, Text, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const PrintComponent = ({ content, fileName = "document" }) => {
  const handlePrint = async () => {
    try {
      // Generate a simple HTML document to print
      const html = `
                <html>
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            body { font-family: Arial; padding: 20px; }
                            h1 { color: #333; }
                        </style>
                    </head>
                    <body>
                        <h1>${fileName}</h1>
                        <div>${content}</div>
                    </body>
                </html>
            `;

      // Generate PDF
      const { uri } = await Print.printToFileAsync({ html });

      // Share the PDF (users can choose to print from share options)
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "print",
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      Alert.alert("Error", "print error");
      console.error("Printing failed:", error);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePrint}>
      <Icon name="print-outline" size={17} style={styles.icon} />
      <Text style={styles.text}>
        {"print"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = {
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
  },
};

export default PrintComponent;
