import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const PrintButtonComponent = ({ buttonStyle = {}, content }) => {
  const handlePrint = async () => {
    try {
      // 1. Generate HTML content (you can customize this based on your needs)
      const html = `
        <html>
          <head>
            <style>
              body { font-family: Arial; padding: 20px; }
              h1 { color: #333; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>Print Document</h1>
            ${content || "<p>Your printable content goes here</p>"}
          </body>
        </html>
      `;

      // 2. Generate PDF from HTML
      const { uri } = await Print.printToFileAsync({ html });

      // 3. Share the PDF file (this will open the native share dialog)
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Print Document",
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      console.error("Error printing:", error);
      alert("Failed to print. Please try again.");
    }
  };

  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 4,
          backgroundColor: "#3b82f6",
        },
        buttonStyle,
      ]}
      onPress={handlePrint}
    >
      <MaterialIcons name="print" size={16} color="white" />
      <Text style={{ color: "white", marginLeft: 8 }}>Print</Text>
    </TouchableOpacity>
  );
};

export default PrintButtonComponent;
