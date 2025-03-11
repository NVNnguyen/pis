import { useTheme } from "@/contexts/ThemeContext";
import { buttonFontsize } from "@/styles/stylePrimary";
import { darkTheme, lightTheme } from "@/utils/themes";
import { AntDesign } from "@expo/vector-icons";
import {
  Dimensions,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  View,
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
  const loaderColor = isDarkMode ? darkTheme.text : lightTheme.text;

  const renderLoader = () => (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={loaderColor} />
    </View>
  );

  return (
    <Modal visible={isModalVisible} transparent animationType="fade">
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? "black" : "white" },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.closeIcon,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.3)"
                : "rgba(0,0,0,0.3)",
            },
          ]}
          onPress={onClose}
        >
          <AntDesign
            name="close"
            size={buttonFontsize}
            color={closeIconColor}
          />
        </TouchableOpacity>
        {images.length > 0 && (
          <ImageViewer
            imageUrls={images.map((image) => ({ url: image.url }))}
            index={currentIndex}
            onSwipeDown={onClose}
            enableSwipeDown
            loadingRender={renderLoader}
            backgroundColor={isDarkMode ? "black" : "white"}
            renderIndicator={() => <></>} // Hide default indicator
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeIcon: {
    position: "absolute",
    top: height * 0.07,
    left: width * 0.07,
    zIndex: 10,
    borderRadius: width * 0.035,
    width: width * 0.07,
    height: width * 0.07,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PostImageDetailModal;
