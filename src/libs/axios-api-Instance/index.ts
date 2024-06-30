import axios, { AxiosError } from "axios";

import { baseApiUrl } from "../constants";

const config = {
  baseURL: baseApiUrl
};

const api = axios.create(config);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status == 401) {
      // logout();
    }
    throw error;
  }
);

export const axiosApiInstance = api;
