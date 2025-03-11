import authApi from "@/api/authAPI";
import friendAPI from "@/api/friendAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Alert } from "react-native";

const useBlockUser = () => {
 
  const block = useMutation({
   
    mutationFn: async ({ myUserId, userId }: { myUserId: number, userId: number }) => {
      return await friendAPI.blockFriend(myUserId, userId); // Gọi API logout
    },
    onSuccess: async (response) => {
         return response?.data
    },
    onError: (error) => {
      Alert.alert("Error", "Logout failed. Please try again.");
      console.error("Logout error:", error);
    },
  });

  return { block: block.mutate, isLoading: block.isPending , isSuccess: block.isSuccess };
};

export default useBlockUser;
