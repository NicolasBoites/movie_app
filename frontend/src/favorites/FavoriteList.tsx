import { Favorite } from "./Favorite";
import FavoriteCard from "./FavoriteCard";

interface FavoriteListProps {
  favorites: Favorite[];
}

function FavoriteList({ favorites }: FavoriteListProps) {

  return (
    <div className="flex flex-col space-y-5 my-12">
      {favorites.map((favorite) => (
        <div className="w-full" key={favorite.id}>
          <FavoriteCard favorite={favorite} />
        </div>
      ))}
    </div>
  );
}

export default FavoriteList;
