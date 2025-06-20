import { Favorite } from "./Favorite";
import FavoriteCard from "./FavoriteCard";

interface FavoriteListProps {
  favorites: Favorite[];
  onRefresh?: () => void; // Callback para refrescar la lista
}

function FavoriteList({ favorites, onRefresh }: FavoriteListProps) {
  const handleRemoveFavorite = () => {
    // Refrescar la lista después de remover
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="flex flex-col space-y-5 my-12">
      {favorites.map((favorite) => (
        <div className="w-full" key={favorite.id}>
          <FavoriteCard 
            favorite={favorite} 
            onRemove={handleRemoveFavorite}
          />
        </div>
      ))}
    </div>
  );
}

export default FavoriteList;
