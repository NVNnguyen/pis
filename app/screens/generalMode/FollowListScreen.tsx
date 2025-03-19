import React from "react";
import { useState, useCallback } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useMyUserId } from "@/hooks/useMyUserId";
import useUserFollowInfo from "@/hooks/useUserFollowInfo";
import FollowProfile from "@/components/public/FollowProfile";
import {
  fontWeight,
  text12FontSize,
  textPostFontSize,
} from "@/styles/stylePrimary";
import { darkThemeInput, lightThemeInput } from "@/utils/colorPrimary";
import { darkTheme, lightTheme } from "@/utils/themes";
import { RouteProp, useRoute, useFocusEffect } from "@react-navigation/native";
import { formatNumber } from "@/utils/formatNumber";

const { width, height } = Dimensions.get("window");

type FollowListRouteParams = {
  params: {
    tab: string;
    userId: number;
  };
};

const FollowListScreen = () => {
  const route = useRoute<RouteProp<FollowListRouteParams, "params">>();
  const params = route.params;
  const tabName = params?.tab;
  const userId = params?.userId;
  const myUserId = useMyUserId();
  const [isTab, setIsTab] = useState<string>(String(tabName));
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode, isTab);

  const { followInfo, isFollowLoading, isFollowError } =
    useUserFollowInfo(userId);

  useFocusEffect(
    useCallback(() => {
      // Không cần làm gì thêm nếu useUserFollowInfo đã được cấu hình refetch
    }, [userId])
  );

  if (isFollowLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (isFollowError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading follow data</Text>
      </View>
    );
  }

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
            {formatNumber(followInfo?.followers ?? 0)} Followers
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
            {formatNumber(followInfo?.followingNumbers ?? 0)} Following
          </Text>
        </TouchableOpacity>
      </View>

      {followInfo?.followers > 0 && (
        <FlatList
          data={
            isTab === "follower"
              ? followInfo?.userFollowers
              : followInfo?.userFollowing
          }
          keyExtractor={(item) => item?.userId.toString()}
          renderItem={({ item }) => (
            <FollowProfile {...item} isFollow={item?.isFollow} />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No {isTab} yet!</Text>
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
    loadingText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textPostFontSize,
      textAlign: "center",
      marginTop: height * 0.2,
    },
    errorText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textPostFontSize,
      textAlign: "center",
      marginTop: height * 0.2,
    },
    emptyText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textPostFontSize,
      textAlign: "center",
      marginTop: height * 0.2,
    },
  });
};

export default FollowListScreen;
