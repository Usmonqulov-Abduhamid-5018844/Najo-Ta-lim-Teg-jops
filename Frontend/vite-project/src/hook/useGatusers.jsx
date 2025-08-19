import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/';

export const movieKey = 'user';

export const useMovie = () => {
  const client = useQueryClient();

  const getMovies = useQuery({
    queryKey: [movieKey],
    queryFn: () =>
      api.get("/users").then((res) => res.data),
  });

  const getMovieById = (id) =>
    useQuery({
      queryKey: [movieKey, id],
      queryFn: () => api.get(`/users/${id}`).then((res) => res.data),
    });

  const deleteUsers = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`).then((res) => res.data),
    onSuccess: () => {
      client.invalidateQueries([movieKey]);
    },
  });

  return { getMovies, getMovieById, deleteUsers };
};
