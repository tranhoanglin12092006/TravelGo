import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  FAVORITES: '@travelgo_favorites',
  BOOKINGS: '@travelgo_bookings',
};

export const storageService = {
  // Favorites
  async getFavorites() {
    try {
      const data = await AsyncStorage.getItem(KEYS.FAVORITES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch (error) {
      console.error('Error reading favorites:', error);
      return [];
    }
  },

  async saveFavorites(favorites) {
    try {
      if (!Array.isArray(favorites)) return false;
      await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
      return true;
    } catch (error) {
      console.error('Error saving favorites:', error);
      return false;
    }
  },

  // Bookings
  async getBookings() {
    try {
      const data = await AsyncStorage.getItem(KEYS.BOOKINGS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch (error) {
      console.error('Error reading bookings:', error);
      return [];
    }
  },

  async saveBookings(bookings) {
    try {
      if (!Array.isArray(bookings)) return false;
      await AsyncStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
      return true;
    } catch (error) {
      console.error('Error saving bookings:', error);
      return false;
    }
  },

  async addBooking(booking) {
    try {
      const bookings = await this.getBookings();
      bookings.unshift(booking);
      await this.saveBookings(bookings);
      return true;
    } catch (error) {
      console.error('Error adding booking:', error);
      return false;
    }
  },

  async updateBooking(bookingId, updates) {
    try {
      const bookings = await this.getBookings();
      const index = bookings.findIndex((b) => b.id === bookingId);
      if (index === -1) return false;
      bookings[index] = { ...bookings[index], ...updates };
      await this.saveBookings(bookings);
      return true;
    } catch (error) {
      console.error('Error updating booking:', error);
      return false;
    }
  },

  // Clear all
  async clearAll() {
    try {
      await AsyncStorage.multiRemove([KEYS.FAVORITES, KEYS.BOOKINGS]);
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  },
};
