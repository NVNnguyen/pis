import { FlatList, View, StyleSheet, Alert } from "react-native";
import PostItem from "./PostItems";
import { useEffect, useState } from "react";
import infoAPI from "@/api/userAPI/infoAPI";
import NewPost from "./NewPost";
import { getDecodedToken, getUserId } from "@/utils/decodeToken";
import postApi from "@/api/postsAPI/postsApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface HomeProps {
  handleScroll: (event: any) => void;
}

const Home = ({ handleScroll }: HomeProps) => {
  const [userId, setUserId] = useState<number>(0);
  const [avatar, setAvatar] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  // Hàm lấy token và giải mã

  useEffect(() => {
    const fetchUserId = async () => {
      const decodedToken = await AsyncStorage.getItem("userID");
      const userID = Number(decodedToken);
      setUserId(userID);
      console.log("User ID:", userId);
    };
    fetchUserId();
  }, []);
  const userInfoApi = async () => {
    try {
      console.log("User ID:", userId);
      const response = await infoAPI.userInfo(userId);
      setAvatar(response.data?.avatar);
      setFirstName(response.data?.firstName);
      setLastName(response.data?.lastName);
      console.log("Avatar:", avatar);
      console.log("First Name:", firstName);
      console.log("Last Name:", lastName);
      console.log("Response:", response);
      return response;
    } catch (error) {
      console.error("Error call api", error);
    }
  };
  userInfoApi();
  const [posts, setPosts] = useState<any[]>([]);

  const postsApi = async () => {
    try {
      const response = await postApi.posts(userId);
      setPosts(response.data);
      console.log("Posts:", response);
      return response;
    } catch (error) {
      console.error("Error call api", error);
    }
  };

  useEffect(() => {
    postsApi();
  }, [userId]);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts} // Dữ liệu danh sách
        keyExtractor={(item) => item.id} // Khóa duy nhất cho mỗi bài viết
        renderItem={({ item }) => <PostItem {...item} />} // Hiển thị bài viết
        showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
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
