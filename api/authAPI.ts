import AsyncStorage from "@react-native-async-storage/async-storage";
import Http from "@/utils/Http";

const BASE_URL_AUTH = `/auth`;

const http = new Http("").instance;

const authApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await http.post(
        // Thêm `await` để đợi phản hồi
        `${BASE_URL_AUTH}/login`,
        { email, password }
      );

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  register: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
   
  ) => {
    try {
      const response = await http.post(`${BASE_URL_AUTH}/register`, {
        "email": email,
        "password": password,
        "firstName": firstName,
        "lastName":lastName,
      });
      return response.data;
    } catch (error) {
      console.error("Register error:", (error as any)?.message);
      throw error;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await http.post(
        // Đúng endpoint `/forgot-password`
        `${BASE_URL_AUTH}/forgot-password`,
        { "email": email }
      );
      return response?.data;
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  },
  resetPassword: async (email: string, otp: number) => {
    try {
      const response = await http.post(
        // Đúng endpoint `/forgot-password`
        `${BASE_URL_AUTH}/reset-password`,
        { "email": email,
          "otp": otp
         }
      );
      return response?.data;
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  },
  updatePassword: async (email: string, password: string) => {
    try {
      const response = await http.post(
        // Đúng endpoint `/forgot-password`
        `${BASE_URL_AUTH}/update-password`,
        { "email": email,
          "password": password
         }
      );
      return response?.data;
    } catch (error) {
      console.error("Update password error ", error);
      throw error;
    }
  },
  


  logout: async (token: string) => {
    try {
      const response  = await http.post( // Đúng endpoint `/forgot-password`
        `${BASE_URL_AUTH}/logout`,
        { "token": token })
        console.log(response?.data)
        return response?.data
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
};

export default authApi;
