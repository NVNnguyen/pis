import { FlatList, View, StyleSheet } from "react-native";
import PostItem from "./PostItems";
import { posts } from "@/utils/mockAPI";

interface HomeProps {
  handleScroll: (event: any) => void;
}
const Home = ({ handleScroll }: HomeProps) => {

  return (
    <View style={styles.container}>
      <FlatList
        data={posts} // Dữ liệu danh sách
        keyExtractor={(item) => item.id} // Khóa duy nhất cho mỗi bài viết
        renderItem={({ item }) => <PostItem {...item} />} // Hiển thị bài viết
        showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
        onScroll={handleScroll} // Bắt sự kiện cuộn
        scrollEventThrottle={20} // Tần suất sự kiện cuộn (16ms = 60FPS)
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
