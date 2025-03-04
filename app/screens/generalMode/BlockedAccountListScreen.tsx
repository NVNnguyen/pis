import { backgroundColor, Color, fontWeight } from "@/styles/stylePrimary"; // Ensure this file exists or replace with actual colors
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";

const { width, height } = Dimensions.get("window");

const BlockedAccountListScreen = () => {
  const [userLocks, setUserLocks] = useState<{ [key: string]: boolean }>({}); // Store lock state for each user

  const toggleLock = (userId: string) => {
    setUserLocks((prevLocks) => ({
      ...prevLocks,
      [userId]: !prevLocks[userId], // Toggle lock for the specific user
    }));
  };

  const users = Array.from({ length: 20 }, (_, index) => ({
    id: (index + 1).toString(),
    username: `User ${index + 1}`,
  }));

  const renderUserItem = ({
    item,
  }: {
    item: { id: string; username: string };
  }) => (
    <View style={styles.userItem}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
          style={styles.avatar}
        />
      </View>
      <Text style={styles.username}>{item.username}</Text>

      <TouchableOpacity
        onPress={() => toggleLock(item.id)}
        style={[
          styles.button,
          userLocks[item.id] ? styles.buttonUnlock : styles.buttonBlock,
        ]}
      >
        <Text style={styles.buttonText}>
          {userLocks[item.id] ? "Unlock" : "Block"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Blocked Accounts</Text>

      {/* Blocked Accounts List */}
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.05,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: fontWeight || "bold",
    color: Color || "#333",
    textAlign: "center",
    marginBottom: height * 0.03,
  },
  list: {
    paddingVertical: height * 0.02,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    backgroundColor: Color,
    borderRadius: width * 0.02,
    marginBottom: height * 0.015,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: (width * 0.12) / 2,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    marginRight: width * 0.04,
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  username: {
    fontSize: width * 0.045,
    fontWeight: fontWeight || "600",
    color: "#333",
    flex: 1,
  },
  button: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
    borderRadius: width * 0.02,
  },
  buttonUnlock: {
    backgroundColor: "green",
  },
  buttonBlock: {
    backgroundColor: "red",
  },
  buttonText: {
    color: Color,
    fontWeight: fontWeight,
    fontSize: width * 0.04,
    textAlign: "center",
  },
});

export default BlockedAccountListScreen;
