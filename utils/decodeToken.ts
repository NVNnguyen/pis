import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
interface DecodedToken {
    userId: string;
    sub: string;
  }
export const getDecodedToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // Đợi token từ AsyncStorage
      if (!token) {
        console.log("Token not exit.");
        return null;
      }
      const decodedToken: DecodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);
      return decodedToken;
    } catch (error) {
      console.error("Decode token fail:", error);
      return null;
    }
  };


  export const getUserId = async () => { 
    const decodedToken = await getDecodedToken();
    const userID = Number(decodedToken?.userId);
    await AsyncStorage.setItem("userID", userID.toString()); // Đợi token từ AsyncStorage
    return userID;
  };    