import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { AntDesign } from "@expo/vector-icons";
import {
  Dimensions,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";

const { width, height } = Dimensions.get("window");

interface PostImageDetailModalProps {
  images: { url: string; id: number }[];
  currentIndex: number;
  isModalVisible: boolean;
  onClose: () => void;
}

const PostImageDetailModal = ({
  images,
  currentIndex,
  isModalVisible,
  onClose,
}: PostImageDetailModalProps) => {
  const { isDarkMode } = useTheme();
  const closeIconColor = isDarkMode ? darkTheme.text : lightTheme.text;

  return (
    <Modal visible={isModalVisible} transparent animationType="fade">
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
          <AntDesign
            name="close"
            size={height * 0.024}
            color={closeIconColor}
          />
        </TouchableOpacity>
        {images.length > 0 && (
          <ImageViewer
            imageUrls={images.map((image) => ({ url: image.url }))}
            index={currentIndex}
            onSwipeDown={onClose}
            enableSwipeDown
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  closeIcon: {
    position: "absolute",
    top: height * 0.07,
    left: width * 0.07,
    zIndex: 10,
    backgroundColor: "grey",
    borderRadius: width * 0.035,
    width: width * 0.07,
    height: width * 0.07,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PostImageDetailModal;
