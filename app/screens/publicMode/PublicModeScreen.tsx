"use client";

import { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import PublicOrPrivate from "@/components/genaral/PublicOrPrivate";
import TabBar from "@/components/public/TabBar/TabBar";
import { backgroundColor } from "@/styles/stylePrimary";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import NewPost from "@/components/public/NewPost";
import useUserInfo from "@/hooks/useUserInfo";
import usePosts from "@/hooks/usePosts";
import PostItem from "@/components/public/Posts";
import usePostStore from "@/stores/usePostStore";
import CreatePostModel from "@/components/public/Modals/CreatePostModal";
import { useMyUserId } from "@/hooks/useMyUserId";
import PostItemSkeleton from "@/Loading/PostItemSkeleton";
import { getToken } from "@/utils/storage";

const { width, height } = Dimensions.get("window");

const PublicModeScreen = () => {
  const tabBarTranslateY = useRef(new Animated.Value(0)).current;
  const publicTogglePaddingTop = useRef(
    new Animated.Value(height * 0.05)
  ).current;
  const currentTranslateY = useRef(0);
  const lastScrollY = useRef(0);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const myUserId = useMyUserId() ?? 0;
  const { userInfo, isUserLoading } = useUserInfo(myUserId);
  const { posts, isPostsLoading, refetch, isFetching } = usePosts(myUserId);
  const { setPosts, postsStore } = usePostStore();
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  useEffect(() => {
    if (
      posts &&
      posts.length > 0 &&
      JSON.stringify(posts) !== JSON.stringify(postsStore)
    ) {
      setPosts(posts);
    }
  }, [posts]);

  useEffect(() => {
    const listener = tabBarTranslateY.addListener((value) => {
      currentTranslateY.current = value.value;
    });
    return () => {
      tabBarTranslateY.removeListener(listener);
    };
  }, [tabBarTranslateY]);

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDifference = currentScrollY - lastScrollY.current;

    if (scrollDifference > 0) {
      const newTranslateY = Math.min(
        height * 0.09,
        currentTranslateY.current + scrollDifference / 2
      );
      Animated.timing(tabBarTranslateY, {
        toValue: newTranslateY,
        duration: 50,
        useNativeDriver: true,
      }).start();

      // Giảm paddingTop của toggle khi cuộn xuống
      Animated.timing(publicTogglePaddingTop, {
        toValue: height * 0.04,
        duration: 50,
        useNativeDriver: false,
      }).start();
    } else if (scrollDifference < 0) {
      const newTranslateY = Math.max(
        0,
        currentTranslateY.current + scrollDifference / 2
      );
      Animated.timing(tabBarTranslateY, {
        toValue: newTranslateY,
        duration: 50,
        useNativeDriver: true,
      }).start();

      // Khôi phục paddingTop khi cuộn lên
      Animated.timing(publicTogglePaddingTop, {
        toValue: height * 0.02,
        duration: 50,
        useNativeDriver: false,
      }).start();
    }

    lastScrollY.current = currentScrollY;
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    if (isPostsLoading || isCreatingPost) {
      return <PostItemSkeleton key={`skeleton-${index}`} />;
    }
    return <PostItem key={item.id} {...item} />;
  };

  const ListHeaderComponent = () => (
    <View style={styles.newPostContainer}>
      <NewPost
        userInfo={{
          avatar: userInfo?.avatar,
          lastName: userInfo?.lastName,
          firstName: userInfo?.firstName,
          userId: userInfo?.id,
          username: userInfo?.username,
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Toggle cố định trên cùng */}
      <Animated.View
        style={[
          styles.fixedToggleContainer,
          { paddingTop: publicTogglePaddingTop },
        ]}
      >
        <PublicOrPrivate />
      </Animated.View>

      {/* Spinner bên dưới toggle */}
      {isFetching && (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="small" color="#999" />
        </View>
      )}

      {/* FlatList */}
      <FlatList
        contentContainerStyle={{ paddingTop: height * 0.09 }}
        data={
          isPostsLoading || isCreatingPost ? Array(5).fill(null) : postsStore
        }
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : `skeleton-${index}`
        }
        renderItem={renderItem}
        ListHeaderComponent={ListHeaderComponent}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={true}
        onEndReachedThreshold={0.3}
        onEndReached={() => {
          // TODO: Implement infinite scroll logic here
        }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshing={isFetching}
        onRefresh={refetch}
      />

      <Animated.View
        style={[
          styles.tabBar,
          { transform: [{ translateY: tabBarTranslateY }] },
        ]}
      >
        <TabBar />
      </Animated.View>

      <CreatePostModel
        openModel={{
          visible: false,
          key: null,
        }}
        onClose={() => {
          setIsCreatingPost(false);
          return { visible: false, key: null };
        }}
        isLoading={setIsCreatingPost}
      />
    </SafeAreaView>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
    },
    fixedToggleContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      alignItems: "center",
      justifyContent: "center",
      paddingBottom: 5,
    },
    tabBar: {
      backgroundColor: backgroundColor,
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      overflow: "hidden",
      paddingBottom: 5,
    },
    spinnerContainer: {
      position: "absolute",
      top: height * 0.08, // căn ngay dưới toggle
      left: 0,
      right: 0,
      alignItems: "center",
      zIndex: 5,
    },
    newPostContainer: {},
  });

export default PublicModeScreen;
