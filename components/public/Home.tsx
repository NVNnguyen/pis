import { FlatList, View, StyleSheet, Alert } from "react-native";
import PostItem from "./PostItems";
import { useEffect, useState } from "react";
import infoAPI from "@/api/userAPI/infoAPI";
import NewPost from "./NewPost";
import { getDecodedToken, getUserId } from "@/utils/decodeToken";
import postApi from "@/api/postsAPI/postsApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

interface HomeProps {
  handleScroll: (event: any) => void;
  navigation: ReturnType<typeof useNavigation>;
  userIdProp: number;
}

const Home = ({ handleScroll, navigation, userIdProp }: HomeProps) => {
  const [userId, setUserId] = useState<number>(0);
  const [avatar, setAvatar] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [posts, setPosts] = useState<any[]>([]);
  // Hàm lấy token và giải mã

  useEffect(() => {
    const fetchUserId = async () => {
      await getUserId();
      const decodedToken = await AsyncStorage.getItem("userID");
      setUserId(Number(decodedToken));
      console.log("User ID:", userId);
    };
    fetchUserId();
  }, []);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!userId || userId === 0) {
          console.warn("User ID không hợp lệ:", userId);
          return;
        }

        console.log("📡 Fetching user info for User ID:", userId);
        const responseUser = await infoAPI.userInfo(userId);

        if (!responseUser.data) {
          console.warn(" Không tìm thấy thông tin user!");
          return;
        }

        setAvatar(responseUser.data?.avatar || "");
        setFirstName(responseUser.data?.firstName || "Unknown");
        setLastName(responseUser.data?.lastName || "User");

        console.log(" User Info Fetched:", responseUser.data);
      } catch (error) {
        console.error(" Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [userId]); // Thêm userId vào dependency để đảm bảo nó được cập nhật đúng

  useEffect(() => {
    const fetchPosts = async () => {
      const responsePosts = await postApi.posts(userId);
      setPosts(responsePosts.data);
      console.log(responsePosts.data);
    };
    fetchPosts();
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        data={posts} // Dữ liệu danh sách
        keyExtractor={(item) => item.id} // Khóa duy nhất cho mỗi bài viết
        renderItem={({ item }) => (
          <PostItem {...item} navigation={navigation} />
        )} // Hiển thị bài viết
        showsVerticalScrollIndicator={false} // Ẩn thanh cuộn  dọc
        onScroll={handleScroll} // Bắt sự kiện cuộn
        scrollEventThrottle={20} // Tần suất sự kiện cuộn (16ms = 60FPS)
        ListHeaderComponent={
          <NewPost userInfo={{ avatar, firstName, lastName }} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Home;
