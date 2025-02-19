import conversationAPI from "@/api/conversationAPI";
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

  const renderMessage = ({ item }: { item: any }) => {
    const isOwnMessage = item.userId === userId; // ✅ Kiểm tra đúng userId

    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.myMessage : styles.theirMessage,
        ]}
      >
        {!isOwnMessage && (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        )}

        <View
          style={[
            styles.textContainer,
            isOwnMessage ? styles.myTextContainer : styles.theirTextContainer,
          ]}
        >
          <Text style={styles.messageText}>{item.content}</Text>
          <Text style={styles.messageTime}>{item.createTime}</Text>
          {isOwnMessage && item.status === "SEEN" && (
            <Text style={styles.seenText}>✔ Đã xem</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={messages}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderMessage}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  myMessage: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  theirMessage: {
    alignSelf: "flex-start",
    flexDirection: "row",
  },
  textContainer: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 10,
  },
  myTextContainer: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
  },
  theirTextContainer: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
  },
  messageTime: {
    fontSize: 12,
    color: "#ddd",
    marginTop: 2,
  },
  seenText: {
    fontSize: 12,
    color: "#a0a0a0",
    marginTop: 2,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
});

export default MessageList;
