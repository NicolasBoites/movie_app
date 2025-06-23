import {
  HeartFilledIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import {
  Container,
  Flex,
  Skeleton,
  Text,
} from "@radix-ui/themes";
import { useRef } from "react";
import FavoriteList from "../favorites/FavoriteList";
import { useFavorites } from "./favoritesHooks";

function FavoritesPage() {
  const {
    isPending,
    error,
    isError,
    isFetching,
    favorites,
    setTitle,
    hasNextPage,
    page,
    setPage,
    refetchFavorites
  } = useFavorites();

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounce = (query: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current); // limpia el timeout anterior
    }

    debounceTimeout.current = setTimeout(() => {
      setTitle(query.trim());
    }, 800);
  };

  // Función para cargar más (siguiente página)
  const handleLoadMore = () => {
    setPage(page + 1);
  };

  // Calcular valores para mostrar
  const totalFavoritesShown = favorites.length; // Total de favoritos cargados hasta ahora
  const currentPageItems = favorites.length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-row items-center justify-between mb-12">
        <div>
          <h2 className="text-slate-800 text-4xl font-medium my-4">
            Favorites Collection
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            Your curated collection of favorite films
          </p>
        </div>
      </div>

      {/* Search bar 
      
      <div className="relative flex items-center h-12 border-0 border-b border-slate-300">
        <input
          onChange={(e: any) => debounce(e.target.value)}
          placeholder="Search movies by title..."
          className="w-full text-xl text-slate-500 font-medium border-0 ring-0 outline-0 bg-transparent"
        />
        <MagnifyingGlassIcon height="22" width="22" className="text-slate-500" />
      </div>
*/}
      {isFetching && !isPending ? (
        // Loading Message
        <>
          <Skeleton className="!h-14"></Skeleton>

          <div className="grid grid-cols-3 gap-8 my-10">
            {[1, 2, 3].map((_, index) => (
              <Container size="1" key={index}>
                <Flex direction="column" gap="2">
                  <Skeleton className="!h-64"></Skeleton>

                  <Flex justify="between">
                    <Text>
                      <Skeleton>Favorite Title Favorite Title</Skeleton>
                    </Text>
                    <Text>
                      <Skeleton>Heart </Skeleton>
                    </Text>
                  </Flex>

                  <Text>
                    <Skeleton>Genre Genre</Skeleton>
                  </Text>

                  <Flex justify="between">
                    <Text>
                      <Skeleton>Rank</Skeleton>
                    </Text>
                    <Text>
                      <Skeleton>View Details</Skeleton>
                    </Text>
                  </Flex>
                </Flex>
              </Container>
            ))}
          </div>
        </>
      ) : isError && error instanceof Error ? (
        // Error Message
        <div className="row">
          <div className="card large error">
            <section>
              <p>
                <span className="icon-alert inverse "></span>
                {error.message}
              </p>
            </section>
          </div>
        </div>
      ) : favorites && favorites.length > 0 ? (
        // Mostrar favoritos cuando hay datos
        <>

          {/* {isFetching && !isPending && <div>Loading...</div>} */}

          {/* Favorites */}
          <FavoriteList favorites={favorites} onRefresh={refetchFavorites} />

          {/* Load More Section */}
          {currentPageItems > 0 && (
            <div className="border border-slate-300 py-8 flex justify-center items-center w-full gap-2">
              <HeartFilledIcon className="text-slate-400" />
              <Text className="text-slate-400 font-medium">
                Showing {totalFavoritesShown} favorite movies
                {hasNextPage ? " (more available)" : ""}
              </Text>
              {hasNextPage && (
                <Text
                  as="div"
                  onClick={handleLoadMore}
                  className="text-slate-900 font-medium cursor-pointer hover:underline ml-2"
                  style={{ cursor: isFetching ? 'not-allowed' : 'pointer' }}
                >
                  {isFetching ? 'Loading...' : 'Load more'}
                </Text>
              )}
            </div>
          )}
        </>
      ) : (
        // No favorites found
        <div className="w-full flex justify-around">
          <div className="flex flex-col justify-center items-center">
            <img src="/movie-not-found.png" className="max-w-64" alt="" />
            <h3 className="text-4xl my-4">No favorites found</h3>
            <p className="text-slate-500">Start adding movies to your favorites collection!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
