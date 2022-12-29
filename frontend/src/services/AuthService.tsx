import axios from "axios";
import { UserType } from "@/@types/user";

export class AuthService {
  setUserInLocalStorage(data: UserType) {
    localStorage.setItem("user", JSON.stringify(data));
  }

  async login(username: string, password: string): Promise<UserType> {
    const response = await axios.post(
      `http://${process.env.REACT_APP_API_SOCKET}/auth-token/`,
      {
        username,
        password,
      }
    );

    if (!response.data.token) {
      return response.data;
    }
    this.setUserInLocalStorage(response.data);
    return response.data;
  }

  logout() {
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    const user = localStorage.getItem("user")!;
    return JSON.parse(user);
  }
}

export default new AuthService();
