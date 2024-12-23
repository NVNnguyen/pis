import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tạo instance axios
const API = axios.create({
  baseURL: "https://676984df863eaa5ac0dbeb17.mockapi.io/api", // Đặt base URL của API
  timeout: 10000, // Timeout cho request
});

// Interceptor để thêm token vào request
// API.interceptors.request.use(
//   async (config) => {
//     const token = await AsyncStorage.getItem("authToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// Interceptor để xử lý lỗi chung
// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Xử lý lỗi toàn cục (401, 500, v.v.)
//     if (error.response?.status === 401) {
//       console.warn("Unauthorized - Token expired");
//     }
//     return Promise.reject(error);
//   }
// );

export default API;
