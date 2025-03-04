import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
interface DecodedToken {
    userId: string;
    sub: string;
  }
export const getDecodedToken = async (token: string) => {
    try {
   // Đợi token từ AsyncStorage
      if (!token) {
        console.log("Token not exit.");
        return null;
      }
      const decodedToken: DecodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);
      await AsyncStorage.setItem("userID", decodedToken?.userId.toString()); // Đợi token từ AsyncStorage
      return decodedToken;
    } catch (error) {
      console.error("Decode token fail:", error);
      return null;
    }
  };

