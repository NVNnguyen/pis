import infoAPI from "@/api/infoAPI";
import { backgroundColor, Color, fontWeight } from "@/styles/color";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableNativeFeedback,
  TouchableOpacity,
} from "react-native";
interface ChatHeaderProps {
  navigation: any;
  userIdProp: number;
}
const { width, height } = Dimensions.get("window");
const ChatHeader: React.FC<ChatHeaderProps> = ({ navigation, userIdProp }) => {
  const [userId, setUserId] = useState<number>(0);
  const [avatar, setAvatar] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!userIdProp || userIdProp === 0) {
          console.warn("User ID không hợp lệ:", userIdProp);
          return;
        }

        console.log("📡 Fetching user info for User ID:", userIdProp);
        const responseUser = await infoAPI.userInfo(userIdProp);

        if (!responseUser.data) {
          console.warn(" Không tìm thấy thông tin user!");
          return;
        }

        setAvatar(responseUser.data?.avatar || "");
        setFirstName(responseUser.data?.firstName || "Unknown");
        setLastName(responseUser.data?.lastName || "User");

        console.log(" User Info Fetched:", responseUser.data);
      } catch (error) {
        console.error(" Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [userId]);
  return (
    <View style={styles.header}>
      <View style={styles.backIcon}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-sharp" size={24} color={Color} />
        </TouchableOpacity>
      </View>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
      </View>
      <View style={styles.textView}>
        <Text style={styles.name}>
          {firstName} {lastName}
        </Text>
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
