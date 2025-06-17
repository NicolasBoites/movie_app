import {
  CaretLeftIcon,
  CaretRightIcon,
  HeartFilledIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import {
  Button,
  Container,
  Flex,
  Skeleton,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteList from "../favorites/FavoriteList";
import { useFavorites } from "./favoritesHooks";

function FavoritesPage() {
  const {
    data,
    isPending,
    error,
    isError,
    isFetching,
    page,
    setPage,
    title,
    setTitle,
  } = useFavorites();

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounce = (query: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current); // limpia el timeout anterior
    }

    debounceTimeout.current = setTimeout(() => {
      setTitle(query.trim());
    }, 1200);
  };

  const navigate = useNavigate();

  const handleAddFavoriteClick = () => {
    navigate("/add-movie"); // Replace with your route
  };

  const favorites = data;

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

      {favorites ? (
        <>
          {/* Search bar */}
          <TextField.Root
            value={title}
            onChange={(e) => debounce(e.target.value)}
            placeholder="Search favorites by title..."
            className="text-xl !text-slate-500 !font-medium !border-0 !border-b !border-slate-300 !ring-0 !outline-0 !h-12 !flex !items-center"
          >
            <TextField.Slot></TextField.Slot>
            <MagnifyingGlassIcon height="22" width="22" />
          </TextField.Root>

          {/* Favorites */}
          <FavoriteList favorites={favorites} />

          {/* Pagination */}

          {/* Botón Siguiente */}
          <div
            className="border border-slate-300 py-8 flex justify-center items-center w-full">
            <HeartFilledIcon className="text-slate-400" />
            <Text className="text-slate-400 font-medium !mx-2">Showing {} of {} favorite movies</Text>
            <Text as="div" 
            // onclick
             className="text-slate-900 font-medium">Load more</Text>
          </div>
        </>
      ) : isPending ? (
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
      ) : (
        <div className="w-full flex justify-around">
          <div className="flex flex-col justify-center items-center">
            <img src="/movie-not-found.png" className="max-w-64" alt="" />
            <h3 className="text-4xl my-4">Not favorites found</h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
