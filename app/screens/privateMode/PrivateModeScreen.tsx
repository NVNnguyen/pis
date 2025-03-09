import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Text,
  Animated,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

import { backgroundColor, buttonFontsize, Color } from "@/styles/stylePrimary";
import PublicOrPrivate from "@/components/genaral/PublicOrPrivate";
import { getMyUserId } from "@/hooks/getMyUserID";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MainStackType } from "@/utils/types/MainStackType";
import CapTure from "@/components/private/Capture";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import usePrivatePosts from "@/hooks/usePrivatePosts";
import PostPrivate from "@/components/private/PostPrivate";

const { width, height } = Dimensions.get("window");

const PrivateModeScreen = () => {
  const navigation = useNavigation<NavigationProp<MainStackType>>();
  const myUserId = getMyUserId() ?? 0;
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showAlternate, setShowAlternate] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const [onTopCheck, setOnTopCheck] = useState<boolean>(false);
  // Fetch private posts
  const { postsPrivate, isPostsPrivateLoading, postsPrivateError } =
    usePrivatePosts(myUserId);

  const iconColorMode = isDarkMode ? darkTheme.text : lightTheme.text;

  // Setup scroll handler to manage page transitions
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const pageIndex = Math.floor(offsetY / height + 0.5);
        setCurrentPage(pageIndex);
        setShowAlternate(pageIndex > 0);
      },
    }
  );

  // Prepare data for FlatList - combine capture view with posts
  const flatListData = [
    { id: "capture", type: "capture" }, // First screen is capture
    ...(postsPrivate || []), // Then add all posts with their original IDs
  ];

  // Function to handle scroll to top when capture button is pressed
  const handleOnTop = (check: boolean) => {
    setOnTopCheck(check);
    if (check && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: 0, animated: true });
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    // Only render components near current page to optimize performance
    if (Math.abs(index - currentPage) > 1) {
      return <View style={{ height }} />;
    }

    // If it's the first item in the list, render Capture
    if (index === 0) {
      return (
        <View style={{ height }}>
          <CapTure />
        </View>
      );
    }

    // Otherwise render the post
    else {
      // For all posts, render the memories view with PostPrivate component
      return (
        <View style={styles.memoriesContainer}>
          <PostPrivate
            userPostResponse={{
              userId: item?.userPostResponse?.userId,
              username: item?.userPostResponse?.username,
              avatar: item?.userPostResponse?.avatar,
              followers: item?.userPostResponse?.followers,
              isFollow: item?.userPostResponse?.isFollow,
              likes: item?.userPostResponse?.likes,
              comments: item?.userPostResponse?.comments,
              like: item?.userPostResponse?.like,
            }}
            id={item?.id || ""}
            caption={item?.caption || ""}
            images={item?.images || []}
            likes={item?.likes || 0}
            comments={item?.comments || 0}
            type={item?.type || ""}
            like={item?.like || false}
            createTime={item?.createTime}
            onTop={handleOnTop}
          />
        </View>
      );
    }
  };

  // Function to navigate to the Memories screen
  const goToMemories = () => {
    if (flatListRef.current && postsPrivate && postsPrivate.length > 0) {
      flatListRef.current.scrollToIndex({ index: 1, animated: true });
    } else {
      // Show alert if no memories available
      Alert.alert("No Memories", "You don't have any memories yet.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Profile", {
              userId: myUserId,
              isFollow: false,
            })
          }
        >
          <FontAwesome
            name="user-circle-o"
            size={buttonFontsize}
            color={iconColorMode}
          />
        </TouchableOpacity>
        <PublicOrPrivate />
        <TouchableOpacity onPress={() => navigation.navigate("ChatList")}>
          <MaterialCommunityIcons
            name="chat"
            size={height * 0.03}
            color={iconColorMode}
          />
        </TouchableOpacity>
      </View>

      {isPostsPrivateLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={iconColorMode} />
          <Text style={[styles.memoriesButtonText, { marginTop: 10 }]}>
            Loading memories...
          </Text>
        </View>
      ) : postsPrivateError ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.memoriesButtonText, { color: "red" }]}>
            Error loading memories
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={flatListData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          snapToInterval={height}
          snapToAlignment="start"
          decelerationRate="fast"
          pagingEnabled
        />
      )}

      {/* Scroll indicator only shown on the first page */}
      {currentPage === 0 && (
        <View style={styles.scrollIndicator}>
          <TouchableOpacity
            onPress={goToMemories}
            style={styles.memoriesButton}
            disabled={!postsPrivate || postsPrivate.length === 0}
          >
            <Text style={styles.memoriesButtonText}>Memories</Text>
            <FontAwesome
              name="angle-down"
              size={buttonFontsize}
              color={iconColorMode}
            />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const getStyles = (isDarkMode: any) => {
  return StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginHorizontal: width * 0.04,
    },
    safeArea: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
    },
    scrollIndicator: {
      position: "absolute",
      bottom: 20,
      left: 0,
      right: 0,
      alignItems: "center",
      opacity: 0.7,
    },
    memoriesButton: {
      alignItems: "center",
      justifyContent: "center",
    },
    memoriesButtonText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginBottom: 5,
      fontSize: width * 0.04,
    },
    // Memories screen styles
    memoriesContainer: {
      flex: 1,
      height: height,
      backgroundColor: backgroundColor,
    },
    memoriesTitle: {
      fontSize: width * 0.07,
      fontWeight: "bold",
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginBottom: height * 0.03,
      textAlign: "center",
    },
    memoryList: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
};

export default PrivateModeScreen;
