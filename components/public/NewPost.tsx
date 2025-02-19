import { useTheme } from "@/contexts/ThemeContext";
import {
  FontAwesome,
  Ionicons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import CreatePostModel from "./Modals/CreatePostModel";
import { useRef, useState } from "react";
import { darkTheme, lightTheme } from "@/utils/themes";
import { captureImage } from "@/utils/friendModeHandel";
import useImagePicker from "@/hooks/useImagePicker";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/utils/types/MainStackType";

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
  const cameraRef = useRef(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const {
    images,
    openImagePicker,
    permission,
    // isModalVisible,
    // setIsModalVisible,
    removeImage,
  } = useImagePicker();
  if (!permission) {
    return <Text>Requesting camera permissions...</Text>;
  }
  if (!permission.granted) {
    return <Text>Camera permissions are required to use this app.</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ProfilePublic", { userId: userInfo.userId })
          }
        >
          {userInfo.avatar == null && (
            <FontAwesome
              name="user-o"
              size={24}
              color={isDarkMode ? darkTheme.text : lightTheme.text}
            />
          )}
          <Image style={styles.avatar} source={{ uri: userInfo.avatar }} />
        </TouchableOpacity>
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ProfilePublic", { userId: userInfo.userId })
          }
        >
          <Text style={styles.fullName}>
            {userInfo.lastName} {userInfo.firstName}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsVisible(true)}>
          <Text style={styles.inputCation}>What's new?</Text>
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => captureImage(cameraRef)}>
            <SimpleLineIcons name="camera" size={24} color="#9E9E9E" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsVisible(true);
              openImagePicker();
            }}
          >
            <Ionicons name="images-outline" size={24} color="#9E9E9E" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons name="keyboard-voice" size={24} color="#9E9E9E" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Truyền images vào modal */}
      <CreatePostModel
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        imagesProp={images}
        removeImageProp={removeImage}
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
      fontSize: height * 0.016,
      color: "#9E9E9E",
    },
    iconContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: width * 0.3,
    },
    fullName: {
      fontSize: height * 0.018,
      fontWeight: "bold",

      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
  });

export default NewPost;
