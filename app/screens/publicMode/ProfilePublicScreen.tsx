import ProfileHeader from "@/components/public/profileComponent/ProfileHeader";
import { Alert, Dimensions, FlatList, View } from "react-native";
import { StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { posts } from "@/utils/mockAPI";
import { darkTheme, lightTheme } from "@/utils/themes";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import GalleryComponent from "@/components/public/Gallery";
import TabBar from "@/components/public/TabBar/TabBar";
import { getDecodedToken } from "@/utils/decodeToken";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/genaral/loading/Loading";
import postsAPI from "@/api/postsAPI";



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
  const userIdProp = route?.params as { userId: number }; // Nhận userId từ navigation params
  useEffect(() => {
    const fetchUserId = async () => {
      await getDecodedToken();
      const decodedToken = await AsyncStorage.getItem("userID");
      setUserId(Number(decodedToken));
    };
    fetchUserId();
  }, [getDecodedToken]);

  const [posts, setPosts] = useState<any[]>([]);

  const {
    data: userInfo,
    isLoading: isLoading,
    error: error,
  } = useQuery({
    queryKey: ["profileAPI", userIdProp?.userId],
    queryFn: async () => {
      const response =
        selectedTab === "public"
          ? await postsAPI.postsPublic(userIdProp?.userId)
          : await postsAPI.postsPrivate(userIdProp?.userId);
      setPosts(response.data);
      return response.data;
    },
    enabled: !!userIdProp,
  });

  console.log("user info ", userInfo);

  return (
    <View style={styles.container}>
      {isLoading || (error && <Loading isLoading={isLoading} error={error} />)}
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
      <TabBar />
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
