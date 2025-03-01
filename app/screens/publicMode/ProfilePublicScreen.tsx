import ProfileHeader from "@/components/public/profileComponent/ProfileHeader";
import { Dimensions, FlatList, View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import TabBar from "@/components/public/TabBar/TabBar";
import { getDecodedToken } from "@/utils/decodeToken";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/genaral/loading/Loading";
import postsAPI from "@/api/postsAPI";
import { darkTheme, lightTheme } from "@/utils/themes";
import Gallery from "@/components/public/Gallery";
import { fontWeight } from "@/styles/color";
import Posts from "@/components/public/Posts";

const { width, height } = Dimensions.get("window");

const ProfilePublicScreen = () => {
  const [userId, setUserId] = useState<number>(0);
  const [selectedTab, setSelectedTab] = useState<"public" | "private">(
    "public"
  );
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const route = useRoute();
  const userIdProp = route?.params as { userId: number };

  useEffect(() => {
    const fetchUserId = async () => {
      await getDecodedToken();
      const decodedToken = await AsyncStorage.getItem("userID");
      setUserId(Number(decodedToken));
    };
    fetchUserId();
  }, []);

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["postsProfile", userIdProp?.userId, selectedTab], // Thêm selectedTab vào queryKey
    queryFn: async () => {
      return selectedTab === "public"
        ? await postsAPI.postsPublic(userIdProp?.userId)
        : await postsAPI.postsPrivate(userIdProp?.userId);
    },
    enabled: !!userIdProp,
    staleTime: 60 * 60 * 3,
  });

  return (
    <View style={styles.container}>
      {isLoading || (error && <Loading isLoading={isLoading} error={error} />)}
      <FlatList
        data={posts?.data || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) =>
          selectedTab === "public" ? <Posts {...item} /> : <Gallery {...item} />
        }
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={20}
        ListHeaderComponent={
          <ProfileHeader
            userIdProp={userIdProp.userId}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab} // Truyền setSelectedTab xuống ProfileHeader
          />
        }
        ListEmptyComponent={
          <Text style={styles.txtNoPosts}>No posts yet!</Text>
        }
      />
      <TabBar />
    </View>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
    },
    txtNoPosts: {
      flex: 1, // Chiếm toàn bộ không gian có sẵn
      justifyContent: "center", // Căn giữa theo chiều dọc
      alignItems: "center", // Căn giữa theo chiều ngang
      textAlign: "center", // Căn giữa chữ
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: width * 0.05,
      fontWeight: fontWeight, // Tăng kích thước chữ để dễ đọc hơn
    },
  });

export default ProfilePublicScreen;
