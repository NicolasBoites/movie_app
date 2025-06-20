import { useState, useEffect } from 'react';
import { favoriteAPI } from '../fetchs/favoriteAPI';
import authService from '../services/auth.service';
import {
  useQuery,
} from '@tanstack/react-query';

export function useFavorites() {
  const [page, setPage] = useState(0);
  const [title, setTitle] = useState('');
  const [allFavorites, setAllFavorites] = useState<any[]>([]);

  // Obtener el userId del usuario actual
  const getCurrentUserId = () => {
    const user = authService.getCurrentUser();
    return user?.id || user?._id || null;
  };

  const userId = getCurrentUserId();

  // Resetear página y favoritos acumulados cuando cambia el término de búsqueda
  useEffect(() => {
    setPage(0);
    setAllFavorites([]);
  }, [title]);

  const queryInfo = useQuery({
    queryKey: ['favorites', userId, page, title],
    queryFn: () => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      return favoriteAPI.getFavoriteMovies(userId, page + 1, 9, title);
    },
    enabled: !!userId, // Solo ejecutar si hay userId
    placeholderData: (previousData) => previousData,
  });

  const currentPageFavorites = queryInfo.data || [];
  
  // Acumular favoritos cuando se carga una nueva página
  useEffect(() => {
    if (currentPageFavorites.length > 0) {
      if (page === 0) {
        // Primera página: reemplazar todos los favoritos
        setAllFavorites(currentPageFavorites);
      } else {
        // Páginas siguientes: agregar a los existentes
        setAllFavorites(prev => {
          // Evitar duplicados por si acaso
          const newFavorites = currentPageFavorites.filter(
            (newFav: any) => !prev.some((existingFav: any) => existingFav.id === newFav.id)
          );
          return [...prev, ...newFavorites];
        });
      }
    }
  }, [currentPageFavorites, page]);

  // Lógica de paginación basada en frontend
  const hasNextPage = currentPageFavorites.length === 9; // Si hay exactamente 9 películas, podría haber más
  const hasPrevPage = page > 0; // Si no estamos en la primera página

  const refetchFavorites = () => {
    queryInfo.refetch();
    setPage(0);
    setAllFavorites([]);
  };

  return { 
    ...queryInfo, 
    favorites: allFavorites,
    hasNextPage,
    hasPrevPage,
    page, 
    setPage, 
    title, 
    setTitle,
    userId,
    refetchFavorites
  };
}

// Hook para agregar/remover favoritos
export function useFavoriteActions() {
  const getCurrentUserId = () => {
    const user = authService.getCurrentUser();
    return user?.id || user?._id || null;
  };

  const addToFavorites = async (movieId: string) => {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return favoriteAPI.addToFavorites(userId, movieId);
  };

  const removeFromFavorites = async (movieId: string) => {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return favoriteAPI.removeFromFavorites(userId, movieId);
  };

  const checkIsFavorite = async (movieId: string) => {
    const userId = getCurrentUserId();
    if (!userId) {
      return false;
    }
    return favoriteAPI.isFavorite(userId, movieId);
  };

  return {
    addToFavorites,
    removeFromFavorites,
    checkIsFavorite,
  };
}

