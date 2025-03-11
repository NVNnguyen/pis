import { useTheme } from "@/contexts/ThemeContext";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { darkTheme, lightTheme } from "@/utils/themes"; // Giả định bạn có import này
import useListFriend from "@/hooks/useListFriend";
import { RouteProp, useRoute } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import Friend from "@/components/private/Friend";
import { FriendType } from "@/utils/types/FriendType";
import useFriendRequestList from "@/hooks/useFriendRequestList";
import FriendRequest from "@/components/private/FriendRequest";
import { fontWeight } from "@/styles/stylePrimary";

const { width, height } = Dimensions.get("window");
type RouteFriendProp = {
  FriendList: { userId: number };
};
const FriendListScreen = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const route = useRoute<RouteProp<RouteFriendProp, "FriendList">>();
  const userId = route?.params?.userId;
  const [activeTab, setActiveTab] = useState("friends"); // 'friends' hoặc 'requests'
  const { listFriend, isFriendLoading, isFriendError } = useListFriend(userId);
  const { listFriendRequest, isFriendRequestLoading, isFriendRequestError } =
    useFriendRequestList(userId);
  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
  };

  console.log("list friend: ", listFriend);
  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "friends" && styles.activeTab]}
          onPress={() => handleTabChange("friends")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "friends" && styles.activeTabText,
            ]}
          >
            Friends
          </Text>
          {activeTab === "friends" && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "requests" && styles.activeTab]}
          onPress={() => handleTabChange("requests")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "requests" && styles.activeTabText,
            ]}
          >
            Friend Requests
          </Text>
          {activeTab === "requests" && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Tab Content */}

      {activeTab === "friends" ? (
        <View style={styles.tabContent}>
          <FlatList
            data={listFriend}
            keyExtractor={(item) => item?.id?.toString()}
            renderItem={({ item }: { item: FriendType }) => (
              <Friend {...item} />
            )}
            ListEmptyComponent={
              <Text style={styles.noFriendTxt}>No friends yet!</Text>
            }
          />
        </View>
      ) : (
        <View style={styles.tabContent}>
          <FlatList
            data={listFriendRequest}
            keyExtractor={(item) => item?.id?.toString()}
            renderItem={({ item }: { item: FriendType }) => (
              <FriendRequest {...item} />
            )}
            ListEmptyComponent={
              <Text style={styles.noFriendTxt}>No friend requests yet!</Text>
            }
          />
        </View>
      )}
    </View>
  );
};

const getStyles = (isDarkMode: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
    },
    tabContainer: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? "#333" : "#E0E0E0",
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
    },
    tab: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: height * 0.018,
      position: "relative",
    },
    activeTab: {
      backgroundColor: "transparent",
    },
    tabText: {
      fontSize: 16,
      fontWeight: "500",
      color: isDarkMode ? "#AAAAAA" : "#757575",
    },
    activeTabText: {
      fontWeight: "700",
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    activeIndicator: {
      position: "absolute",
      bottom: 0,
      left: width * 0.1,
      right: width * 0.1,
      height: 3,
      backgroundColor: isDarkMode ? darkTheme.text : lightTheme.text,
      borderRadius: 1.5,
    },
    contentContainer: {
      flex: 1,
    },
    tabContent: {
      flex: 1,
    },
    emptyText: {
      color: isDarkMode ? "#999" : "#757575",
      fontSize: 15,
    },
    noFriendTxt: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: width * 0.05,
      fontWeight: fontWeight,
      marginTop: height * 0.35,
    },
  });
};

export default FriendListScreen;
