import authService from "../services/auth.service";
import { Movie } from "../movies/Movie";
const baseUrl = "http://movies-app-alb-v2-13741163.us-east-1.elb.amazonaws.com";
// const baseUrl = "http://localhost:3000";
const url = `${baseUrl}/movies`;

function translateStatusToErrorMessage(status: number) {
    switch (status) {
        case 401:
            return "Please login again.";
        case 403:
            return "You do not have permission to view the movie(s).";
        default:
            return "There was an error retrieving the movie(s). Please try again.";
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

        if (httpErrorInfo.status == 401) {
            reauthenticate()
        }

        const errorMessage = translateStatusToErrorMessage(httpErrorInfo.status);
        throw new Error(errorMessage);
    }
}

async function reauthenticate() {
    const refreshAccessToken = await authService.refreshAccessToken();

    if (!refreshAccessToken) {
        throw new Error("Session expired. Please login again.");
    }
}

async function parseJSON(response: Response) {
    return response.json();
}

function convertToMovieModels(data: any[]): Movie[] {
    let movies: Movie[] = data.map(convertToMovieModel);
    return movies;
}

function convertToMovieModel(item: any): Movie {
    return new Movie(item);
}

function getAuthHeaders(extraHeaders = {}) {

    let user = authService.getCurrentUser();

    const headers = {
        ...extraHeaders,
        Authorization: `Bearer ${user.accessToken}`,
    }

    return headers;
}

const movieAPI = {
    async get(page = 1, limit = 9, title = "") {
        return (
            fetch(`${url}?title=${title}&page=${page}&limit=${limit}&sort=title`, {
                headers: getAuthHeaders(),
            })
                .then(checkStatus)
                .then(parseJSON)
                .then((response) => convertToMovieModels(response.data))
                .catch(() => {
                    throw new Error(
                        "There was an error retrieving the movies. Please try again."
                    );
                })
        );
    },
    put(movie: Movie) {
        return (
            fetch(`${url}/${movie.id}`, {
                method: "PUT",
                body: JSON.stringify(movie),
                headers: getAuthHeaders({ "Content-Type": "application/json" }),
            })
                .then(checkStatus)
                .then(parseJSON)
                .catch(() => {
                    throw new Error(
                        "There was an error updating the movie. Please try again."
                    );
                })
        );
    },

    async find(id: string | undefined) {
        return fetch(`${url}/${id}`, {
            headers: getAuthHeaders(),
        })
            .then(checkStatus)
            .then(parseJSON)
            .then((response) => response.data.data)
            .catch(() => {
                throw new Error(
                    "There was an error retrieving the movies. Please try again."
                );
            })
    },

    post(movie: Movie) {
        return (
            fetch(`${url}`, {
                method: "POST",
                body: JSON.stringify(movie),
                headers: getAuthHeaders({ "Content-Type": "application/json" }),
            })
                .then(checkStatus)
                .then(parseJSON)
                .catch(() => {
                    throw new Error(
                        "There was an error updating the movie. Please try again."
                    );
                })
        );
    },

    delete(movie: Movie) {
        return (
            fetch(`${url}/${movie.id}`, {
                method: "DELETE",
                body: JSON.stringify(movie),
                headers: getAuthHeaders({ "Content-Type": "application/json" }),
            })
                .then(checkStatus)
                .then(parseJSON)
                .catch(() => {
                    throw new Error(
                        "There was an error retrieving the movies. Please try again."
                    );
                })
        );
    },
};

export { movieAPI };
