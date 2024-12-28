import { backgroundColor, Color } from "@/styles/color";
import { useEffect, useState } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { RootStackParamList } from "@/navigation/MainStack";

const { width, height } = Dimensions.get("window");

const PublicOrPrivate = () => {
  const [toggleOption, setToggleOption] = useState<string>("Friends");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleToggle = (option: string) => {
    setToggleOption(option); // Cập nhật trạng thái
    if (toggleOption === "Public") {
      navigation.navigate("PublicMode");
    } else if (toggleOption === "Friends") {
      navigation.navigate("FriendMode");
    }
  };

  return (
    <View style={styles.toggleSwitch}>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          toggleOption === "Friends" && styles.activeButton,
        ]}
        onPress={() => handleToggle("Friends")}
      >
        <Text
          style={[
            styles.toggleText,
            toggleOption === "Friends" && styles.activeText,
          ]}
        >
          Friends
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          toggleOption === "Public" && styles.activeButton,
        ]}
        onPress={() => handleToggle("Public")}
      >
        <Text
          style={[
            styles.toggleText,
            toggleOption === "Public" && styles.activeText,
          ]}
        >
          Public
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleSwitch: {
    flexDirection: "row",
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.005,
    alignItems: "center",
  },
  toggleButton: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.01,
    borderRadius: 12,
  },
  toggleText: {
    color: Color,
    fontSize: width * 0.04,
  },
  activeButton: {
    backgroundColor: Color,
  },
  activeText: {
    color: backgroundColor,
  },
});

export default PublicOrPrivate;
