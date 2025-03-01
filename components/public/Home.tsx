import { FlatList, View, StyleSheet } from "react-native";
import PostItem from "./Posts";
import { useNavigation } from "@react-navigation/native";
import NewPost from "./NewPost";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import useUserInfo from "@/hooks/useUserInfo";
import usePosts from "@/hooks/usePosts";
interface HomeProps {
  handleScroll: (event: any) => void;
  userIdProp: number;
}

const Home = ({ handleScroll, userIdProp }: HomeProps) => {
  const navigation = useNavigation();
  // Fetch user info
  const { userInfo, isUserLoading, userError } = useUserInfo(userIdProp);
  console.log("userIfo at Homepage: ", userInfo);
  const { posts, isPostsLoading, postsError } = usePosts(userIdProp);
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

  return (
    <View style={styles.container}>
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
