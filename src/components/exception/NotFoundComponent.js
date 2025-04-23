import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const NotFoundComponent = () => {
  const navigation = useNavigation();
  const setting = useSelector(state => state.frontendSetting.lists);

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.errorCode}>{"404"}</Text>
            <Text style={styles.errorTitle}>{"message.page not found"}</Text>
            <Text style={styles.errorMessage}>
              {"we can not seem"}
            </Text>
            <TouchableOpacity style={styles.button} onPress={goBack}>
              <Text style={styles.buttonText}>{"Go back"}</Text>
            </TouchableOpacity>
          </View>

          {/* Image Container */}
          <View style={styles.imageContainer}>
            {setting?.image_404 && (
              <Image 
                source={{ uri: setting.image_404 }} 
                style={styles.image}
                resizeMode="contain"
              />
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 24,
  },
  contentWrapper: {
    maxWidth: '100%',
    width: '100%',
    paddingHorizontal: 16,
  },
  contentContainer: {
    maxWidth: 672, // Equivalent to max-w-3xl (3 * 224px)
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'column-reverse', // Default mobile layout
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
    // For RTL/LTR text alignment
    /* @noflip */ textAlign: 'left', // Default for LTR
  },
  errorCode: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  errorMessage: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 24,
    maxWidth: 290,
    textAlign: 'center',
    lineHeight: 24,
    color: '#6B7280', // text-paragraph color
  },
  button: {
    backgroundColor: '#3B82F6', // bg-primary color
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 9999, // Fully rounded
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 40,
  },
  image: {
    width: '100%',
    height: 300,
  },
});

// For responsive layout on tablets
const tabletStyles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row', // Side by side on larger screens
    gap: 64,
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-start', // Align left for LTR
  },
  errorMessage: {
    textAlign: 'left', // Align left for LTR
  },
  imageContainer: {
    flex: 1,
    marginTop: 0,
  },
});

export default NotFoundComponent;