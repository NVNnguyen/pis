import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { useCameraPermissions } from "expo-camera";

const useImagePickerChooseOne = () => {
  const [image, setImage] = useState<string | null>(null); // Single image URI
  const [permission, requestPermission] = useCameraPermissions();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Select a single image from the library
  const openImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("You need to enable permission to access images!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: false, // Ensure only one image is selected
      quality: 1,
    });

    if (!result.canceled) {
      setIsModalVisible(true); // Show loading modal (assuming this is intentional)
      const selectedImageUri = result.assets[0].uri; // Get the single URI
      setImage(selectedImageUri); // Set the single image URI

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay

      setIsModalVisible(false); // Hide modal after loading
    }
  };

  const removeImage = () => {
    setImage(null); // Clear the image
  };

  return {
    image, // Return single image URI instead of "images"
    openImagePicker,
    permission,
    isModalVisible,
    setIsModalVisible,
    removeImage,
  };
};

export default useImagePickerChooseOne;