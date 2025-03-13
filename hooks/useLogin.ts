import authAPI from "@/api/authAPI";
import authApi from "@/api/authAPI";
import friendAPI from "@/api/friendAPI";
import { getDecodedToken } from "@/utils/decodeToken";
import { MainStackType } from "@/utils/types/MainStackType";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";

import { Alert } from "react-native";

interface RegisterProp{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const useLogin = (navigation: NavigationProp<MainStackType>) => {
 
  const login = useMutation({
   
    mutationFn: async (credentials: { email: string; password: string }) => {
        return await authAPI.login(credentials.email, credentials.password);
      },
      onSuccess: async (response) => {
        getDecodedToken(response?.data?.token);
        await AsyncStorage.setItem("token", response?.data?.token);
        console.log("token login: ", await AsyncStorage.getItem("token"));
        navigation.navigate("PublicMode");
      },
      onError: () => {
        Alert.alert('Login failed!', 'Username or password incorrect!', [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]);
      },
  });

  return { login: login.mutate, isLoading: login.isPending , isSuccess: login.isSuccess, isError: login.error };
};

export default useLogin;
