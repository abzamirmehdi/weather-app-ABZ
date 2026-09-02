import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function App() {
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const titleY = useSharedValue(50);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);

  useEffect(() => {
    // انیمیشن لوگو (با افکت کشسانی)
    logoScale.value = withDelay(
      200,
      withTiming(1, { duration: 800, easing: Easing.elastic(1) })
    );
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));

    // انیمیشن عنوان (از پایین به بالا)
    titleY.value = withDelay(
      600,
      withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) })
    );
    titleOpacity.value = withDelay(600, withTiming(1, { duration: 700 }));

    // انیمیشن زیرنویس (fade in)
    subtitleOpacity.value = withDelay(1000, withTiming(1, { duration: 600 }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleY.value }],
    opacity: titleOpacity.value,
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1e3c72', '#2a5298', '#4a90e2']}
        style={styles.background}
      />
      <StatusBar style="light" />

      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Text style={styles.logoIcon}>☀️</Text>
      </Animated.View>

      <Animated.View style={[styles.titleContainer, titleStyle]}>
        <Text style={styles.title}>Weather App ABZ</Text>
      </Animated.View>

      <Animated.View style={[styles.subtitleContainer, subtitleStyle]}>
        <Text style={styles.subtitle}>پیش‌بینی دقیق و زیبای هوا</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    width: width,
    height: height,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoIcon: {
    fontSize: 100,
  },
  titleContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitleContainer: {},
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
});
