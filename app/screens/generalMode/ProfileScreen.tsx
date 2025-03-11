"use client";

import { useState, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRoute, type RouteProp } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import ProfileHeader from "@/components/public/profileComponent/ProfileHeader";
import TabBar from "@/components/public/TabBar/TabBar";
import postsAPI from "@/api/postsAPI";
import { darkTheme, lightTheme } from "@/utils/themes";
import Gallery from "@/components/public/Gallery";
import Posts from "@/components/public/Posts";
import { fontWeight } from "@/styles/stylePrimary";
import PostItemSkeleton from "@/Loading/PostItemSkeleton";
import GallerySkeleton from "@/Loading/GallerySkeleton";
import React from "react";

const { width, height } = Dimensions.get("window");

type ProfileRouteParams = {
  Profile: {
    userId: string;
    isFollow: boolean;
  };
};

// Memoized Posts component
const MemoizedPosts = React.memo(Posts);

// Memoized Gallery component
const MemoizedGallery = React.memo(Gallery);

const ProfileScreen = () => {
  const [selectedTab, setSelectedTab] = useState<"public" | "private">(
    "public"
  );
  const { isDarkMode } = useTheme();
  const styles = useMemo(() => getStyles(isDarkMode), [isDarkMode]);
  const route = useRoute<RouteProp<ProfileRouteParams, "Profile">>();
  const userIdProp = Number(route?.params?.userId);
  const isFollow = route?.params?.isFollow;

  // Fetch dữ liệu cho cả hai tab trước
  const {
    data: publicPosts,
    isLoading: isLoadingPublic,
    error: errorPublic,
  } = useQuery({
    queryKey: ["postsProfile", userIdProp, "public"],
    queryFn: () => postsAPI.postsPublic(userIdProp),
    enabled: !!userIdProp,
  });

  const {
    data: privatePosts,
    isLoading: isLoadingPrivate,
    error: errorPrivate,
  } = useQuery({
    queryKey: ["postsProfile", userIdProp, "private"],
    queryFn: () => postsAPI.postsPrivate(userIdProp),
    enabled: !!userIdProp,
  });

  // Memoize dữ liệu dựa trên selectedTab
  const posts = useMemo(
    () => (selectedTab === "public" ? publicPosts?.data : privatePosts?.data),
    [selectedTab, publicPosts, privatePosts]
  );
  const isLoading = useMemo(
    () => (selectedTab === "public" ? isLoadingPublic : isLoadingPrivate),
    [selectedTab, isLoadingPublic, isLoadingPrivate]
  );
  const error = useMemo(
    () => (selectedTab === "public" ? errorPublic : errorPrivate),
    [selectedTab, errorPublic, errorPrivate]
  );

  // Hàm render item cho Post
  const renderPostItem = useCallback(
    ({ item }: any) => (
      <MemoizedPosts
        userPostResponse={{
          userId: item?.userId,
          username: item?.userPostResponse?.username,
          avatar: item?.userPostResponse?.avatar,
          followers: item?.userPostResponse?.followers,
          isFollow: isFollow,
          likes: item?.likes,
          comments: item?.comments,
          like: item?.like,
        }}
        id={item?.id}
        caption={item?.caption}
        images={item?.images}
        likes={item?.likes}
        comments={item?.comments}
        type={item?.type}
        like={item?.like}
        createTime={item?.createTime}
      />
    ),
    [isFollow]
  );

  // Hàm render item cho Gallery
  const renderGalleryItem = useCallback(
    ({ item }: any) => (
      <View style={styles.galleryItem}>
        <MemoizedGallery
          userPostResponse={{
            userId: item?.userId,
            username: item?.userPostResponse?.username,
            avatar: item?.userPostResponse?.avatar,
            followers: item?.userPostResponse?.followers,
            isFollow: isFollow,
            likes: item?.likes,
            comments: item?.comments,
            like: item?.like,
          }}
          id={item?.id}
          caption={item?.caption}
          images={item?.images}
          likes={item?.likes}
          comments={item?.comments}
          type={item?.type}
          like={item?.like}
          createTime={item?.createTime}
        />
      </View>
    ),
    [isFollow, styles.galleryItem]
  );

  // Memoize toàn bộ nội dung render
  const renderContent = useMemo(() => {
    // Trường hợp đang loading
    if (isLoading) {
      return (
        <FlatList
          key={`loading-${selectedTab}`} // Key thay đổi dựa trên selectedTab
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
          renderItem={() =>
            selectedTab === "public" ? (
              <PostItemSkeleton />
            ) : (
              <GallerySkeleton />
            )
          }
          keyExtractor={(item) => `skeleton-${item}`}
          numColumns={selectedTab === "private" ? 3 : 1} // Số cột thay đổi
          ListHeaderComponent={
            <ProfileHeader
              userIdProp={userIdProp}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          }
        />
      );
    }

    // Trường hợp có lỗi
    if (error) {
      return <Text style={styles.errorText}>Error loading posts</Text>;
    }

    return (
      <FlatList
        key={`posts-${selectedTab}`} // Key thay đổi dựa trên selectedTab
        data={posts || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={
          selectedTab === "public" ? renderPostItem : renderGalleryItem
        }
        numColumns={selectedTab === "private" ? 3 : 1} // Số cột thay đổi
        columnWrapperStyle={
          selectedTab === "private" ? styles.columnWrapper : undefined
        }
        ListHeaderComponent={
          <ProfileHeader
            userIdProp={userIdProp}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        }
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={20}
        ListEmptyComponent={
          <Text style={styles.txtNoPosts}>No posts yet!</Text>
        }
      />
    );
  }, [
    isLoading,
    error,
    posts,
    selectedTab,
    renderPostItem,
    renderGalleryItem,
    styles,
    userIdProp,
    setSelectedTab,
  ]);

  return (
    <View style={styles.container}>
      {renderContent}
      <TabBar />
    </View>
  );
};

// Bọc component trong React.memo để tối ưu hóa
export default React.memo(ProfileScreen);

// Hàm tạo styles
const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
    },
    txtNoPosts: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: width * 0.05,
      fontWeight: fontWeight,
    },
    galleryItem: {
      width: (width - 4 * 4) / 3,
      height: (width - 4 * 4) / 3,
      margin: 2,
      overflow: "hidden",
      borderRadius: 8,
    },
    errorText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: width * 0.04,
      textAlign: "center",
      marginTop: height * 0.02,
    },
    columnWrapper: {
      justifyContent: "space-between",
    },
  });
