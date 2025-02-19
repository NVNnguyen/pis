import conversationAPI from "@/api/conversationAPI";
import ChatListItem from "@/components/public/ChatList";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";

const ChatListScreen = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [conversation, setConversation] = useState<any[]>([]);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const decodedToken = await AsyncStorage.getItem("userID");
        if (decodedToken) {
          setUserId(Number(decodedToken));
          console.log("User ID:", decodedToken);
        } else {
          console.warn("❌ Không tìm thấy userID trong AsyncStorage!");
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy userID:", error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        if (!userId || userId === 0) {
          console.warn("❌ User ID không hợp lệ:", userId);
          return;
        }

        console.log("📡 Fetching conversations for User ID:", userId);
        const conversationResponse = await conversationAPI.conversations(
          userId
        );
        setConversation(conversationResponse?.data || []);
        console.log("✅ Conversations fetched:", conversationResponse.data);
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách cuộc hội thoại:", error);
      }
    };

    if (userId) {
      fetchConversations();
    }
  }, [userId]); // useEffect chỉ chạy khi userId thay đổi

  return (
    <View style={styles.container}>
      {conversation.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không có tin nhắn nào</Text>
        </View>
      ) : (
        <FlatList
          data={conversation}
          keyExtractor={(chat) => chat.id.toString()}
          renderItem={({ item }) => (
            <ChatListItem chat={item} navigation={navigation} />
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
    listContainer: {
      flexGrow: 1, // Đảm bảo danh sách có thể cuộn
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyText: {
      fontSize: 18,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
  });

export default ChatListScreen;
