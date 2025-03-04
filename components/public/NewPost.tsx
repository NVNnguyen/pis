import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import CreatePostModel from "./Modals/CreatePostModal";
import { useRef, useState } from "react";
import { darkTheme, lightTheme } from "@/utils/themes";
import useImagePicker from "@/hooks/useImagePicker";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MainStackType } from "@/utils/types/MainStackType";
import { textFontSize } from "@/styles/stylePrimary";
import CameraModal from "./Modals/CameraModal";

interface newPostProps {
  userInfo: {
    avatar: string;
    lastName: string;
    firstName: string;
    userId: number;
  };
}

const { width, height } = Dimensions.get("window");

const NewPost = ({ userInfo }: newPostProps) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const navigation = useNavigation<NavigationProp<MainStackType>>();
  const [modalState, setModalState] = useState<{
    visible: boolean;
    key: string | null;
  }>({
    visible: false,
    key: null, // Lưu key tùy chọn
  });
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Profile", { userId: userInfo.userId })
          }
        >
          {userInfo?.avatar?.length == 0 ||
            (userInfo?.avatar === null && (
              <Image
                source={require("@/assets/images/userAvatar.png")}
                style={styles.avatar}
              />
            ))}
          <Image style={styles.avatar} source={{ uri: userInfo.avatar }} />
        </TouchableOpacity>
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Profile", { userId: userInfo.userId })
          }
        >
          <Text style={styles.fullName}>
            {userInfo?.firstName} {userInfo?.lastName}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
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
            <SimpleLineIcons name="camera" size={24} color="#9E9E9E" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setModalState({
                visible: true,
                key: "photo",
              })
            }
          >
            <Ionicons name="images-outline" size={24} color="#9E9E9E" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setModalState({
                visible: true,
                key: "record",
              })
            }
          >
            <MaterialIcons name="keyboard-voice" size={24} color="#9E9E9E" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Truyền images vào modal */}
      <CreatePostModel
        openModel={modalState}
        onClose={() => {
          setModalState({ visible: false, key: null });
          return { visible: false, key: null };
        }}
        imagesProp={[]}
        removeImageProp={() => {}}
      />
    </View>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
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
    },
    avatar: {
      width: width * 0.1,
      height: width * 0.1,
      borderRadius: (width * 0.1) / 2,
    },
    rightContainer: {},
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
  });

export default NewPost;
