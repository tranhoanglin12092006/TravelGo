import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [savedFavorites, savedBookings] = await Promise.all([
        storageService.getFavorites(),
        storageService.getBookings(),
      ]);
      setFavorites(savedFavorites);
      setBookings(savedBookings);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = useCallback(async (destinationId) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(destinationId)
        ? prev.filter((id) => id !== destinationId)
        : [...prev, destinationId];
      storageService.saveFavorites(newFavorites);
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback(
    (destinationId) => favorites.includes(destinationId),
    [favorites]
  );

  const addBooking = useCallback(async (booking) => {
    setBookings((prev) => {
      const newBookings = [booking, ...prev];
      storageService.saveBookings(newBookings);
      return newBookings;
    });
  }, []);

  const cancelBooking = useCallback(async (bookingId) => {
    setBookings((prev) => {
      const newBookings = prev.map((b) =>
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      );
      storageService.saveBookings(newBookings);
      return newBookings;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        favorites,
        bookings,
        isLoading,
        toggleFavorite,
        isFavorite,
        addBooking,
        cancelBooking,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export default AppContext;
