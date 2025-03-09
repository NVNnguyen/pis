import axios, { AxiosInstance } from "axios";

class Http {
  instance: AxiosInstance;

  constructor(token?: string) {
    this.instance = axios.create({
      baseURL: "https://9fe3-2402-800-6390-a0e4-f5a3-dddc-6555-735b.ngrok-free.app/api/v1",
      timeout: 300000,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // Thêm Bearer Token nếu có
      },
    });
  }
}

export default Http;
