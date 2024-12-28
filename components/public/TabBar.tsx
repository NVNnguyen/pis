import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import { View, Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const TabBar = () => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="home-variant" size={24} color="black" />
      <Ionicons name="search-outline" size={24} color="black" />
      <Ionicons name="add-sharp" size={24} color="black" />
      <Ionicons
        name="heart-outline" // Đổi biểu tượng trái tim
        size={width * 0.05} // Responsive kích thước icon
        color="#FFFFFF" // Đổi màu sắc
      />
      <FontAwesome5 name="user" size={24} color="black" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // justifyContent: "space-around",
    // alignItems: "center",
    // backgroundColor: "#fff",
    // paddingVertical: height * 0.015,
  },
});
export default TabBar;
