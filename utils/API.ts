import axios, { AxiosInstance } from "axios";

// export const BASE_URL = "https://d5a0-2405-4803-dabb-cba0-9aeb-c633-f008-a0bb.ngrok-free.app/api/v1/";

class Http {
  instance: AxiosInstance;

  constructor(token?: string) {
    this.instance = axios.create({
      baseURL: "https://bb29-14-184-154-53.ngrok-free.app/api/v1",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // Thêm Bearer Token nếu có
      },
    });
  }
}

export default Http;
