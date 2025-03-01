import conversationAPI from "@/api/conversationAPI";
import Chat from "@/components/public/Chat";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

interface MessageProps {
  userIdProp: number;
}

const MessageList: React.FC<MessageProps> = ({ userIdProp }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const decodedToken = await AsyncStorage.getItem("userID");
        if (decodedToken) {
          setUserId(Number(decodedToken));
          console.log("✅ User ID:", decodedToken);
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
    const fetchMessages = async () => {
      try {
        if (!userId) return;

        console.log("📡 Fetching messages for:", userId, userIdProp);
        const response = await conversationAPI.messages(userId, userIdProp);

        if (response?.data) {
          setMessages(response.data);
          console.log("✅ Messages fetched:", response.data);
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy tin nhắn:", error);
      }
    };

    if (userId) {
      fetchMessages();
    }
  }, [userId]); // ✅ Chỉ chạy lại khi `userId` thay đổi

  return (
    <FlatList
      data={messages}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => <Chat {...item} />}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const getStyles = (isDarkMode: any) =>
  StyleSheet.create({
    listContainer: {
      padding: 10,
    },
  });

export default MessageList;
