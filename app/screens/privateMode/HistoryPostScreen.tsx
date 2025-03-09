import postsAPI from "@/api/postsAPI";
import Photo from "@/components/private/Photo";
import Voice from "@/components/private/Voice";
import { useTheme } from "@/contexts/ThemeContext";
import { textPostFontSize } from "@/styles/stylePrimary";
import { darkTheme, lightTheme } from "@/utils/themes";
import { MainStackType } from "@/utils/types/MainStackType";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useMemo } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
} from "react-native";

const HistoryPostScreen = () => {
  const [activeTab, setActiveTab] = useState<"photo" | "voice">("photo");
  const route = useRoute<RouteProp<MainStackType, "HistoryPost">>();
  const { isDarkMode } = useTheme();
  const { width } = useWindowDimensions();
  const styles = getStyles(isDarkMode, width);

  const {
    data: privatePosts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["postPrivate", route?.params?.userId],
    queryFn: () => postsAPI.postsPrivate(route?.params?.userId),
    enabled: !!route?.params?.userId,
  });

  const photoPosts = useMemo(
    () =>
      (privatePosts?.data || []).filter((item: any) => item.type === "Image"),
    [privatePosts]
  );

  const voicePosts = useMemo(
    () =>
      (privatePosts?.data || []).filter((item: any) => item.type === "Voice"),
    [privatePosts]
  );

  const ITEM_MARGIN = 4;
  const NUM_COLUMNS = 3;
  const ITEM_SIZE = (width - ITEM_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

  const renderPhotoItem = ({ item }: any) => (
    <View style={{ width: ITEM_SIZE, height: ITEM_SIZE, margin: ITEM_MARGIN }}>
      <Photo {...item} size={ITEM_SIZE} />
    </View>
  );

  const renderVoiceItem = ({ item }: any) => (
    <View style={{ width: ITEM_SIZE, height: ITEM_SIZE, margin: ITEM_MARGIN }}>
      <Voice {...item} size={ITEM_SIZE} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: route.params.avatar }}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.profileName}>{route.params.username}</Text>
        <View style={styles.friendBadge}>
          <Text style={styles.friendBadgeText}>Friend</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.tabContainer}>
        {["photo", "voice"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.tabButton}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab === "photo" ? "Photo" : "Voice"}
            </Text>
            {activeTab === tab && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "photo" ? (
        <FlatList
          key="photo"
          data={photoPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPhotoItem}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={{ padding: ITEM_MARGIN }}
        />
      ) : (
        <FlatList
          key="voice"
          data={voicePosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderVoiceItem}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={{ padding: ITEM_MARGIN }}
        />
      )}
    </SafeAreaView>
  );
};

const getStyles = (isDarkMode: boolean, width: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
    },
    profileHeader: {
      alignItems: "center",
      marginBottom: width * 0.04,
      paddingTop: width * 0.05,
    },
    profileImageContainer: {
      width: width * 0.18,
      height: width * 0.18,
      borderRadius: width * 0.09,
      borderWidth: 2,
      borderColor: isDarkMode ? darkTheme.text : lightTheme.text,
      overflow: "hidden",
      marginBottom: width * 0.02,
    },
    profileImage: {
      width: "100%",
      height: "100%",
    },
    profileName: {
      fontSize: textPostFontSize,
      fontWeight: "bold",
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginBottom: width * 0.01,
    },
    friendBadge: {
      backgroundColor: isDarkMode ? darkTheme.text : lightTheme.text,
      paddingHorizontal: width * 0.03,
      paddingVertical: width * 0.01,
      borderRadius: 15,
    },
    friendBadgeText: {
      fontSize: width * 0.03,
      fontWeight: "500",
      color: isDarkMode ? lightTheme.text : darkTheme.text,
    },
    divider: {
      height: 1,
      backgroundColor: "#333",
      marginVertical: width * 0.04,
    },
    tabContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: width * 0.02,
    },
    tabButton: {
      marginHorizontal: width * 0.05,
      paddingVertical: width * 0.02,
      position: "relative",
    },
    tabText: {
      color: "#888",
      fontSize: width * 0.04,
      fontWeight: "500",
    },
    activeTabText: {
      fontWeight: "bold",
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    activeTabIndicator: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: isDarkMode ? darkTheme.text : lightTheme.text,
      borderRadius: 1,
    },
  });

export default HistoryPostScreen;
