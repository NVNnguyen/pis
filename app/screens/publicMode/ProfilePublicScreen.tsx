import ProfileHeader from "@/components/public/profileComponent/ProfileHeader";
import { Dimensions, FlatList, View } from "react-native";
import { StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import PostItem from "@/components/public/PostItems";
import { posts } from "@/utils/mockAPI";
import { darkTheme, lightTheme } from "@/utils/themes";

const { width, height } = Dimensions.get("window");
interface HomeProps {
  handleScroll: (event: any) => void;
}
const ProfilePublicScreen = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  return (
    <FlatList
      data={posts} // Dữ liệu danh sách
      keyExtractor={(item) => item.id} // Khóa duy nhất cho mỗi bài viết
      renderItem={({ item }) => <PostItem {...item} />} // Hiển thị bài viết
      showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
      scrollEventThrottle={20} // Tần suất sự kiện cuộn (16ms = 60FPS)
      ListHeaderComponent={<ProfileHeader userId={1} />}
    />
  );
};

const getStyles = (isDarkMode: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
    },
  });

export default ProfilePublicScreen;
