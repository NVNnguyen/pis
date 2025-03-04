import axios, { AxiosInstance } from "axios";

class Http {
  instance: AxiosInstance;

  constructor(token?: string) {
    this.instance = axios.create({
      baseURL: "https://28cb-2402-800-6343-cd62-7983-34b9-b8b5-3c96.ngrok-free.app/api/v1",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // Thêm Bearer Token nếu có
      },
    });
  }
}

export default Http;
