import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const ExceptionComponent = () => {
  const navigation = useNavigation();
  const setting = useSelector(state => state.frontendSetting.lists);

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.errorCode}>{"403"}</Text>
          <Text style={styles.errorTitle}>{"Access denied"}</Text>
          <Text style={styles.errorMessage}>
            {"You try to access"}
          </Text>
          <TouchableOpacity style={styles.button} onPress={goBack}>
            <Text style={styles.buttonText}>{"Go back"}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          {setting?.image_403 && (
            <Image 
              source={{ uri: setting.image_403 }} 
              style={styles.image}
              resizeMode="contain"
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = {
  container: {
    paddingTop: 24,
    paddingBottom: 96,
    flexGrow: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    maxWidth: '80%',
    alignSelf: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
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
    color: '#6B7280', // Equivalent to text-paragraph
  },
  button: {
    backgroundColor: '#3B82F6', // Equivalent to bg-primary
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 9999, // Full rounded
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
  },
};

export default ExceptionComponent;