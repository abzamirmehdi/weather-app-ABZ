import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// انیمیشن خورشید
function SunAnimation() {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const sunStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={[styles.sunContainer, sunStyle]}>
      <View style={styles.sun}>
        {[...Array(8)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.sunRay,
              {
                transform: [{ rotate: `${i * 45}deg` }, { translateY: -60 }],
              },
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
}

// انیمیشن ابر
function CloudAnimation() {
  const translateX = useSharedValue(-100);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(width + 100, { duration: 15000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const cloudStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[styles.cloudContainer, cloudStyle]}>
      <View style={styles.cloud}>
        <View style={[styles.cloudPart, { width: 80, height: 80, left: 0 }]} />
        <View style={[styles.cloudPart, { width: 100, height: 100, left: 40 }]} />
        <View style={[styles.cloudPart, { width: 80, height: 80, left: 100 }]} />
      </View>
    </Animated.View>
  );
}

// انیمیشن باران
function RainAnimation() {
  const drops = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * width,
    delay: Math.random() * 2000,
    duration: 800 + Math.random() * 400,
  }));

  return (
    <View style={styles.rainContainer}>
      {drops.map((drop) => (
        <RainDrop key={drop.id} left={drop.left} delay={drop.delay} duration={drop.duration} />
      ))}
    </View>
  );
}

function RainDrop({ left, delay, duration }) {
  const translateY = useSharedValue(-50);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(height, { duration: duration, easing: Easing.linear }),
        withTiming(-50, { duration: 0 })
      ),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(1, { duration: duration - 400 }),
        withTiming(0, { duration: 200 })
      ),
      -1,
      false
    );
  }, []);

  const dropStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.rainDrop,
        dropStyle,
        { left: left, animationDelay: `${delay}ms` },
      ]}
    />
  );
}

// انیمیشن برف
function SnowAnimation() {
  const flakes = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: Math.random() * width,
    delay: Math.random() * 3000,
    duration: 3000 + Math.random() * 2000,
    size: 4 + Math.random() * 6,
  }));

  return (
    <View style={styles.snowContainer}>
      {flakes.map((flake) => (
        <SnowFlake
          key={flake.id}
          left={flake.left}
          delay={flake.delay}
          duration={flake.duration}
          size={flake.size}
        />
      ))}
    </View>
  );
}

function SnowFlake({ left, delay, duration, size }) {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(height, { duration: duration, easing: Easing.linear }),
        withTiming(-50, { duration: 0 })
      ),
      -1,
      false
    );
    translateX.value = withRepeat(
      withSequence(
        withTiming(30, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(-30, { duration: duration / 2, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(1, { duration: duration - 600 }),
        withTiming(0, { duration: 300 })
      ),
      -1,
      false
    );
  }, []);

  const flakeStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.snowFlake,
        flakeStyle,
        {
          left: left,
          width: size,
          height: size,
          animationDelay: `${delay}ms`,
        },
      ]}
    />
  );
}

// کامپوننت اصلی
export default function WeatherAnimation({ weatherCode }) {
  const isClear = weatherCode === 0;
  const isCloudy = weatherCode >= 1 && weatherCode <= 3;
  const isFoggy = weatherCode >= 45 && weatherCode <= 48;
  const isRainy = weatherCode >= 51 && weatherCode <= 67;
  const isSnowy = weatherCode >= 71 && weatherCode <= 77;
  const isStormy = weatherCode >= 95;

  return (
    <View style={styles.container}>
      {(isClear || isCloudy) && <SunAnimation />}
      {(isCloudy || isFoggy) && <CloudAnimation />}
      {isRainy && <RainAnimation />}
      {isSnowy && <SnowAnimation />}
      {isStormy && (
        <>
          <RainAnimation />
          <CloudAnimation />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: width,
    height: height,
    overflow: 'hidden',
  },
  sunContainer: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    left: width / 2 - 60,
  },
  sun: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunRay: {
    position: 'absolute',
    width: 4,
    height: 30,
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  cloudContainer: {
    position: 'absolute',
    top: 150,
  },
  cloud: {
    width: 180,
    height: 100,
    position: 'relative',
  },
  cloudPart: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 50,
    bottom: 0,
  },
  rainContainer: {
    position: 'absolute',
    width: width,
    height: height,
  },
  rainDrop: {
    position: 'absolute',
    width: 2,
    height: 20,
    backgroundColor: 'rgba(174, 194, 224, 0.6)',
    borderRadius: 1,
  },
  snowContainer: {
    position: 'absolute',
    width: width,
    height: height,
  },
  snowFlake: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});
