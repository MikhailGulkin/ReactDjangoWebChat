import React, { createContext, ReactNode, useState } from "react";
import AuthService from "../services/AuthService";
import axios from "axios";
import { AuthPropsType, DefaultPropsType } from "@/@types/auth";
import { useNavigate } from "react-router-dom";
import { authHeader } from "@/services/AuthHeader";
import { paths } from "@/routing/config";

export const AuthContext = createContext<AuthPropsType>(DefaultPropsType);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => AuthService.getCurrentUser());
  async function login(username: string, password: string) {
    const data = await AuthService.login(username, password);
    setUser(data);
    return data;
  }

  const logout = () => {
    AuthService.logout();
    setUser(null);
    navigate(paths.login);
  };

  // axios instance for making requests
  const authAxios = axios.create();

  // request interceptor for adding token
  authAxios.interceptors.request.use((config) => {
    // add token to request headers
    config.headers = authHeader();
    return config;
  });

  authAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );

  return (
    <AuthContext.Provider value={{ user, login, logout, authAxios }}>
      {children}
    </AuthContext.Provider>
  );
};
