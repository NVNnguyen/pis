import { backgroundColor, Color, fontWeight } from "@/styles/color";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableNativeFeedback,
  TouchableOpacity,
} from "react-native";

const { width, height } = Dimensions.get("window");
const ChatHeader = () => {
  return (
    <View style={styles.header}>
      <View style={styles.backIcon}>
        <TouchableOpacity>
          <Ionicons name="chevron-back-sharp" size={24} color={Color} />
        </TouchableOpacity>
      </View>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
          style={styles.avatar}
        />
      </View>
      <View style={styles.textView}>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.status}>Online</Text>
      </View>

      <View style={styles.callIcons}>
        <View style={styles.audioIcon}>
          <Ionicons name="call" size={24} color={Color} />
        </View>
        <View style={styles.videoIcon}>
          <FontAwesome name="video-camera" size={24} color={Color} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: height * 0.05,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: backgroundColor,
    marginTop: height * 0.05,
  },
  backIcon: {},
  avatarContainer: {
    marginLeft: width * 0.02,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    fontWeight: fontWeight,
    fontSize: 16,
    color: Color,
  },
  textView: {},
  status: {
    color: "green",
    marginLeft: 10,
    fontWeight: fontWeight,
  },
  callIcons: {
    flexDirection: "row",
    marginLeft: width * 0.4,
  },
  audioIcon: {},
  videoIcon: {
    marginLeft: width * 0.04,
  },
});

export default ChatHeader;
