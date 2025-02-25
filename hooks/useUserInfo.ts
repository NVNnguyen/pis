import { useState, useEffect } from "react";
import infoAPI from "@/api/infoAPI";
import { useQuery } from "@tanstack/react-query";

const useUserInfo = (userIdProp: number) => {
  const {
    data: userInfo,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ["userInfo", userIdProp],
    queryFn: async () => {
      if (!userIdProp) throw new Error("User ID invalid!");
      console.log("📡 Fetching user info for User ID:", userIdProp);
      const response = await infoAPI.userInfo(userIdProp);
      if (!response.data) throw new Error("UserIfo not found!");
      return response.data;
    },
    staleTime: 1000 * 60 * 3,
  });

  return {userInfo,isUserLoading,userError};
};

export default useUserInfo;
