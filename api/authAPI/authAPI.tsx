import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import LoadingScreen from "@/app/screens/generalMode/LoadingScreen";
import { BASE_URL } from "@/utils/API";

const BASE_URL_AUTH = `${BASE_URL}/auth`;
const TIMEOUT = 10000;

const authApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${BASE_URL_AUTH}/login`,
        {
          email: email,
          password: password,
        },
        { timeout: TIMEOUT }
      );

      const token = response.data?.data?.token; // Lấy token đúng từ API

      // Lưu token vào AsyncStorage
      if (!token) {
        throw new Error("API không trả về token hợp lệ.");
      }

      // Lưu token vào AsyncStorage
      await AsyncStorage.setItem("token", token);

      return response.data; // Trả về dữ liệu đăng nhập
    } catch (error) {
      console.error("Error", error);
      throw error;
    }
  },

  register: async (
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ) => {
    try {
      const response = await axios.post(
        `${BASE_URL_AUTH}/register`,
        {
          email: email,
          firstName: firstName,
          lastName: lastName,
          password: password,
        },
        { timeout: TIMEOUT }
      );

      const data = response.data?.data; // Lấy dữ liệu đăng ký từ API
      console.log(data);
      return response.data; // Trả về dữ liệu đăng ký
    } catch (error) {
      console.error("Error", error);
      throw error;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await axios.post(
        `${BASE_URL_AUTH}/register`,
        {
          email: email,
        },
        { timeout: TIMEOUT }
      );

      const data = response.data?.data; // Lấy dữ liệu đăng ký từ API
      console.log(data);
      return response.data; // Trả về dữ liệu đăng ký
    } catch (error) {
      console.error("Error", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem("token"); // Xóa token khi logout
      console.log("Logout successfully!");
    } catch (error) {
      console.error("Error", error);
    }
  },

  getToken: async () => {
    return await AsyncStorage.getItem("token");
  },
};

export default authApi;
