import axios, {AxiosInstance} from "axios";
import {UserType} from "@/@types/user";

export const DefaultPropsType = {
  login: () => null,
  logout: () => null,
  authAxios: axios,
  user: null,
};
export interface AuthPropsType {
  login: (username: string, password: string) => any;
  logout: () => void;
  authAxios: AxiosInstance;
  user: UserType | null;
}