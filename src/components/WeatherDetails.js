import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

export default function WeatherDetails({ weather }) {
  const animations = Array.from({ length: 4 }, () => useSharedValue(0));

  useEffect(() => {
    animations.forEach((anim, index) => {
      anim.value = withDelay(
        index * 150,
        withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
      );
    });
  }, [weather]);

  if (!weather) return null;

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const details = [
    {
      icon: '💧',
      label: 'رطوبت',
      value: `${weather.humidity}%`,
    },
    {
      icon: '💨',
      label: 'سرعت باد',
      value: `${weather.windSpeed} km/h`,
    },
    {
      icon: '🌡️',
      label: 'فشار هوا',
      value: `${weather.pressure} hPa`,
    },
    {
      icon: '🌅',
      label: 'طلوع/غروب',
      value: `${formatTime(weather.daily.sunrise[0])} / ${formatTime(weather.daily.sunset[0])}`,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>جزئیات هوا</Text>
      <View style={styles.grid}>
        {details.map((detail, index) => {
          const cardStyle = useAnimatedStyle(() => ({
            opacity: animations[index].value,
            transform: [
              { scale: 0.8 + animations[index].value * 0.2 },
              { translateY: (1 - animations[index].value) * 20 },
            ],
          }));

          return (
            <Animated.View key={index} style={[styles.card, cardStyle]}>
              <Text style={styles.cardIcon}>{detail.icon}</Text>
              <Text style={styles.cardLabel}>{detail.label}</Text>
              <Text style={styles.cardValue}>{detail.value}</Text>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  cardIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
