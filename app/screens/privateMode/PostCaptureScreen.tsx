import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  FlatList,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Color } from "../../../styles/color";

const { width, height } = Dimensions.get("window");

const PostCaptureScreen = () => {
  const [toggleOption, setToggleOption] = useState("Friends");
  const friends = [
    {
      id: "1",
      name: "Ali",
      avatar: "https://pisnewcontainer.blob.core.windows.net/image/mqttx.png",
    },
    { id: "2", name: "Jessica", avatar: "https://via.placeholder.com/40" },
    { id: "3", name: "Mary", avatar: "https://via.placeholder.com/40" },
    { id: "4", name: "Sarah", avatar: "https://via.placeholder.com/40" },
    { id: "5", name: "Michael", avatar: "https://via.placeholder.com/40" },
  ];

  const handleToggle = (option: string) => setToggleOption(option);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: "https://via.placeholder.com/40" }}
            style={styles.avatar}
          />
          <View style={styles.toggleSwitch}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                toggleOption === "Friends" && styles.activeButton,
              ]}
              onPress={() => handleToggle("Friends")}
            >
              <Text
                style={[
                  styles.toggleText,
                  toggleOption === "Friends" && styles.activeText,
                ]}
              >
                Friends
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                toggleOption === "Public" && styles.activeButton,
              ]}
              onPress={() => handleToggle("Public")}
            >
              <Text
                style={[
                  styles.toggleText,
                  toggleOption === "Public" && styles.activeText,
                ]}
              >
                Public
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.downloadIcon}>
            <MaterialIcons name="download" size={width * 0.07} color={Color} />
          </TouchableOpacity>
        </View>

        {/* Image Preview */}
        <View style={styles.imagePreviewContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/300" }}
            style={styles.imagePreview}
          />
          <View style={styles.captionContainer}>
            <Text style={styles.caption}>Ai đi cà hê hôn?</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton}>
            <FontAwesome name="close" size={width * 0.08} color={Color} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton}>
            <FontAwesome name="send" size={width * 0.08} color={Color} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.arButton}>
            <MaterialIcons
              name="center-focus-strong"
              size={width * 0.08}
              color={Color}
            />
          </TouchableOpacity>
        </View>

        {/* Friends List */}
        <FlatList
          data={friends}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.friendContainer}>
              <Image
                source={{ uri: item.avatar }}
                style={styles.friendAvatar}
              />
              <Text style={styles.friendName}>{item.name}</Text>
            </View>
          )}
          contentContainerStyle={styles.friendList}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  avatar: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
  },
  toggleSwitch: {
    flexDirection: "row",
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.005,
  },
  toggleButton: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
    borderRadius: 12,
  },
  toggleText: {
    color: Color,
    fontSize: width * 0.04,
  },
  activeButton: {
    backgroundColor: Color,
  },
  activeText: {
    color: "#121212",
  },
  downloadIcon: {
    padding: 10,
  },
  imagePreviewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreview: {
    width: width,
    height: "80%",
    borderRadius: 30,
    resizeMode: "cover",
  },
  captionContainer: {
    position: "absolute",
    bottom: height * 0.1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.005,
    borderRadius: 10,
  },
  caption: {
    color: Color,
    fontSize: width * 0.05,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: width * 0.1,
    marginBottom: height * 0.02,
  },
  cancelButton: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 30,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    padding: 20,
    borderRadius: 30,
  },
  arButton: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 30,
  },
  friendList: {
    marginVertical: height * 0.02,
  },
  friendContainer: {
    alignItems: "center",
    marginHorizontal: width * 0.03,
  },
  friendAvatar: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    marginBottom: 5,
  },
  friendName: {
    color: Color,
    fontSize: width * 0.035,
    textAlign: "center",
  },
});

export default PostCaptureScreen;
