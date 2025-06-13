import { useState } from 'react';
import { movieAPI } from './movieAPI';
import {
  useQuery,
} from '@tanstack/react-query';

export function useProjects() {
  const [page, setPage] = useState(0);
  const [name, setName] = useState('');

  const queryInfo = useQuery({
    queryKey: ['movies', page, name],
    queryFn: () => movieAPI.get(page + 1, name),
    placeholderData: (previousData) => previousData,
  });
  return { ...queryInfo, page, setPage, name, setName };
}

