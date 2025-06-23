import authService from "../services/auth.service";
import { Favorite } from "../favorites/Favorite";
const baseUrl = "http://movies-app-alb-v2-13741163.us-east-1.elb.amazonaws.com";
// const baseUrl = "http://localhost:3003";
const favoritesUrl = `${baseUrl}`;

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
    // Obtener favoritos de un usuario
    async getFavorites(userId: string): Promise<Favorite[]> {
         return (await fetch(`${favoritesUrl}/users/${userId}/movies`, {
                headers: getAuthHeaders(),
            })
            .then(checkStatus)
            .then(parseJSON)
            .then((response) => convertToFavoriteModels(response.data))
            .catch(() => {
                throw new Error(
                    "There was an error retrieving the movies. Please try again."
                );
            })
        )
    },

     // Obtener favoritos de un usuario
     async getFavoritesIds(userId: string): Promise<Favorite[]> {
        return (await fetch(`${favoritesUrl}/users/${userId}`, {
               headers: getAuthHeaders(),
           })
           .then(checkStatus)
           .then(parseJSON)
           .then((response) => (response.data.favoriteMovieIds))
           .catch(() => {
               throw new Error(
                   "There was an error retrieving the movies. Please try again."
               );
           })
       )
   },
    
    // Agregar película a favoritos
    async addToFavorites(userId: string, movieId: string): Promise<any> {
        try {
            const response = await fetch(`${favoritesUrl}/users/${userId}/favorites/${movieId}`, {
                method: "PATCH",
                // body: JSON.stringify({ movieId }),
                headers: getAuthHeaders({ "Content-Type": "application/json" }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error adding to favorites:", error);
            throw new Error("There was an error adding to favorites. Please try again.");
        }
    },

    // Remover película de favoritos
    async removeFromFavorites(userId: string, movieId: string): Promise<any> {
        try {
            const response = await fetch(`${favoritesUrl}/users/${userId}/favorites/${movieId}`, {
                method: "DELETE",
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error removing from favorites:", error);
            throw new Error("There was an error removing from favorites. Please try again.");
        }
    },

   
};

export { favoriteAPI };
