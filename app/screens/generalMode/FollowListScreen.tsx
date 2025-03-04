import FollowProfile from "@/components/public/FollowProfile";
import { useTheme } from "@/contexts/ThemeContext";
import useFollowStore from "@/stores/useFollowStore";
import {
  fontWeight,
  text12FontSize,
  textPostFontSize,
} from "@/styles/stylePrimary";
import { darkThemeInput, grey, lightThemeInput } from "@/utils/colorPrimary";
import { darkTheme, lightTheme } from "@/utils/themes";
import { AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
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
  const route = useRoute();
  const params = route.params as { tab?: string };
  const tabName = params?.tab;
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
        <TouchableOpacity
          onPress={() => setIsTab("friend")}
          style={[
            styles.tabBarBtn,
            isTab === "friend" && {
              borderBottomWidth: 1,
              borderBottomColor: isDarkMode ? darkTheme.text : lightTheme.text,
            },
          ]}
        >
          <Text style={styles.tabBarTxt}>{} Friends</Text>
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
          renderItem={({ item }) => <FollowProfile {...item} />}
          ListHeaderComponent={
            <View style={styles.searchContainer}>
              <AntDesign
                name="search1"
                size={width * 0.05}
                color={grey}
                style={styles.searchIcon}
              />
              <TextInput placeholder="Search" style={styles.searchInput} />
            </View>
          }
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
      justifyContent: "space-between",
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
