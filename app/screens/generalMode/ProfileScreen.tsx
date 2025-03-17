"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import {
  useRoute,
  useFocusEffect,
  useNavigation,
  RouteProp,
} from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import ProfileHeader from "@/components/public/profileComponent/ProfileHeader";
import TabBar from "@/components/public/TabBar/TabBar";
import postsAPI from "@/api/postsAPI";
import { darkTheme, lightTheme } from "@/utils/themes";
import { fontWeight } from "@/styles/stylePrimary";
import PostItemSkeleton from "@/Loading/PostItemSkeleton";
import GallerySkeleton from "@/Loading/GallerySkeleton";
import Posts from "@/components/public/Posts";
import Gallery from "@/components/public/Gallery";
import MediaModal from "@/components/public/Modals/MediaModal";
import { useMyUserId } from "@/hooks/useMyUserId"; // Hook để lấy userId của người dùng hiện tại
import React from "react";

const { width, height } = Dimensions.get("window");

type ProfileRouteParams = {
  Profile: {
    userId?: string; // userId có thể không có khi vào profile cá nhân
    isFollow?: boolean;
  };
};

// Memoized components
const MemoizedPosts = React.memo(Posts);
const MemoizedGallery = React.memo(Gallery);

const ProfileScreen = () => {
  const route = useRoute<RouteProp<ProfileRouteParams, "Profile">>();
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const styles = useMemo(() => getStyles(isDarkMode), [isDarkMode]);
  const myUserId = useMyUserId(); // Lấy userId của người dùng hiện tại
  const [selectedTab, setSelectedTab] = useState<"public" | "private">(
    "public"
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [mediaData, setMediaData] = useState<{
    mediaType: "photo" | "voice";
    mediaItems: any[];
    initialIndex?: number;
  } | null>(null);

  // Xác định userId dựa trên route.params hoặc fallback về myUserId
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Fetch dữ liệu cho cả hai tab trước
  const {
    data: publicPosts,
    isLoading: isLoadingPublic,
    error: errorPublic,
  } = useQuery({
    queryKey: ["postsProfile", currentUserId, "public"],
    queryFn: () => postsAPI.postsPublic(currentUserId!),
    enabled: !!currentUserId,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: privatePosts,
    isLoading: isLoadingPrivate,
    error: errorPrivate,
  } = useQuery({
    queryKey: ["postsProfile", currentUserId, "private"],
    queryFn: () => postsAPI.postsPrivate(currentUserId!),
    enabled: !!currentUserId,
    staleTime: 1000 * 60 * 5,
  });

  // Memoize dữ liệu dựa trên selectedTab
  const posts = useMemo(
    () =>
      (selectedTab === "public" ? publicPosts?.data : privatePosts?.data) || [],
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
    ({ item }: { item: any }) => (
      <MemoizedPosts
        userPostResponse={{
          userId: item?.userPostResponse?.userId,
          username: item?.userPostResponse?.username,
          avatar: item?.userPostResponse?.avatar,
          followers: item?.userPostResponse?.followers,
          isFollow: item?.userPostResponse?.isFollow,
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
    []
  );

  // Hàm render item cho Gallery với callback để mở modal
  const renderGalleryItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <View style={styles.galleryItem}>
        <MemoizedGallery
          userPostResponse={{
            userId: item?.userId,
            username: item?.userPostResponse?.username,
            avatar: item?.userPostResponse?.avatar,
            followers: item?.userPostResponse?.followers,
            isFollow: item?.userPostResponse?.isFollow,
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
          onPress={() => {
            setModalVisible(true);
            setMediaData({
              mediaType: item.type === "Image" ? "photo" : "voice",
              mediaItems: [item],
              initialIndex: 0,
            });
          }}
        />
      </View>
    ),
    [styles.galleryItem]
  );

  // Reset userId khi màn hình được focus lại
  useFocusEffect(
    useCallback(() => {
      const routeUserId = route?.params?.userId
        ? Number(route?.params?.userId)
        : null;
      if (routeUserId) {
        setCurrentUserId(routeUserId); // Sử dụng userId từ route nếu có
      } else {
        setCurrentUserId(myUserId); // Fallback về userId của chính mình
      }
    }, [route?.params?.userId, myUserId])
  );

  // Memoize toàn bộ nội dung render
  const renderContent = useMemo(() => {
    const skeletonData = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    if (error) {
      return <Text style={styles.errorText}>Error loading posts</Text>;
    }

    return (
      <FlatList
        key={`flatlist-${selectedTab}`}
        data={isLoading ? skeletonData : posts}
        keyExtractor={(item) =>
          isLoading ? `skeleton-${item}` : item.id.toString()
        }
        renderItem={({ item, index }) =>
          isLoading ? (
            selectedTab === "public" ? (
              <PostItemSkeleton />
            ) : (
              <GallerySkeleton />
            )
          ) : selectedTab === "public" ? (
            renderPostItem({ item })
          ) : (
            renderGalleryItem({ item, index })
          )
        }
        numColumns={selectedTab === "private" ? 3 : 1}
        columnWrapperStyle={
          selectedTab === "private" ? styles.columnWrapper : undefined
        }
        ListHeaderComponent={
          <ProfileHeader
            userIdProp={currentUserId || 0}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        }
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={20}
        ListEmptyComponent={
          !isLoading && !posts?.length ? (
            <Text style={styles.txtNoPosts}>No posts yet!</Text>
          ) : null
        }
        contentContainerStyle={styles.contentContainer}
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
    currentUserId,
    setSelectedTab,
  ]);

  return (
    <View style={styles.container}>
      {renderContent}
      <TabBar />
      <MediaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        mediaType={mediaData?.mediaType || "photo"}
        mediaItems={mediaData?.mediaItems || []}
        initialIndex={mediaData?.initialIndex || 0}
      />
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
      marginTop: "50%",
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
    contentContainer: {
      flexGrow: 1,
    },
  });
