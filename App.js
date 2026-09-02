import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { fetchWeather, getWeatherInfo } from './src/services/weatherApi';
import WeatherAnimation from './src/components/WeatherAnimation';
import DailyForecast from './src/components/DailyForecast';
import WeatherDetails from './src/components/WeatherDetails';
import CitySearch from './src/components/CitySearch';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const tempScale = useSharedValue(0);
  const tempOpacity = useSharedValue(0);

  useEffect(() => {
    loadWeather();
  }, []);

  useEffect(() => {
    if (weather) {
      tempScale.value = withDelay(200, withTiming(1, { duration: 600, easing: Easing.elastic(1) }));
      tempOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));
    }
  }, [weather]);

  const tempStyle = useAnimatedStyle(() => ({
    transform: [{ scale: tempScale.value }],
    opacity: tempOpacity.value,
  }));

  async function loadWeather(city = null) {
    try {
      let latitude, longitude;
      
      if (city) {
        latitude = city.latitude;
        longitude = city.longitude;
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('لطفاً دسترسی موقعیت مکانی را فعال کنید');
          setLoading(false);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
        latitude = loc.coords.latitude;
        longitude = loc.coords.longitude;
      }
      
      const data = await fetchWeather(latitude, longitude);
      setWeather(data);
    } catch (e) {
      setError('خطا در دریافت اطلاعات هوا');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <LinearGradient colors={['#1e3c72', '#2a5298', '#4a90e2']} style={styles.bg} />
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>در حال دریافت اطلاعات...</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <LinearGradient colors={['#1e3c72', '#2a5298', '#4a90e2']} style={styles.bg} />
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  const info = getWeatherInfo(weather.weatherCode);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1e3c72', '#2a5298', '#4a90e2']} style={styles.bg} />
      
      <WeatherAnimation weatherCode={weather.weatherCode} />
      
      <StatusBar style="light" />

      <CitySearch onCitySelect={(city) => {
        setSelectedCity(city);
        setLoading(true);
        loadWeather(city);
      }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.icon}>{info.icon}</Text>

        <Animated.View style={[tempStyle]}>
          <Text style={styles.temp}>{weather.temperature}°</Text>
        </Animated.View>

        <Text style={styles.label}>{info.label}</Text>
        
        {selectedCity && <Text style={styles.cityName}>{selectedCity.name}</Text>}
        
        <Text style={styles.details}>💧 {weather.humidity}% | 💨 {weather.windSpeed} km/h</Text>

        <WeatherDetails weather={weather} />

        <DailyForecast daily={weather.daily} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bg: { position: 'absolute', width, height },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  icon: { fontSize: 80, marginBottom: 10, zIndex: 10 },
  temp: { fontSize: 72, fontWeight: 'bold', color: '#fff', zIndex: 10 },
  label: { fontSize: 24, color: 'rgba(255,255,255,0.9)', marginTop: 5, zIndex: 10 },
  cityName: {
    fontSize: 20,
    color: '#fff',
    marginTop: 10,
    fontWeight: '600',
    zIndex: 10,
  },
  details: { fontSize: 16, color: 'rgba(255,255,255,0.7)', marginTop: 15, zIndex: 10 },
  loadingText: { color: '#fff', marginTop: 15, fontSize: 16 },
  errorText: { color: '#ff6b6b', fontSize: 18, textAlign: 'center', paddingHorizontal: 30 },
});
