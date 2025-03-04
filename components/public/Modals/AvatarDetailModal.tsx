import { useTheme } from "@/contexts/ThemeContext";
import { backgroundColor } from "@/styles/stylePrimary";
import { darkTheme, lightTheme } from "@/utils/themes";
import { AntDesign } from "@expo/vector-icons";
import {
  View,
  Image,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
} from "react-native";
interface AvatarDetailModalProps {
  image: string;
  visible: boolean;
  onClose: () => void;
}
const { width, height } = Dimensions.get("window");
const AvatarDetailModal = ({
  image,
  visible,
  onClose,
}: AvatarDetailModalProps) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  return (
    <Modal animationType="slide" transparent visible={visible}>
      <TouchableOpacity style={styles.closeIcon} onPress={() => onClose()}>
        <AntDesign
          name="close"
          size={height * 0.024}
          color={isDarkMode ? darkTheme.text : lightTheme.text}
        />
      </TouchableOpacity>
      <View style={styles.container}>
        <Image source={{ uri: image }} style={styles.image} />
      </View>
    </Modal>
  );
};

const getStyles = (isDarkMode: boolean) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
    },
    image: {
      width: width * 0.9,
      height: width * 0.9,
      borderRadius: (height * 0.9) / 2,
    },
    closeIcon: {
      position: "absolute",
      top: height * 0.07, // Đặt icon cách đỉnh màn hình
      left: width * 0.07, // Đặt icon cách cạnh trái
      zIndex: 10, // Hiển thị icon phía trên các thành phần khác
      backgroundColor: "grey", // Nền xám
      borderRadius: width * 0.05, // Đặt borderRadius bằng nửa chiều rộng/chiều cao để tạo hình tròn
      width: width * 0.07, // Đường kính hình tròn
      height: width * 0.07, // Đường kính hình tròn (bằng với chiều rộng để đảm bảo hình tròn)
      justifyContent: "center", // Căn giữa nội dung theo chiều dọc
      alignItems: "center", // Căn giữa nội dung theo chiều ngang
    },
  });
};
export default AvatarDetailModal;
