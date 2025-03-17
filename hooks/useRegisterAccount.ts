import authApi from "@/api/authAPI";
import friendAPI from "@/api/friendAPI";
import { MainStackType } from "@/utils/types/MainStackType";
import { NavigationProp } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";

import { Alert } from "react-native";

interface RegisterProp{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const useRegisterAccount = (navigation: NavigationProp<MainStackType>) => {
 
  const register = useMutation({
   
    mutationFn: async ({  email,
      password,
      firstName,
      lastName }:RegisterProp) => {
      return await authApi.register(email,
        password,
        firstName,
        lastName ); 
    },
    onSuccess: async (response) => {
      console.log("response", response);
      navigation.navigate("Login")
      return;
    },
    onError: (error) => {
      console.log("error", error);
      Alert.alert('Register failed!', 'Please try it again!', [
        {
          text: 'Cancel',
          onPress: () => navigation.navigate("Login"),
          style: 'destructive',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
  
    },
  });

  return { register: register.mutate, isLoading: register.isPending , isSuccess: register.isSuccess };
};

export default useRegisterAccount;
function mutationFn(variables: RegisterProp): Promise<any> {
  throw new Error("Function not implemented.");
}

