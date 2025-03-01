import { useState } from "react";
import { Alert } from "react-native";

const useHandleFollow = (userName: string, following: boolean) => {
    const [isFollowing, setIsFollowing] = useState<boolean>(following);
const handleFollowing = () => {
    Alert.alert(`Follow  ${userName}?`, "", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => setIsFollowing(!isFollowing),
      },
    ]);
  };
    return {isFollowing, handleFollowing };
}

export default useHandleFollow;