import authService from "../services/auth.service";
import { Favorite } from "../favorites/Favorite";
import { movieAPI } from "./movieAPI";
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
// http://movies-app-alb-v2-13741163.us-east-1.elb.amazonaws.com/685596a4fcd718d3c7d0dd57/check/685596ef0faf321b49f96e60
// http://movies-app-alb-v2-13741163.us-east-1.elb.amazonaws.com/users/685596a4fcd718d3c7d0dd57/favorites/685596ef0faf321b49f96e60
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
    // Obtener IDs de favoritos de un usuario
    async getFavoriteIds(userId: string): Promise<string[]> {
        try {
            const response = await fetch(`${favoritesUrl}/users/${userId}`, {
                headers: getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.favoriteMovieIds || [];
        } catch (error) {
            console.error("Error getting favorite IDs:", error);
            throw new Error("There was an error retrieving favorite IDs. Please try again.");
        }
    },

    // Obtener todas las películas y filtrar por favoritos en el frontend
    async getFavoriteMovies(userId: string, page = 1, limit = 9, title = ""): Promise<Favorite[]> {
        try {
            // 1. Obtener IDs de favoritos
            const favoriteIds = await this.getFavoriteIds(userId);
            
            if (favoriteIds.length === 0) {
                return [];
            }

            // 2. Obtener todas las películas usando movieAPI
            const allMovies = await movieAPI.get(1, 1000, title);

            // 3. Filtrar solo las películas que están en favoritos
            const favoriteMovies = allMovies.filter((movie: any) => 
                favoriteIds.includes(movie.id || movie._id)
            );

            // 4. Aplicar paginación en el frontend
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedMovies = favoriteMovies.slice(startIndex, endIndex);
            
            // 5. Convertir a modelos de Favorite
            return convertToFavoriteModels(paginatedMovies);

        } catch (error) {
            console.error("Error getting favorite movies:", error);
            throw new Error("There was an error retrieving favorite movies. Please try again.");
        }
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

    // Verificar si una película está en favoritos
    async isFavorite(userId: string, movieId: string): Promise<boolean> {
        try {
            const response = await fetch(`${favoritesUrl}/${userId}/check/${movieId}`, {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.isFavorite || false;
        } catch (error) {
            console.error("Error checking favorite status:", error);
            return false;
        }
    },
};

export { favoriteAPI };
