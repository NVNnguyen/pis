import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import CreatePostModel from "./Modals/CreatePostModal";
import { darkTheme, lightTheme } from "@/utils/themes";
import { type NavigationProp, useNavigation } from "@react-navigation/native";
import type { MainStackType } from "@/utils/types/MainStackType";
import { buttonFontsize, textFontSize } from "@/styles/stylePrimary";

interface newPostProps {
  userInfo: {
    avatar: string;
    lastName: string;
    firstName: string;
    userId: number;
    username: string;
  };
}

const { width, height } = Dimensions.get("window");

const NewPost = ({ userInfo }: newPostProps) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const navigation = useNavigation<NavigationProp<MainStackType>>();
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const [modalState, setModalState] = useState<{
    visible: boolean;
    key: string | null;
  }>({
    visible: false,
    key: null,
  });

  const handleAvatarPress = () => {
    navigation.navigate("Profile", {
      userId: userInfo.userId,
      isFollow: false,
    });
  };

  return (
    <TouchableOpacity
      style={styles.fullContainer}
      activeOpacity={1}
      onPress={() =>
        setModalState({
          visible: true,
          key: null,
        })
      }
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handleAvatarPress}
          style={styles.avatarContainer}
        >
          {avatarLoading && (
            <ActivityIndicator
              style={styles.avatarLoader}
              size="small"
              color={isDarkMode ? darkTheme.text : lightTheme.text}
            />
          )}
          {userInfo?.avatar?.length === 0 || userInfo?.avatar === null ? (
            <Image
              source={require("@/assets/images/userAvatar.png")}
              style={styles.avatar}
              onLoad={() => setAvatarLoading(false)}
            />
          ) : (
            <Image
              style={styles.avatar}
              source={{ uri: userInfo.avatar }}
              onLoadStart={() => setAvatarLoading(true)}
              onLoadEnd={() => setAvatarLoading(false)}
            />
          )}
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <TouchableOpacity onPress={handleAvatarPress}>
            {userInfo?.username ? (
              <Text style={styles.fullName}>{userInfo.username}</Text>
            ) : (
              <View style={styles.usernamePlaceholder}>
                <ActivityIndicator
                  size="small"
                  color={isDarkMode ? "#ffffff" : "#000000"}
                />
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() =>
              setModalState({
                visible: true,
                key: null,
              })
            }
          >
            <Text style={styles.inputCation}>What's new?</Text>
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={() =>
                setModalState({
                  visible: true,
                  key: "camera",
                })
              }
            >
              <SimpleLineIcons
                name="camera"
                size={buttonFontsize}
                color="#9E9E9E"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setModalState({
                  visible: true,
                  key: "photo",
                })
              }
            >
              <Ionicons
                name="images-outline"
                size={buttonFontsize}
                color="#9E9E9E"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setModalState({
                  visible: true,
                  key: "record",
                })
              }
            >
              <MaterialIcons
                name="keyboard-voice"
                size={buttonFontsize}
                color="#9E9E9E"
              />
            </TouchableOpacity>
          </View>
        </View>
        <CreatePostModel
          openModel={modalState}
          onClose={() => {
            setModalState({
              visible: false,
              key: null,
            });
            return { visible: false, key: null };
          }}
          isLoading={setLoading}
        />
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    fullContainer: {
      width: "100%",
    },
    container: {
      flexDirection: "row",
      padding: width * 0.01,
      borderBottomWidth: 1,
      borderBottomColor: "#9E9E9E",
      paddingBottom: height * 0.02,
      marginLeft: width * 0.02,
    },
    avatarContainer: {
      marginRight: width * 0.03,
      width: width * 0.1,
      height: width * 0.1,
      borderRadius: (width * 0.1) / 2,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDarkMode ? "#2a2a2a" : "#f0f0f0",
      overflow: "hidden",
    },
    avatar: {
      width: "100%",
      height: "100%",
      borderRadius: (width * 0.1) / 2,
    },
    avatarLoader: {
      position: "absolute",
    },
    contentContainer: {
      flex: 1,
    },
    createBtn: {
      width: "100%",
    },
    inputCation: {
      marginBottom: height * 0.01,
      fontSize: textFontSize,
      color: "#9E9E9E",
    },
    iconContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: width * 0.3,
    },
    fullName: {
      fontSize: textFontSize,
      fontWeight: "bold",
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    usernamePlaceholder: {
      width: width * 0.3,
      height: textFontSize * 1.5,
      justifyContent: "center",
    },
  });

export default NewPost;
