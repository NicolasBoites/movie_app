import { useState } from 'react';
import { Movie } from './Movie';
import MovieCard from './MovieCard';
import MovieForm from './MovieForm';

interface MovieListProps {
    movies: Movie[];
}

function MovieList({ movies }: MovieListProps) {

    const [movieBeingEdited, setMovieBeingEdited] = useState({});

    const handleEdit = (movie: Movie) => {
        setMovieBeingEdited(movie);
    }

    const cancelEditing = () => {
        setMovieBeingEdited({});
    }

    return (

        <div className="grid grid-cols-3 gap-8 my-10">
            {
                movies.map((movie) => (
                    <div className="" key={movie._id}>

                        {
                            movieBeingEdited === movie ?
                                <MovieForm movie={movie} onCancel={cancelEditing} />
                                : <MovieCard movie={movie} onEdit={handleEdit} />
                        }
                    </div>
                ))
            }

        </div>
    );
}

export default MovieList;