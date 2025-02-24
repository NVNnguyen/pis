import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export const getMyUserId = () => {
  const [myUserId, setMyUserId] = useState<number | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem("userID");
        if (userId !== null) {
          console.log("🔹 User ID:", userId);
          setMyUserId(Number(userId)); // Cập nhật state
        } else {
          console.log("⚠️ Không tìm thấy userID trong AsyncStorage");
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy userID:", error);
      }
    };
    getUserId();
  }, []);

  return myUserId; // Trả về userId từ hook
};
