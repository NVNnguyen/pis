import { FlatList, View, StyleSheet } from "react-native";
import PostItem from "./Posts";
import { useNavigation } from "@react-navigation/native";
import NewPost from "./NewPost";
import { useQuery } from "@tanstack/react-query";
import infoAPI from "@/api/infoAPI";
import Loading from "../genaral/loading/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import postsAPI from "@/api/postsAPI";

interface HomeProps {
  handleScroll: (event: any) => void;
  userIdProp: number;
}

const Home = ({ handleScroll, userIdProp }: HomeProps) => {
  const navigation = useNavigation();

  // Fetch user info
  const {
    data: userInfo,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ["userInfo", userIdProp],
    queryFn: async () => {
      if (!userIdProp) throw new Error("User ID invalid!");
      console.log("📡 Fetching user info for User ID:", userIdProp);
      const response = await infoAPI.userInfo(userIdProp);
      if (!response.data) throw new Error("UserIfo not found!");
      return response.data;
    },
    staleTime: 1000 * 60 * 3,
  });
  useEffect(() => {
    const saveUserId = async () => {
      if (!userInfo?.id) return; // Kiểm tra userId có giá trị không

      try {
        await AsyncStorage.setItem("userID", userInfo?.id.toString());
        console.log("✅ Save userId success");
      } catch (error) {
        console.error("❌ Error saving userID:", error);
      }
    };

    saveUserId(); // Gọi hàm ngay lập tức khi `userId` thay đổi
  }, [userInfo?.id]);

  // Fetch posts
  const {
    data: posts,
    isLoading: isPostsLoading,
    error: postsError,
  } = useQuery({
    queryKey: ["posts", userIdProp],
    queryFn: async () => {
      const response = await postsAPI.posts(userIdProp);
      return response.data;
    },
    enabled: !!userIdProp,
    staleTime: 1000 * 60 * 3,
  });

  return (
    <View style={styles.container}>
      {isUserLoading ||
        (userError && <Loading isLoading={isUserLoading} error={userError} />)}
      {isPostsLoading ||
        (postsError && <Loading isLoading={isUserLoading} error={userError} />)}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostItem {...item} navigation={navigation} />
        )}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={20}
        ListHeaderComponent={
          <NewPost
            userInfo={{
              avatar: userInfo?.avatar,
              firstName: userInfo?.firstName,
              lastName: userInfo?.lastName,
              userId: userIdProp,
            }}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default Home;
