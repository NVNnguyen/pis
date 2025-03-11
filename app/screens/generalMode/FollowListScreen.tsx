import FollowProfile from "@/components/public/FollowProfile";
import { useTheme } from "@/contexts/ThemeContext";
import { useMyUserId } from "@/hooks/useMyUserId";
import useFollowStore from "@/stores/useFollowStore";
import {
  fontWeight,
  text12FontSize,
  textPostFontSize,
} from "@/styles/stylePrimary";
import { darkThemeInput, grey, lightThemeInput } from "@/utils/colorPrimary";
import { darkTheme, lightTheme } from "@/utils/themes";
import { AntDesign } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");
const FollowListScreen = () => {
  const route =
    useRoute<
      RouteProp<{ params: { tab: string; userId: number } }, "params">
    >();
  const params = route.params;
  const tabName = params?.tab;
  const userId = params?.userId;
  const myUserId = useMyUserId();
  const [isTab, setIsTab] = useState<string>(String(tabName));
  const { followStore } = useFollowStore();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode, isTab);
  return (
    <View style={styles.container}>
      <View style={styles.tabBarContainer}>
        <TouchableOpacity
          onPress={() => setIsTab("follower")}
          style={[
            styles.tabBarBtn,
            isTab === "follower" && {
              borderBottomWidth: 1,
              borderBottomColor: isDarkMode ? darkTheme.text : lightTheme.text,
            },
          ]}
        >
          <Text style={styles.tabBarTxt}>
            {followStore.followers} Followers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsTab("following")}
          style={[
            styles.tabBarBtn,
            isTab === "following" && {
              borderBottomWidth: 1,
              borderBottomColor: isDarkMode ? darkTheme.text : lightTheme.text,
            },
          ]}
        >
          <Text style={styles.tabBarTxt}>
            {followStore.followingNumbers} Following
          </Text>
        </TouchableOpacity>
      </View>

      {followStore.followers > 0 && (
        <FlatList
          data={
            isTab === "follower"
              ? followStore?.userFollowers
              : followStore?.userFollowing
          }
          keyExtractor={(item) => item?.userId.toString()}
          renderItem={({ item }) => (
            <>
              {console.log("item", item)}
              <FollowProfile {...item} isFollow={item?.isFollow} />
            </>
          )}
        />
      )}
    </View>
  );
};
const getStyles = (isDarkMode: any, isTab: string) => {
  return StyleSheet.create({
    container: {
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      flex: 1,
      paddingHorizontal: width * 0.01,
    },
    tabBarContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: height * 0.02,
    },
    tabBarBtn: {
      paddingVertical: height * 0.01,
    },
    tabBarTxt: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textPostFontSize,
    },
    searchContainer: {
      flexDirection: "row",
      backgroundColor: isDarkMode ? darkThemeInput : lightThemeInput,
      width: "100%",
      height: height * 0.04,
      borderRadius: 10,
      alignItems: "center",
      marginVertical: height * 0.02,
    },
    searchIcon: {
      marginLeft: width * 0.02,
    },
    searchInput: {
      fontSize: text12FontSize,
      marginLeft: width * 0.03,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      flex: 1,
    },
  });
};
export default FollowListScreen;
