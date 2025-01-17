import ProfileHeader from "@/components/public/profileComponent/ProfileHeader";
import { Dimensions, FlatList, View } from "react-native";
import { StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import PostItem from "@/components/public/PostItems";
import { posts } from "@/utils/mockAPI";
import { darkTheme, lightTheme } from "@/utils/themes";

const { width, height } = Dimensions.get("window");

const ProfilePublicScreen = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => (
        <PostItem
          user={{ avatar: item.user.avatar, username: item.user.username }}
          caption={item.caption}
          images={item.images}
          likes={item.likes}
          comments={item.comments}
          shares={item.shares}
          time={item.time}
        />
      )}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={<ProfileHeader />} // Add the ProfileHeader as the list header
      contentContainerStyle={styles.container}
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
