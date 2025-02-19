import { useState, useEffect } from "react";
import infoAPI from "@/api/infoAPI";

const useUserInfo = (userIdProp: number) => {
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    if (!userIdProp) return;

    const fetchUserInfo = async () => {
      try {
        const response = await infoAPI.userInfo(userIdProp);
        if (response?.data) {
          setUserInfo(response.data);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [userIdProp]);

  return userInfo;
};

export default useUserInfo;
