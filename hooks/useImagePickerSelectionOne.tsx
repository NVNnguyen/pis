import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Alert } from "react-native";

const useImagePickerSelectionOne = () => {
  const [image, setImage] = useState<string | null>(null);

  // Yêu cầu quyền truy cập thư viện ảnh
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Quyền truy cập bị từ chối",
        "Vui lòng cấp quyền để chọn ảnh."
      );
      return false;
    }
    return true;
  };

  // Mở thư viện ảnh và crop hình tròn
  const openImagePicker = async () => {
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Cho phép chỉnh sửa
        aspect: [1, 1], // Giữ tỷ lệ vuông để dễ crop hình tròn
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;

        // Crop ảnh thành hình vuông rồi hiển thị với borderRadius
        const croppedImage = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 400, height: 400 } }], // Resize ảnh về 400x400
          { format: ImageManipulator.SaveFormat.PNG }
        );

        setImage(croppedImage.uri);
      }
    } catch (error) {
      console.error("Lỗi chọn ảnh:", error);
    }
  };

  // Xóa ảnh
  const removeImage = () => {
    setImage(null);
  };

  return {
    image,
    openImagePicker,
    removeImage,
  };
};

export default useImagePickerSelectionOne;
