import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

const MainPrivateScreen = () => {
  const [isPublic, setIsPublic] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: "https://via.placeholder.com/50" }}
          style={styles.avatar}
        />
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, !isPublic && styles.activeButton]}
            onPress={() => setIsPublic(false)}
          >
            <Text style={[styles.toggleText, !isPublic && styles.activeText]}>
              Friends
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, isPublic && styles.activeButton]}
            onPress={() => setIsPublic(true)}
          >
            <Text style={[styles.toggleText, isPublic && styles.activeText]}>
              Public
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.downloadButton}>
          <MaterialIcons name="file-download" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.postContainer}>
        <Image
          source={{ uri: "https://via.placeholder.com/300x300" }}
          style={styles.postImage}
        />
        <Text style={styles.caption}>Ai đi cà hề hôn?</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="times" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.mainActionButton}>
          <FontAwesome name="paper-plane" size={40} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="text-fields" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        style={styles.friendList}
        showsHorizontalScrollIndicator={false}
      >
        {["All", "Jessica", "Mary", "Sarah", "Michael"].map((name, index) => (
          <View key={index} style={styles.friendItem}>
            <Image
              source={{ uri: "https://via.placeholder.com/40" }}
              style={styles.friendAvatar}
            />
            <Text style={styles.friendName}>{name}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1e21",
    paddingTop: 20,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    overflow: "hidden",
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  activeButton: {
    backgroundColor: "#fff",
  },
  toggleText: {
    fontSize: 14,
    color: "#666",
  },
  activeText: {
    color: "#000",
    fontWeight: "bold",
  },
  downloadButton: {
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 25,
  },
  postContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  postImage: {
    width: 320,
    height: 320,
    borderRadius: 15,
  },
  caption: {
    position: "absolute",
    bottom: 15,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "white",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    fontSize: 16,
    textAlign: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "70%",
    marginBottom: 20,
  },
  actionButton: {
    padding: 15,
  },
  mainActionButton: {
    padding: 20,
    backgroundColor: "#000",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  friendList: {
    flexDirection: "row",
    width: "90%",
    paddingVertical: 10,
  },
  friendItem: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: "#fff",
  },
  friendName: {
    color: "white",
    fontSize: 12,
  },
});

export default MainPrivateScreen;
