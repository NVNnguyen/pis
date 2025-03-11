import Block from "@/components/private/Block";
import useBlockList from "@/hooks/useBlockList";
import { useMyUserId } from "@/hooks/useMyUserId";
import { FriendType } from "@/utils/types/FriendType";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { darkTheme, lightTheme } from "@/utils/themes";
import { useTheme } from "@/contexts/ThemeContext";

const BlockListScreen = () => {
  const myUserId = Number(useMyUserId());
  const { listBlock, isListBlockLoading, isListBlockError } =
    useBlockList(myUserId);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  if (isListBlockLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={isDarkMode ? "#fff" : "#000"} />
      </View>
    );
  }

  if (isListBlockError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          Failed to load block list. Please try again.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={listBlock}
        keyExtractor={(item) => item?.id.toString()}
        renderItem={({ item }: { item: FriendType }) => <Block {...item} />}
        contentContainerStyle={listBlock?.length === 0 && styles.centered} // để căn giữa nếu danh sách rỗng
        ListEmptyComponent={
          <Text style={styles.noTxt}>You haven’t blocked any users yet!</Text>
        }
      />
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
    noTxt: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: 16,
      textAlign: "center",
      paddingHorizontal: 20,
    },
    errorText: {
      color: "red",
      fontSize: 16,
      textAlign: "center",
      paddingHorizontal: 20,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
    },
  });

export default BlockListScreen;
