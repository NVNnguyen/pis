import conversationAPI from "@/api/conversationAPI";
import ChatListItem from "@/components/genaral/chat/ChatList";
import TabBar from "@/components/public/TabBar/TabBar";
import { useTheme } from "@/contexts/ThemeContext";
import { getMyUserId } from "@/hooks/getMyUserID";
import useConversation from "@/hooks/useConversation";
import { textFontSize } from "@/styles/stylePrimary";
import { darkTheme, lightTheme } from "@/utils/themes";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";

const ChatListScreen = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const navigation = useNavigation();
  const myUserId = getMyUserId();
  const { conversation, isConversationLoading, conversationError } =
    useConversation(myUserId ?? 0);

  return (
    <View style={styles.container}>
      {conversation?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Not message yet!</Text>
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
      fontSize: textFontSize,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
  });

export default ChatListScreen;
