import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const MainPrivateScreen = () => {
  const [isPublic, setIsPublic] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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
          <MaterialIcons
            name="file-download"
            size={width * 0.07}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* Post */}
      <View style={styles.postContainer}>
        <Image
          source={{ uri: "https://via.placeholder.com/300x300" }}
          style={styles.postImage}
        />
        <Text style={styles.caption}>Ai đi cà hề hôn?</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="times" size={width * 0.08} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.mainActionButton}>
          <FontAwesome name="paper-plane" size={width * 0.12} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="text-fields" size={width * 0.08} color="white" />
        </TouchableOpacity>
      </View>

      {/* Friend List */}
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
    paddingTop: height * 0.03,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: height * 0.03,
  },
  avatar: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderRadius: width * 0.05,
    overflow: "hidden",
  },
  toggleButton: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
  },
  activeButton: {
    backgroundColor: "#fff",
  },
  toggleText: {
    fontSize: width * 0.035,
    color: "#666",
  },
  activeText: {
    color: "#000",
    fontWeight: "bold",
  },
  downloadButton: {
    padding: width * 0.025,
    backgroundColor: "#333",
    borderRadius: width * 0.06,
  },
  postContainer: {
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  postImage: {
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: width * 0.04,
  },
  caption: {
    position: "absolute",
    bottom: height * 0.02,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "white",
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.03,
    borderRadius: width * 0.03,
    fontSize: width * 0.04,
    textAlign: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "70%",
    marginBottom: height * 0.03,
  },
  actionButton: {
    padding: width * 0.04,
  },
  mainActionButton: {
    padding: width * 0.05,
    backgroundColor: "#000",
    borderRadius: width * 0.1,
    justifyContent: "center",
    alignItems: "center",
  },
  friendList: {
    flexDirection: "row",
    width: "90%",
    paddingVertical: height * 0.02,
  },
  friendItem: {
    alignItems: "center",
    marginHorizontal: width * 0.03,
  },
  friendAvatar: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    marginBottom: height * 0.01,
    borderWidth: 2,
    borderColor: "#fff",
  },
  friendName: {
    color: "white",
    fontSize: width * 0.035,
  },
});

export default MainPrivateScreen;
