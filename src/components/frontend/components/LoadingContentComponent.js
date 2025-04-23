import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

const LoadingContentComponent = ({ 
  isActive = false, 
  color = '#F23E14',
  barCount = 5,
  barWidth = 6,
  barHeight = 30,
  barMargin = 3,
  animationDuration = 1000,
  animationDelay = 150
}) => {
  if (!isActive) return null;

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        {Array.from({ length: barCount }).map((_, index) => (
          <Animatable.View
            key={index}
            style={[
              styles.bar, 
              { 
                backgroundColor: color,
                width: barWidth,
                height: barHeight,
                marginHorizontal: barMargin,
                borderRadius: barWidth / 2
              }
            ]}
            animation="fadeIn"
            duration={animationDuration}
            iterationCount="infinite"
            iterationDelay={index * animationDelay}
            easing="ease-in-out"
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    // Default styles overridden by props
  },
});

export default LoadingContentComponent;