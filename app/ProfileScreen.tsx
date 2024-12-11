import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const ProfileScreen: React.FC = () => {
  const categories = [
    { id: "1", icon: "camera", label: "All" },
    { id: "2", icon: "image", label: "Nature" },
    { id: "3", icon: "film", label: "Travel" },
    { id: "4", icon: "photo", label: "Culture" },
    { id: "5", icon: "cutlery", label: "Food" },
  ];

  const images = [
    { id: "1", uri: "https://via.placeholder.com/100" },
    { id: "2", uri: "https://via.placeholder.com/100" },
    { id: "3", uri: "https://via.placeholder.com/100" },
    { id: "4", uri: "https://via.placeholder.com/100" },
    { id: "5", uri: "https://via.placeholder.com/100" },
    { id: "6", uri: "https://via.placeholder.com/100" },
    { id: "7", uri: "https://via.placeholder.com/100" },
    { id: "8", uri: "https://via.placeholder.com/100" },
    { id: "9", uri: "https://via.placeholder.com/100" },
    { id: "10", uri: "https://via.placeholder.com/100" },
    { id: "11", uri: "https://via.placeholder.com/100" },
    { id: "12", uri: "https://via.placeholder.com/100" },
  ];
  const renderCategory = (item: {
    id: string;
    icon: string;
    label: string;
  }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <FontAwesome
        name={item.icon as keyof typeof FontAwesome.glyphMap}
        size={width * 0.06}
        color="#fff"
      />
      <Text style={styles.categoryText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderImageItem = (item: { id: string; uri: string }) => (
    <View style={styles.imageWrapper}>
      <Image source={{ uri: item.uri }} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={width * 0.06} color="#fff" />
        </TouchableOpacity>
        <View style={styles.toggleButtons}>
          <TouchableOpacity style={[styles.toggleButton, styles.activeButton]}>
            <Text style={styles.toggleText}>Photos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleButton}>
            <Text style={styles.toggleText}>Videos</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: "https://via.placeholder.com/100" }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Thomas</Text>
        <TouchableOpacity style={styles.addFriendButton}>
          <FontAwesome name="user-plus" size={width * 0.05} color="#fff" />
          <Text style={styles.addFriendText}> Add Friend</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Categories */}
      <FlatList
        horizontal
        data={categories}
        renderItem={({ item }) => renderCategory(item)}
        keyExtractor={(item) => item.id}
        style={styles.categoryList}
        showsHorizontalScrollIndicator={false}
      />

      {/* Grid of Images */}
      <FlatList
        data={images}
        renderItem={({ item }) => renderImageItem(item)}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.05,
    paddingBottom: height * 0.02,
  },
  toggleButtons: {
    flexDirection: "row",
  },
  toggleButton: {
    padding: width * 0.02,
    borderRadius: width * 0.01,
    marginLeft: width * 0.02,
  },
  activeButton: {
    backgroundColor: "#333",
  },
  toggleText: {
    color: "#fff",
    fontSize: width * 0.035,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: height * 0.03,
  },
  profileImage: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.1,
    marginBottom: height * 0.01,
  },
  profileName: {
    fontSize: width * 0.05,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: height * 0.01,
  },
  addFriendButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.02,
    borderRadius: width * 0.05,
  },
  addFriendText: {
    color: "#fff",
    fontSize: width * 0.035,
    marginLeft: width * 0.02,
  },
  categoryList: {
    marginVertical: height * 0.02,
    paddingHorizontal: width * 0.03,
  },
  categoryItem: {
    alignItems: "center",
    marginHorizontal: width * 0.03,
  },
  categoryText: {
    color: "#fff",
    fontSize: width * 0.03,
    marginTop: height * 0.005,
  },
  gridContainer: {
    paddingHorizontal: width * 0.03,
  },
  imageWrapper: {
    flex: 1,
    margin: width * 0.01,
    backgroundColor: "#333",
    borderRadius: width * 0.02,
  },
  image: {
    width: (width - width * 0.12) / 3,
    height: (width - width * 0.12) / 3,
    borderRadius: width * 0.02,
  },
});

export default ProfileScreen;
