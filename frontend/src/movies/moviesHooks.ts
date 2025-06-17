import { useState } from 'react';
import { movieAPI } from '../fetchs/movieAPI';
import {
  useQuery,
} from '@tanstack/react-query';

export function useMovies() {
  const [page, setPage] = useState(0);
  const [title, setTitle] = useState('');

  const queryInfo = useQuery({
    queryKey: ['movies', page, title],
    queryFn: () => movieAPI.get(page + 1, title),
    placeholderData: (previousData) => previousData,
  });
  return { ...queryInfo, page, setPage, title, setTitle };
}

