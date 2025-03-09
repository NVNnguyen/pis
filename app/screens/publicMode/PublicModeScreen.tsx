import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  FlatList,
  Text,
} from "react-native";
import PublicOrPrivate from "@/components/genaral/PublicOrPrivate";
import TabBar from "@/components/public/TabBar/TabBar";
import { backgroundColor } from "@/styles/stylePrimary";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getMyUserId } from "@/hooks/getMyUserID";
import NewPost from "@/components/public/NewPost";
import useUserInfo from "@/hooks/useUserInfo";
import usePosts from "@/hooks/usePosts";
import PostItem from "@/components/public/Posts";
import usePostStore from "@/stores/usePostStore";
import CreatePostModel from "@/components/public/Modals/CreatePostModal";
import PostsSkeleton from "@/Loading/PostsSkeleton";

const { width, height } = Dimensions.get("window");

const PublicModeScreen = () => {
  const tabBarTranslateY = useRef(new Animated.Value(0)).current;
  const currentTranslateY = useRef(0);
  const lastScrollY = useRef(0);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const myUserId = getMyUserId() ?? 0;
  const { userInfo, isUserLoading, userError } = useUserInfo(myUserId);
  const { posts, isPostsLoading, postsError } = usePosts(myUserId);
  const { setPosts, postsStore } = usePostStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      posts &&
      posts.length > 0 &&
      JSON.stringify(posts) !== JSON.stringify(postsStore)
    ) {
      console.log("Updating Zustand store with new posts:", posts);
      setPosts(posts);
    }
  }, [posts, postsStore]); // Lắng nghe cả postsStore để tránh cập nhật không cần thiết
  // 🚀 Chỉ chạy khi `posts` thay đổi

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
      // Cuộn xuống (ẩn dần TabBar)
      const newTranslateY = Math.min(
        height * 0.09,
        currentTranslateY.current + scrollDifference / 2
      );
      Animated.timing(tabBarTranslateY, {
        toValue: newTranslateY,
        duration: 50,
        useNativeDriver: true,
      }).start();
    } else if (scrollDifference < 0) {
      // Cuộn lên (hiện dần TabBar)
      const newTranslateY = Math.max(
        0,
        currentTranslateY.current + scrollDifference / 2
      );
      Animated.timing(tabBarTranslateY, {
        toValue: newTranslateY,
        duration: 50,
        useNativeDriver: true,
      }).start();
    }

    lastScrollY.current = currentScrollY; // Cập nhật vị trí cuộn hiện tại
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.toggleContainer}>
        <PublicOrPrivate />
      </View>

      <FlatList
        data={isPostsLoading ? Array(5).fill(null) : postsStore}
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : index.toString()
        }
        renderItem={({ item }) =>
          isPostsLoading ? <PostsSkeleton /> : <PostItem {...item} />
        }
        initialNumToRender={5} // Render 5 item đầu tiên
        maxToRenderPerBatch={5} // Mỗi batch render thêm 5 item
        windowSize={10} // Giữ 10 item xung quanh trong bộ nhớ (5 trước, 5 sau)
        removeClippedSubviews={true} // Tối ưu RAM, loại bỏ item ngoài màn hình
        onEndReachedThreshold={0.3} // Gần cuối danh sách 30% thì gọi onEndReached
        onEndReached={() => {
          // TODO: Load thêm dữ liệu ở đây nếu bạn muốn vô hạn (infinite scroll)
        }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={20}
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
        onClose={() => ({ visible: false, key: null })}
        isLoading={setLoading}
      />
    </SafeAreaView>
  );
};

const getStyles = (isDarkMode: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background, // Màu nền
    },
    toggleContainer: {
      alignItems: "center", // Căn giữa theo chiều ngang
      justifyContent: "center", // Căn giữa theo chiều dọc
      paddingTop: height * 0.04, // Responsive padding (2% chiều cao)
      paddingBottom: height * 0.02, // Responsive padding (1% chiều cao)
    },
    tabBar: {
      backgroundColor: backgroundColor, // Màu nền
      position: "absolute", // Đặt TabBar cố định
      bottom: 0,
      left: 0,
      right: 0,
      overflow: "hidden", // Ẩn phần nội dung vượt quá chiều cao
    },
  });

export default PublicModeScreen;
