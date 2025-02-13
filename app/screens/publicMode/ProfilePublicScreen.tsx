import ProfileHeader from "@/components/public/profileComponent/ProfileHeader";
import { Alert, Dimensions, FlatList, View } from "react-native";
import { StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import PostItem from "@/components/public/PostItems";
import { posts } from "@/utils/mockAPI";
import { darkTheme, lightTheme } from "@/utils/themes";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import postApi from "@/api/postsAPI/postsApi";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getUserId } from "@/utils/decodeToken";
import GalleryComponent from "@/components/public/GalleryComponent";
const { width, height } = Dimensions.get("window");
interface HomeProps {
  handleScroll: (event: any) => void;
}

const ProfilePublicScreen = () => {
  const [userId, setUserId] = useState<number>(0);
  // 🟢 Thêm state để theo dõi tab được chọn
  const [selectedTab, setSelectedTab] = useState<"public" | "private">(
    "public"
  );
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const navigation = useNavigation();
  const route = useRoute();
  const userIdProp = route.params as { userId: number }; // Nhận userId từ navigation params
  console.log(userIdProp);
  useEffect(() => {
    const fetchUserId = async () => {
      await getUserId();
      const decodedToken = await AsyncStorage.getItem("userID");
      setUserId(Number(decodedToken));
      console.log("User ID:", userId);
    };
    fetchUserId();
  }, []);

  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const userInfoApi = async () => {
      try {
        const response =
          selectedTab === "public"
            ? await postApi.postsPublic(userIdProp?.userId)
            : await postApi.postsPrivate(userIdProp?.userId);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    userInfoApi();
  }, [userIdProp.userId, selectedTab]); // 🟢 Gọi lại API khi tab thay đổi
  return (
    <View style={styles.container}>
      <FlatList
        data={posts} // Dữ liệu danh sách
        keyExtractor={(item) => item.id} // Khóa duy nhất cho mỗi bài viết
        renderItem={({ item }) => <GalleryComponent {...item} />} // Hiển thị bài viết
        showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
        scrollEventThrottle={20} // Tần suất sự kiện cuộn (16ms = 60FPS)
        ListHeaderComponent={
          <ProfileHeader
            userIdProp={userIdProp.userId}
            setSelectedTab={setSelectedTab}
          />
        }
      />
    </View>
  );
};

const getStyles = (isDarkMode: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
    },
  });
export default ProfilePublicScreen;
