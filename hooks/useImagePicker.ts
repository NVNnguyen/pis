import { useCameraPermissions } from "expo-camera";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";

const useImagePicker = () => {
  const [images, setImages] = useState<string[]>([]); // Lưu danh sách ảnh
  const [permission, requestPermission] = useCameraPermissions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Chọn ảnh từ thư viện
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
    setIsModalVisible(false); // Bắt đầu tải ảnh
    const newImages = result.assets.map((asset) => asset.uri);
    setImages((prevImages) => [...prevImages, ...newImages]);

    await new Promise((resolve) => setTimeout(resolve, 2000));

   
    setIsModalVisible(true); // Đóng modal sau khi tải xong
  }
  };
  // ❌ Hàm để xóa ảnh khỏi danh sách
  const removeImage = (uri: string) => {
    setImages(images.filter((image) => image !== uri));
  };
  const removeAllImages = ()=>{
    setImages([])
  }
  return {
    images,
    setImages,
    openImagePicker,
    permission,
    isModalVisible,
    setIsModalVisible,
    removeAllImages,
    removeImage
  };
};

export default useImagePicker;
