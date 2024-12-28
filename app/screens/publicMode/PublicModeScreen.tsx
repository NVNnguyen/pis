import PublicOrPrivate from "@/components/genaral/PublicOrPrivate";
import PostItem from "@/components/public/PostItems";
import TabBar from "@/components/public/TabBar";
import React from "react";
import { View, StyleSheet, FlatList } from "react-native";

const PublicModeScreen = () => {
  const posts = [
    {
      id: "1",
      user: {
        username: "20thang7_n",
        time: "11h",
        avatar: "https://via.placeholder.com/40",
      },
      caption: "Dear 2025 i am ready. 🌸",
      images: [
        "https://via.placeholder.com/300",
        "https://via.placeholder.com/300",
      ],
      likes: 80,
      comments: 4,
      shares: 1,
    },
    {
      id: "2",
      user: {
        username: "user_2",
        time: "10h",
        avatar: "https://via.placeholder.com/40",
      },
      caption: "A new day, a new beginning. ☀️",
      images: [
        "https://via.placeholder.com/300",
        "https://via.placeholder.com/300",
      ],
      likes: 120,
      comments: 10,
      shares: 5,
    },
    // Thêm nhiều bài viết hơn nếu cần
  ];
  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <PublicOrPrivate />
      </View>
      <FlatList
        data={posts} // Dữ liệu danh sách
        keyExtractor={(item) => item.id} // Khóa duy nhất cho mỗi bài viết
        renderItem={({ item }) => <PostItem {...item} />} // Hiển thị bài viết
        showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
      />
      <TabBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
    padding: 10,
  },
  toggleContainer: {
    alignItems: "center", // Căn giữa theo chiều ngang
    justifyContent: "center", // Căn giữa theo chiều dọc
    marginBottom: 20, // Thêm khoảng cách với nội dung phía dưới
    marginTop: 30,
  },
});

export default PublicModeScreen;
