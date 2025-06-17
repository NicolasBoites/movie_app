import { Movie } from '../movies/Movie';
// import Movie from '../interfaces/movies';

import movies from './movies';
const baseUrl = 'http://localhost:3000';
const url = `${baseUrl}/movie`;

function translateStatusToErrorMessage(status: number) {
    switch (status) {
        case 401:
            return 'Please login again.';
        case 403:
            return 'You do not have permission to view the movie(s).';
        default:
            return 'There was an error retrieving the movie(s). Please try again.';
    }
}

function checkStatus(response: any) {
    if (response.ok) {
        return response;
    } else {
        const httpErrorInfo = {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
        };
        console.log(`log server http error: ${JSON.stringify(httpErrorInfo)}`);

        let errorMessage = translateStatusToErrorMessage(httpErrorInfo.status);
        throw new Error(errorMessage);
    }
}

async function parseJSON(response: Response) {
    const jsonResponse = await response.json();

    return jsonResponse.data;
}

// eslint-disable-next-line
function delay(ms: number) {
    return function (x: any): Promise<any> {
        return new Promise((resolve) => setTimeout(() => resolve(x), ms));
    };
}

function convertToMovieModels(data: any[]): Movie[] {
    let movies: Movie[] = data.map(convertToMovieModel);
    return movies;
}

function convertToMovieModel(item: any): Movie {
    return new Movie(item);
}

const movieAPI = {
    get(page = 1, limit = 10, name = null) {

        let movies = [
            {
                id: "1ouoiwqe",
                title: "The Shawshank Redemption",
                genre: "drama",
                rank: 1,
            },
            {
                id: "2ouoiwqe",
                title: "The Godfather",
                genre: "crime, drama",
                rank: 1,
            },
            {
                id: "3ouoiwqe",
                title: "The Dark Knight",
                genre: "action, crime",
                rank: 1,
            },
            {
                id: "4ouoiwqe",
                title: "Pulp Fiction",
                genre: "crime, drama",
                rank: 1,
            },
            {
                "id": "ccdee195",
                "title": "The Shawshank Redemption",
                "genre": "adventure",
                "rank": 1
            },
            {
                "id": "7aeed807",
                "title": "The Godfather",
                "genre": "adventure",
                "rank": 1
            },
            {
                "id": "16041cee",
                "title": "The Dark Knight",
                "genre": "action",
                "rank": 1
            },
            {
                "id": "9b872bbd",
                "title": "Pulp Fiction",
                "genre": "sci-fi",
                "rank": 1
            },
            {
                "id": "3753fd3a",
                "title": "Schindler's List",
                "genre": "romance",
                "rank": 1
            },
            {
                "id": "539f38a9",
                "title": "The Lord of the Rings",
                "genre": "thriller",
                "rank": 1
            },
            {
                "id": "5f34ad98",
                "title": "Fight Club",
                "genre": "adventure",
                "rank": 1
            },
            {
                "id": "59616be1",
                "title": "Forrest Gump",
                "genre": "animation, sci-fi",
                "rank": 1
            },
            {
                "id": "15734aa6",
                "title": "Inception",
                "genre": "action",
                "rank": 1
            },
            {
                "id": "cd6e02f8",
                "title": "The Matrix",
                "genre": "fantasy, drama",
                "rank": 1
            },
            {
                "id": "1f0bb0c7",
                "title": "Goodfellas",
                "genre": "romance",
                "rank": 1
            },
            {
                "id": "7e4a9905",
                "title": "Se7en",
                "genre": "animation, romance",
                "rank": 1
            },
            {
                "id": "d320b832",
                "title": "City of God",
                "genre": "thriller",
                "rank": 1
            },
            {
                "id": "a740ed4c",
                "title": "Interstellar",
                "genre": "animation",
                "rank": 1
            },
            {
                "id": "d64f13ef",
                "title": "Spirited Away",
                "genre": "fantasy, comedy",
                "rank": 1
            },
            {
                "id": "93351791",
                "title": "Saving Private Ryan",
                "genre": "fantasy",
                "rank": 1
            },
            {
                "id": "fc01352e",
                "title": "The Green Mile",
                "genre": "animation",
                "rank": 1
            },
            {
                "id": "bb84111c",
                "title": "The Silence of the Lambs",
                "genre": "drama",
                "rank": 1
            },
            {
                "id": "98819dfa",
                "title": "The Usual Suspects",
                "genre": "adventure",
                "rank": 1
            },
            {
                "id": "b3e8a9d1",
                "title": "L\u00e9on: The Professional",
                "genre": "fantasy, crime",
                "rank": 1
            },
        ];
        return movies;
        // return fetch(`${url}?_name=${name}&_page=${page}&_limit=${limit}&_sort=name`)
        //     // .then(delay(2000))
        //     .then(checkStatus)
        //     .then(parseJSON)
        //     .then(convertToMovieModels)
        //     .catch((error: TypeError) => {
        //         console.log('log client error ' + error);
        //         throw new Error(
        //             'There was an error retrieving the movies. Please try again.'
        //         );
        //     });
    },
    put(movie: Movie) {
        return fetch(`${url}/${movie.id}`, {
            method: 'PUT',
            body: JSON.stringify(movie),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            // .then(delay(2000))
            .then(checkStatus)
            .then(parseJSON)
            .catch((error: TypeError) => {
                console.log('log client error ' + error);
                throw new Error(
                    'There was an error updating the movie. Please try again.'
                );
            });
    },

    find(id: string) {
        return fetch(`${url}/${id}`)
            .then(checkStatus)
            .then(parseJSON)
            .then(convertToMovieModel);
    },

    post(movie: Movie) {
        return fetch(`${url}`, {
            method: 'POST',
            body: JSON.stringify(movie),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            // .then(delay(2000))
            .then(checkStatus)
            .then(parseJSON)
            .catch((error: TypeError) => {
                console.log('log client error ' + error);
                throw new Error(
                    'There was an error updating the movie. Please try again.'
                );
            });
    },

    delete(movie: Movie) {
        return fetch(`${url}/${movie.id}`, {
            method: 'DELETE',
            body: JSON.stringify(movie),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            // .then(delay(2000))
            .then(checkStatus)
            .then(parseJSON)
            // .then(convertToMovieModels)
            .catch((error: TypeError) => {
                console.log('log client error ' + error);
                throw new Error(
                    'There was an error retrieving the movies. Please try again.'
                );
            });
    },
};

export { movieAPI };