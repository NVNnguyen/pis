import axios, { AxiosInstance } from "axios";

class Http {
  instance: AxiosInstance;

  constructor(token?: string) {
    this.instance = axios.create({
      baseURL: "https://e058-27-69-239-250.ngrok-free.app/api/v1",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // Thêm Bearer Token nếu có
      },
    });
  }
}

export default Http;
