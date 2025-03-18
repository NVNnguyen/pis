// Trong Http.ts
import axios, { AxiosInstance } from "axios";
import { getToken } from "@/utils/storage";

class Http {
  instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: "https://pis-app.shop/api/v1",
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add interceptor
    this.instance.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });
  }
}

export default Http;
