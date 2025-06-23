import {
  DotFilledIcon,
  HeartFilledIcon,
} from "@radix-ui/react-icons";
import { Card, Box, Text, Flex } from "@radix-ui/themes";
import { useState } from "react";
import { Favorite } from "./Favorite";
import { useFavoriteActions } from "./favoritesHooks";
import authService from "../services/auth.service";

interface FavoriteProps {
  favorite: Favorite;
  onRemove?: () => void; // Callback para actualizar la lista cuando se remueve
}

function FavoriteCard({ favorite, onRemove }: FavoriteProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { removeFromFavorites } = useFavoriteActions();

  const handleRemoveFromFavorites = async () => {
    if (isLoading || !favorite.id) return;

    const user = authService.getCurrentUser();
    if (!user) {
      alert("Please login to manage favorites");
      return;
    }

    setIsLoading(true);
    
    try {
      await removeFromFavorites(favorite.id);
      // Llamar callback para actualizar la lista
      if (onRemove) {
        onRemove();
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
      alert("Error removing from favorites. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card size="2" className="!rounded-none !p-6">
      <Flex gap="3" align="center" justify="between">
        <Box>
          <Flex>
            <img
              className="!w-16 !h-16"
              src="https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
              alt="Bold typography"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                borderRadius: "var(--radius-2)",
              }}
            />
            <Box className="mx-5">
              <Text as="div" size="5" weight="bold">
                {favorite.title}
              </Text>
              <Flex align="center" className="mt-3 !space-x-2">
                <Text
                  as="div"
                  size="3"
                  className="font-medium !text-slate-500 "
                >
                  Rank: #{favorite.rank}
                </Text>
                <DotFilledIcon color="gray" />
                <Text
                  as="div"
                  size="3"
                  className="font-medium !text-slate-500 capitalize"
                >
                  {favorite.genre}
                </Text>
              </Flex>
              
            </Box>
          </Flex>
        </Box>
        <Box>
          <button
            onClick={handleRemoveFromFavorites}
            disabled={isLoading}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors duration-200 disabled:opacity-50"
            title="Remove from favorites"
          >
            <HeartFilledIcon 
              className={`w-6 h-6 ${isLoading ? 'text-slate-300' : 'text-red-500 hover:text-red-600'}`} 
            />
          </button>
        </Box>
      </Flex>
    </Card>
  );
}

export default FavoriteCard;
