import { useState } from 'react';
import { favoriteAPI } from '../fetchs/favoriteAPI';
import {
  useQuery,
} from '@tanstack/react-query';

export function useFavorites() {
  const [page, setPage] = useState(0);
  const [title, setTitle] = useState('');

  const queryInfo = useQuery({
    queryKey: ['favorites', page, title],
    queryFn: () => favoriteAPI.get(page + 1, title),
    placeholderData: (previousData) => previousData,
  });
  return { ...queryInfo, page, setPage, title, setTitle };
}

