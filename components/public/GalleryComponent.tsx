import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width } = Dimensions.get("window");
const ITEM_SIZE = width * 0.3; // Kích thước ảnh trong grid
const STORY_SIZE = width * 0.15; // Kích thước story trên đầu



const GalleryScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Photo</Text>
        <Text style={styles.title}>Voice</Text>
      </View>

      {/* Story Section */}
      <View style={styles.storyContainer}>
        <FlatList
          data={photos.slice(0, 4)} // Hiển thị 4 story
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.storyItem}>
              <Image source={item} style={styles.storyImage} />
              <Text style={styles.storyText}>
                Ký ức {Math.floor(Math.random() * 10)}
              </Text>
            </TouchableOpacity>
          )}
        />

        <FlatList
          data={voices}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `voice-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.storyItem}>
              <Image source={item} style={styles.storyImage} />
              <Text style={styles.storyText}>
                Ký ức {Math.floor(Math.random() * 10)}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Grid Image */}
      <FlatList
        data={photos}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={item} style={styles.photoItem} resizeMode="cover" />
        )}
      />
    </View>
  );
};

// 🌟 CSS Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  storyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  storyItem: {
    alignItems: "center",
    marginHorizontal: 5,
  },
  storyImage: {
    width: STORY_SIZE,
    height: STORY_SIZE,
    borderRadius: STORY_SIZE / 2,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  storyText: {
    fontSize: 12,
    color: "white",
    marginTop: 5,
  },
  photoItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: 5,
    borderRadius: 10,
  },
});

export default GalleryScreen;
