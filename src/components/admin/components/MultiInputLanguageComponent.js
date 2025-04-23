import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const MultiInputLanguageComponent = ({ props }) => {
  // Check if text is an array of language objects
  const isMultiLanguage = Array.isArray(props.text);

  return (
    <View style={styles.container}>
      {isMultiLanguage
        ? // Render multiple language inputs
          props.text.map((lang, index) =>
            <View key={index} style={styles.inputContainer}>
              <Text style={styles.label}>
                {lang.label} {lang.required && "*"}
              </Text>
              <TextInput
                style={styles.input}
                value={props.formPost[lang.name] || ""}
                onChangeText={text => {
                  props.formPost[lang.name] = text;
                }}
                placeholder={`Enter ${lang.label}`}
              />
            </View>
          )
        : // Render single input
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {props.text} *
            </Text>
            <TextInput
              style={styles.input}
              value={props.formPost[props.text.replaceAll(" ", "_")] || ""}
              onChangeText={text => {
                props.formPost[props.text.replaceAll(" ", "_")] = text;
              }}
              placeholder={`Enter ${props.text}`}
            />
          </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16
  },
  inputContainer: {
    marginBottom: 12
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#fff"
  }
});

export default MultiInputLanguageComponent;
