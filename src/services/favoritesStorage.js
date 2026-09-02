import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@weather_favorites';

export async function getFavorites() {
  try {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('خطا در خواندن علاقه‌مندی‌ها:', e);
    return [];
  }
}

export async function saveFavorite(city) {
  try {
    const favorites = await getFavorites();
    const exists = favorites.find(f => f.id === city.id);
    
    if (!exists) {
      favorites.push(city);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
    
    return favorites;
  } catch (e) {
    console.error('خطا در ذخیره علاقه‌مندی:', e);
    return [];
  }
}

export async function removeFavorite(cityId) {
  try {
    const favorites = await getFavorites();
    const updated = favorites.filter(f => f.id !== cityId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('خطا در حذف علاقه‌مندی:', e);
    return [];
  }
      }
