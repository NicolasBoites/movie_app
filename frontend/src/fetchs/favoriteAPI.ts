import authService from "../services/auth.service";
import { Favorite } from "../favorites/Favorite";
const baseUrl = "http://localhost:3000";
const url = `${baseUrl}/movies`;

function translateStatusToErrorMessage(status: number) {
    switch (status) {
        case 401:
            return "Please login again.";
        case 403:
            return "You do not have permission to view the favorite(s).";
        default:
            return "There was an error retrieving the favorite(s). Please try again.";
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
    const jsonResponse = await response.json();

    return jsonResponse;
}

function convertToFavoriteModels(data: any[]): Favorite[] {
    let favorites: Favorite[] = data.map(convertToFavoriteModel);
    return favorites;
}

function convertToFavoriteModel(item: any): Favorite {
    return new Favorite(item);
}

function getAuthHeaders(extraHeaders = {}) {

    let user = authService.getCurrentUser();

    const headers = {
        ...extraHeaders,
        Authorization: `Bearer ${user.accessToken}`,
    }

    return headers;
}

const favoriteAPI = {
    async get(page = 1, limit = 9, title = "") {
        console.log("title", title);
        return (
            fetch(`${url}?title=${title}&page=${page}&limit=${limit}&sort=title`, {
                headers: getAuthHeaders(),
            })
                .then(checkStatus)
                .then(parseJSON)
                .then((response) => convertToFavoriteModels(response.data))
                .catch(() => {
                    throw new Error(
                        "There was an error retrieving the favorites. Please try again."
                    );
                })
        );
    },
    
    post(favorite: Favorite) {
        return (
            fetch(`${url}`, {
                method: "POST",
                body: JSON.stringify(favorite),
                headers: getAuthHeaders({ "Content-Type": "application/json" }),
            })
                .then(checkStatus)
                .then(parseJSON)
                .catch(() => {
                    throw new Error(
                        "There was an error updating the favorite. Please try again."
                    );
                })
        );
    },
};

export { favoriteAPI };
