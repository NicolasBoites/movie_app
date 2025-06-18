import axios from "axios";

const API_URL = "http://localhost:3000/auth/";

class AuthService {
  login(email: string, password: string) {
    return axios
      .post(API_URL + "signin", {
        email,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }


  async register(name: string, email: string, password: string) {
    return await axios.post(API_URL + "signup", {
      name,
      email,
      password
    });
  }

  getCurrentUser() {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    // const userString = localStorage.getItem("user");

    // if (!userString) {
    //   throw new Error("No authentication token found. Please log in.");
    // }

    // let user;
    // try {
    //   user = JSON.parse(userString);
    // } catch {
    //   throw new Error("Invalid user session data.");
    // }

    // if (!user.accessToken) {
    //   throw new Error("No authentication token found. Please log in.");
    // }

    return user;
  }

  isAuthenticated() {
    const user = this.getCurrentUser();

    return user ? true : false;
  }


  getRefreshToken() {
    const user = this.getCurrentUser();

    return user.refreshToken;
  }

  getAccessToken() {
    const user = this.getCurrentUser();

    return user.accessToken;
  }

  async refreshAccessToken() {
    const refreshToken = this.getRefreshToken();

    return axios
      .get(API_URL + "refresh",
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        }
      )
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }
}

export default new AuthService();
 