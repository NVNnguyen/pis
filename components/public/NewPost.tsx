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
import CreatePostModel from "./CreatePostModel";
import { useState, useEffect, useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import { darkTheme, lightTheme } from "@/utils/themes";
import { captureImage } from "@/utils/friendModeHandel";
import { useCameraPermissions } from "expo-camera";

interface createPostProps {
  userInfo: { avatar: string; lastName: string; firstName: string };
}

const { width, height } = Dimensions.get("window");

const NewPost = ({ userInfo }: createPostProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [images, setImages] = useState<string[]>([]); // Lưu danh sách ảnh
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) {
    return <Text>Requesting camera permissions...</Text>;
  }

  if (!permission.granted) {
    return <Text>Camera permissions are required to use this app.</Text>;
  }

  const handleCreatePostModel = () => {
    setIsModalVisible(true);
  };

  const openImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("You need to enable permission to access images!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map((asset) => asset.uri)]);
      setIsModalVisible(true); // Mở modal sau khi chọn ảnh
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {userInfo.avatar == null && (
          <FontAwesome
            name="user-o"
            size={24}
            color={isDarkMode ? darkTheme.text : lightTheme.text}
          />
        )}
        <Image style={styles.avatar} source={{ uri: userInfo.avatar }} />
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.fullName}>
          {userInfo.firstName} {userInfo.lastName}
        </Text>
        <TouchableOpacity onPress={handleCreatePostModel}>
          <Text style={styles.inputCation}>What's new?</Text>
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => captureImage(cameraRef)}>
            <SimpleLineIcons name="camera" size={24} color="#9E9E9E" />
          </TouchableOpacity>
          <TouchableOpacity onPress={openImagePicker}>
            <Ionicons name="images-outline" size={24} color="#9E9E9E" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons name="keyboard-voice" size={24} color="#9E9E9E" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Truyền images vào modal */}
      <CreatePostModel
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        images={images}
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
