// Đổi tên file thành useMyUserId.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export const useMyUserId = () => {
  const [myUserId, setMyUserId] = useState<number | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem("userID");
        if (userId !== null) {
          setMyUserId(Number(userId));
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy userID:", error);
      }
    };
    getUserId();
  }, []); // Chỉ chạy một lần khi mount, không phụ thuộc myUserId

  return myUserId;
};