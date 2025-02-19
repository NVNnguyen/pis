import { useState } from "react";
import ImagePicker from "react-native-image-crop-picker";
import { PermissionsAndroid, Platform } from "react-native";

const useImagePickerSelectionOne = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Cấp quyền truy cập thư viện ảnh trên Android
  const requestPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Cho phép truy cập ảnh",
          message: "Ứng dụng cần quyền truy cập thư viện ảnh của bạn",
          buttonNeutral: "Hỏi lại sau",
          buttonNegative: "Từ chối",
          buttonPositive: "Đồng ý",
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS không cần quyền này
  };
  // Mở thư viện ảnh và crop hình tròn

  const openImagePicker = async () => {
    try {
      console.log("images piscker:", ImagePicker);
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        alert("Bạn cần cấp quyền truy cập thư viện ảnh!");
        return;
      }

      const result = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true, // Cho phép crop
        cropperCircleOverlay: true, // Cắt hình tròn
        cropperToolbarTitle: "Cắt ảnh đại diện",
        mediaType: "photo",
      });

      setImage(result.path);
      console.log(result.path);
    } catch (error) {
      console.log("Lỗi chọn ảnh:", error);
    }
  };

  // Xóa ảnh
  const removeImage = () => {
    setImage(null);
  };

  return {
    image,
    setImage,
    openImagePicker,
    removeImage,
  };
};

export default useImagePickerSelectionOne;
