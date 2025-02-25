import authApi from "@/api/authAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";

const useLogout = () => {
  const navigation = useNavigation(); // Điều hướng màn hình

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const token = await AsyncStorage.getItem("token"); // Lấy token từ AsyncStorage
      if (!token) throw new Error("No token found");

      return await authApi.logout(token); // Gọi API logout
    },
    onSuccess: async (response) => {
      if (response?.message === "Logout success") {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("userId");
        navigation.reset({ index: 0, routes: [{ name: "Login" as never }] }); // Điều hướng về Login
      }
    },
    onError: (error) => {
      Alert.alert("Error", "Logout failed. Please try again.");
      console.error("Logout error:", error);
    },
  });

  return { logout: logoutMutation.mutate, isLoading: logoutMutation.isPending };
};

export default useLogout;
