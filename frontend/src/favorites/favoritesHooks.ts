import { useState, useEffect } from 'react';
import { favoriteAPI } from '../fetchs/favoriteAPI';
import {
  useQuery,
} from '@tanstack/react-query';

export function useFavorites() {
  const [page, setPage] = useState(0);
  const [title, setTitle] = useState('');
  const [allFavorites, setAllFavorites] = useState<any[]>([]);

  // Resetear página y favoritos acumulados cuando cambia el término de búsqueda
  useEffect(() => {
    setPage(0);
    setAllFavorites([]);
  }, [title]);

  const queryInfo = useQuery({
    queryKey: ['favorites', page, title],
    queryFn: () => favoriteAPI.get(page + 1, 9, title),
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

  return { 
    ...queryInfo, 
    favorites: allFavorites,
    hasNextPage,
    hasPrevPage,
    page, 
    setPage, 
    title, 
    setTitle 
  };
}

