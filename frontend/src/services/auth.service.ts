import axios from "axios";

const API_URL = "http://localhost:3000/auth/";

class AuthService {
  login(username: string, password: string) {
    return axios
      .post(API_URL + "signin", {
        email: username,
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

  register(username: string, password: string, email: string) {
    return axios.post(API_URL + "signup", {
      name: username,
      email,
      password
    });
  }

  getCurrentUser() {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    return user;
  }
}

export default new AuthService();
