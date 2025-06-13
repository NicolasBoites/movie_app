import { MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons";
import {
  Button,
  Container,
  Flex,
  Skeleton,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useState } from "react";
import MovieList from "./MovieList";

function MoviesPage() {
  // const {
  //   data,
  //   isPending,
  //   error,
  //   isError,
  //   isFetching,
  //   page,
  //   setPage,
  //   setName,
  // } = useProjects();

  // const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // const debounce = (query: string) => {
  //   if (debounceTimeout.current) {
  //     clearTimeout(debounceTimeout.current); // limpia el timeout anterior
  //   }

  //   debounceTimeout.current = setTimeout(() => {
  //     setName(query.trim());
  //   }, 1200);
  // };

  const isPending = null;
  const isError = null;
  const error = { message: null };

  let movies = [
    {
      _id: "1ouoiwqe",
      title: "The Shawshank Redemption",
      genre: "drama",
      rank: 1,
    },
    {
      _id: "2ouoiwqe",
      title: "The Godfather",
      genre: "crime, drama",
      rank: 1,
    },
    {
      _id: "3ouoiwqe",
      title: "The Dark Knight",
      genre: "action, crime",
      rank: 1,
    },
    {
      _id: "4ouoiwqe",
      title: "Pulp Fiction",
      genre: "crime, drama",
      rank: 1,
    },
  ];

  // movies = null;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-row items-center justify-between mb-12">
        <div>
          <h2 className="text-slate-800 text-4xl font-medium my-4">
            Movies Collection
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            Discover and manage films
          </p>
        </div>
        <Button className="!rounded-none !px-8 !py-5 !bg-slate-900 !font-medium !uppercase">
          <PlusIcon className="!font-bold " />
          Add Movie
        </Button>
      </div>

      {movies ? (
        <>
          {/* Search bar */}
          <TextField.Root
            placeholder="Search movies by title..."
            className="!text-xl !text-slate-500 !font-medium !border-0 !border-b !border-slate-300 !ring-0 !outline-0 !h-12 !flex !items-center"
          >
            <TextField.Slot></TextField.Slot>
            <MagnifyingGlassIcon height="22" width="22" />
          </TextField.Root>

          {/* Movies */}
          <MovieList movies={movies} />

          {/* Pagination */}
          {/* <div className="flex justify-around !my-10">
            <div className="flex justify-around !w-72">
              <button
                className="!mx-0 w-full !border-1 !border-slate-300 !rounded-lg "
                onClick={() => setPage((oldPage) => oldPage - 1)}
                disabled={page === 0}
              >
                Previous
              </button>
              <button className="!w-20  !rounded-full !mx-2">{page + 1}</button>
              <button
                className="!mx-0 w-full !border-1 !border-slate-300 !rounded-lg "
                onClick={() => {
                  // if (!isPreviousData) {
                  setPage((oldPage) => oldPage + 1);
                  // }
                }}
                disabled={data.length != 10}
              >
                Next
              </button>
            </div>
          </div> */}
        </>
      ) : isPending ? (
        // Loading Message
        <>
          <Skeleton className="!h-14"></Skeleton>

          <div className="grid grid-cols-3 gap-8 my-10">
            {[1, 2, 3].map((_, index) => (
              <Container size="1">
                <Flex direction="column" gap="2">
                  <Skeleton className="!h-64"></Skeleton>

                  <Flex justify="between">
                    <Text>
                      <Skeleton>Movie Title Movie Title</Skeleton>
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
          <h3>Not movies found</h3>
        </div>
      )}
    </div>
  );
}

export default MoviesPage;
