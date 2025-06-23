import { HeartIcon, HeartFilledIcon } from "@radix-ui/react-icons";
import { Card, Inset } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Movie } from "./Movie";
import { useFavoriteActions } from "../favorites/favoritesHooks";
import authService from "../services/auth.service";

interface MovieProps {
  movie: Movie;
}

function MovieCard({ movie }: MovieProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToFavorites, removeFromFavorites, checkIsFavorite } = useFavoriteActions();
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/update-movie/${movie.id}`);
  };

  // Verificar si la película está en favoritos al cargar el componente
  useEffect(() => {
    if (!movie.id) return;
    setIsFavorite(checkIsFavorite(movie.id));
  }, [movie.id, checkIsFavorite]);

  const handleFavoriteClick = async () => {
    if (isLoading || !movie.id) return;

    const user = authService.getCurrentUser();
    if (!user) {
      alert("Please login to add favorites");
      return;
    }

    setIsLoading(true);
    
    try {
      if (isFavorite) {
        await removeFromFavorites(movie.id);
        setIsFavorite(false);
      } else {
        await addToFavorites(movie.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error updating favorite:", error);
      alert("Error updating favorite. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card size="2" className="!rounded-xs">
      <Inset clip="padding-box" side="top" pb="current">
        <img
          src="https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
          alt="Bold typography"
        />
      </Inset>
      <div className="p-3 ">
        <div className="w-full mb-15">
          <div className="w-full flex flex-row justify-between items-center">
            <p className="font-medium text-xl">{movie.title}</p>
            <button
              onClick={handleFavoriteClick}
              disabled={isLoading}
              className="p-1 hover:bg-slate-100 rounded-full transition-colors duration-200 disabled:opacity-50"
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? (
                <HeartFilledIcon className="text-red-500" width="20" height="20" />
              ) : (
                <HeartIcon className="text-slate-500 hover:text-red-400" width="20" height="20" />
              )}
            </button>
          </div>
          <p className="capitalize text-slate-600 font-medium">{movie.genre}</p>
        </div>
        <div className="w-full flex flex-row justify-between items-center">
          <p className="uppercase text-xs text-slate-400">Rank: {movie.rank}</p>
          <button
            onClick={handleViewDetails}
            className="text-sm text-slate-600 font-medium hover:text-slate-900 hover:underline transition-colors duration-200"
          >
            Edit Movie
          </button>
        </div>
      </div>
    </Card>
  );
}

export default MovieCard;
