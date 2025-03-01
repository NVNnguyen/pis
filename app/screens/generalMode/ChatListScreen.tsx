import conversationAPI from "@/api/conversationAPI";
import ChatListItem from "@/components/public/ChatList";
import TabBar from "@/components/public/TabBar/TabBar";
import { useTheme } from "@/contexts/ThemeContext";
import { getMyUserId } from "@/hooks/getMyUserID";
import { darkTheme, lightTheme } from "@/utils/themes";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";

const ChatListScreen = () => {
  const [conversation, setConversation] = useState<any[]>([]);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const navigation = useNavigation();
  const myUserId = getMyUserId();
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        if (!myUserId || myUserId === 0) {
          console.warn("❌ User ID không hợp lệ:", myUserId);
          return;
        }

        console.log("📡 Fetching conversations for User ID:", myUserId);
        const conversationResponse = await conversationAPI.conversations(
          myUserId
        );
        setConversation(conversationResponse?.data || []);
        console.log("✅ Conversations fetched:", conversationResponse.data);
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách cuộc hội thoại:", error);
      }
    };

    if (myUserId) {
      fetchConversations();
    }
  }, [myUserId]); // useEffect chỉ chạy khi userId thay đổi

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
          renderItem={({ item }) => <ChatListItem chat={item} />}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
