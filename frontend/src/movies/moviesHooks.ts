import { useState, useEffect } from 'react';
import { movieAPI } from '../fetchs/movieAPI';
import {
  useQuery,
} from '@tanstack/react-query';

export function useMovies() {
  const [page, setPage] = useState(0);
  const [title, setTitle] = useState('');

  // Resetear página cuando cambia el término de búsqueda
  useEffect(() => {
    setPage(0);
  }, [title]);

  const queryInfo = useQuery({
    queryKey: ['movies', page, title],
    queryFn: () => movieAPI.get(page + 1, 9, title),
    placeholderData: (previousData) => previousData,
  });

  const movies = queryInfo.data || [];
  
  // Lógica de paginación basada en frontend
  const hasNextPage = movies.length === 9; // Si hay exactamente 9 películas, podría haber más
  const hasPrevPage = page > 0; // Si no estamos en la primera página

  return { 
    ...queryInfo, 
    movies,
    hasNextPage,
    hasPrevPage,
    page, 
    setPage, 
    title, 
    setTitle 
  };
}

