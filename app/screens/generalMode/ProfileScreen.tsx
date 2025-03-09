import ProfileHeader from "@/components/public/profileComponent/ProfileHeader";
import { Dimensions, FlatList, View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import TabBar from "@/components/public/TabBar/TabBar";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/genaral/loading/Loading";
import postsAPI from "@/api/postsAPI";
import { darkTheme, lightTheme } from "@/utils/themes";
import Gallery from "@/components/public/Gallery";
import { fontWeight } from "@/styles/stylePrimary";
import Posts from "@/components/public/Posts";
import { getMyUserId } from "@/hooks/getMyUserID";

const { width, height } = Dimensions.get("window");
type ProfileRouteParams = {
  Profile: {
    userId: string;
    isFollow: boolean;
  };
};

const ProfileScreen = () => {
  const [selectedTab, setSelectedTab] = useState<"public" | "private">(
    "public"
  );
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const route = useRoute<RouteProp<ProfileRouteParams, "Profile">>();
  const userIdProp = Number(route?.params?.userId);
  const isFollow = route?.params?.isFollow;

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

  const posts =
    selectedTab === "public" ? publicPosts?.data : privatePosts?.data;
  const isLoading =
    selectedTab === "public" ? isLoadingPublic : isLoadingPrivate;
  const error = selectedTab === "public" ? errorPublic : errorPrivate;

  return (
    <View style={styles.container}>
      {/* PUBLIC LIST */}
      <View
        style={[
          styles.flatListWrapper,
          { display: selectedTab === "public" ? "flex" : "none" },
        ]}
      >
        <FlatList
          data={publicPosts?.data || []}
          keyExtractor={(item) => item.id.toString()}
          numColumns={1}
          renderItem={({ item }) => (
            <Posts
              userPostResponse={{
                userId: item?.userId,
                username: item?.userPostResponse?.username,
                avatar: item?.userPostResponse?.avatar,
                followers: item?.userPostResponse?.followers,
                isFollow: isFollow,
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
          )}
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
      </View>

      {/* PRIVATE LIST */}
      <View
        style={[
          styles.flatListWrapper,
          { display: selectedTab === "private" ? "flex" : "none" },
        ]}
      >
        <FlatList
          data={privatePosts?.data || []}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <View style={styles.galleryItem}>
              <Gallery
                userPostResponse={{
                  userId: item?.userId,
                  username: item?.userPostResponse?.username,
                  avatar: item?.userPostResponse?.avatar,
                  followers: item?.userPostResponse?.followers,
                  isFollow: isFollow,
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
          )}
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
      </View>

      <TabBar />
    </View>
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
      width: (width - 4 * 4) / 3, // padding 4 ở giữa mỗi ảnh (hoặc 3 nếu bạn muốn sát hơn)
      height: (width - 4 * 4) / 3,
      margin: 2,
      overflow: "hidden",
      borderRadius: 8, // tuỳ chọn nếu bạn muốn bo góc
    },
    flatListWrapper: {
      flex: 1,
    },
  });

export default ProfileScreen;
