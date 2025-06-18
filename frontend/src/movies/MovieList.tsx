import { Movie } from './Movie';
import MovieCard from './MovieCard';

interface MovieListProps {
    movies: Movie[];
}

function MovieList({ movies }: MovieListProps) {


    return (

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-10">
            {
                movies.map((movie) => (
                    <div className="" key={movie.id}>
                        <MovieCard movie={movie} />
                    </div>
                ))
            }

        </div>
    );
}

export default MovieList;