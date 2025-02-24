import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

const useImagePickerSelectionOne = () => {
  const [image, setImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [alertVisible, setAlertVisible] = useState<boolean>(false);

  const openPickImage = async () => {
    if (status?.granted === false) {
      const permissionResponse = await requestPermission();
      if (!permissionResponse.granted) {
        setAlertVisible(true);
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const filename = uri.split("/").pop() || "avatar.jpg";
      const fileType = filename.split(".").pop() || "jpg";

      // Chuyển đổi URI thành Blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Tạo FormData
      const newFormData = new FormData();
      newFormData.append("file", {
        uri, // ✅ Quan trọng: Phải dùng `uri` thay vì `blob`
        name: filename,
        type: `image/${fileType}`,
      } as any); // ⚠️ Cần ép kiểu để tránh lỗi TypeScript

      setImage(uri);
      setFormData(newFormData);

      console.log("📸 File đã chọn:", { filename, fileType, uri });
      console.log("📂 FormData:", newFormData);
    }
  };

  return {
    image,
    formData,
    openPickImage,
  };
};

export default useImagePickerSelectionOne;
