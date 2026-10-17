import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import destinations from '../data/destinations.json';

export const useFavorites = () => {
  const { favorites, toggleFavorite, isFavorite } = useAppContext();

  const favoriteDestinations = useMemo(() => {
    return destinations.filter((d) => favorites.includes(d.id));
  }, [favorites]);

  return {
    favorites,
    favoriteDestinations,
    toggleFavorite,
    isFavorite,
    count: favorites.length,
  };
};
