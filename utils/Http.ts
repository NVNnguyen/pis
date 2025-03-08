import axios, { AxiosInstance } from "axios";

class Http {
  instance: AxiosInstance;

  constructor(token?: string) {
    this.instance = axios.create({
      baseURL: "https://8c71-125-235-237-168.ngrok-free.app/api/v1",
      timeout: 300000,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // Thêm Bearer Token nếu có
      },
    });
  }
}

export default Http;
