import {
  CaretLeftIcon,
  CaretRightIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import {
  Container,
  Flex,
  Skeleton,
  Text,
} from "@radix-ui/themes";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import MovieList from "./MovieList";
import { useMovies } from "./moviesHooks";

function MoviesPage() {
  const {
    isPending,
    error,
    isError,
    isFetching,
    movies,
    hasNextPage,
    hasPrevPage,
    page,
    setPage,
    setTitle,
  } = useMovies();

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounce = (query: string) => {

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current); // limpia el timeout anterior
    }

    debounceTimeout.current = setTimeout(() => {
      setTitle(query.trim());
    }, 800);
  };

  const navigate = useNavigate();

  const handleAddMovieClick = () => {
    navigate("/add-movie"); // Replace with your route
  };


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
        <button
          onClick={handleAddMovieClick}
          className="flex items-center justify-between space-x-1 rounded-none px-6 py-3 bg-slate-900 font-medium uppercase hover:bg-slate-600 cursor-pointer text-slate-50 transition-colors duration-200"
        >
          <PlusIcon className="!font-bold !mx-1" />
          Add Movie
        </button>
      </div>

      {movies ? (
        <>
          {/* Search bar */}
          <div className="relative flex items-center h-12 border-0 border-b border-slate-300">
            <input
              onChange={(e: any) => debounce(e.target.value)}
              placeholder="Search movies by title..."
              className="w-full text-xl text-slate-500 font-medium border-0 ring-0 outline-0 bg-transparent"
            />
            <MagnifyingGlassIcon height="22" width="22" className="text-slate-500" />
          </div>

          {isFetching && !isPending && <div>Loading...</div>}

          {/* Movies */}
          <MovieList movies={movies} />

          {/* Pagination */}
          <div className="flex justify-center my-10">
            <div className="flex items-center gap-2">
                            {/* Botón Anterior */}
              <button
                className="w-10 h-10 flex justify-center items-center cursor-pointer"
                onClick={() => setPage((old) => old - 1)}
                disabled={!hasPrevPage}
              >
                <CaretLeftIcon />
              </button>

              {/* Botones de Página */}

              <span className="text-slate-600">
                  Página {page + 1}
                </span>

              {/* Botón Siguiente */}
              <button
                className="w-10 h-10 flex justify-center items-center cursor-pointer"
                onClick={() => setPage((old) => old + 1)}
                disabled={!hasNextPage}
              >
                <CaretRightIcon />
              </button>
            </div>
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
          <div className="flex flex-col justify-center items-center">
            <img src="/movie-not-found.png" className="max-w-64" alt="" />
            <h3 className="text-4xl my-4">Not movies found</h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoviesPage;
