import ChatListItem from "@/components/genaral/chat/ChatList";
import TabBar from "@/components/public/TabBar/TabBar";
import { useTheme } from "@/contexts/ThemeContext";
import useConversation from "@/hooks/useConversation";
import { useMyUserId } from "@/hooks/useMyUserId";
import ChatListSkeletons from "@/Loading/ChatListSkeletons";
import { textFontSize } from "@/styles/stylePrimary";
import { darkTheme, lightTheme } from "@/utils/themes";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";

const ChatListScreen = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const navigation = useNavigation();
  const myUserId = Number(useMyUserId());
  console.log(myUserId);
  const { conversation, isConversationLoading, conversationError } =
    useConversation(myUserId);

  console.log("conversation: ", conversation);

  return (
    <View style={styles.container}>
      {isConversationLoading ? (
        <FlatList
          data={Array.from({ length: 10 })}
          keyExtractor={(_, index) => index.toString()}
          renderItem={() => <ChatListSkeletons />}
          contentContainerStyle={styles.chatLoadingCentered}
        />
      ) : conversation?.length === 0 || conversationError ? (
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
    chatLoading: {
      flex: 1,
    },
    chatLoadingCentered: {
      flexGrow: 1,

      paddingVertical: 16,
    },
  });

export default ChatListScreen;
