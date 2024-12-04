import { PixelRatio } from "react-native";
import { captureRef } from "react-native-view-shot";
import axios from "axios";
import { CameraType } from "expo-camera";

/**
 * Toggles camera type between front and back.
 */
export const toggleCameraFacing = (currentFacing: CameraType): CameraType =>
  currentFacing === "back" ? "front" : "back";

/**
 * Saves the captured image by uploading it to the server.
 */
const saveImage = async (localPath: string): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: localPath,
      name: `captured_image_${Date.now()}.png`, // Unique file name
      type: "image/png", // MIME type
    } as any);

    const response = await axios.post(
      "http://192.168.1.2:8083/api/images/upload", // Use "10.0.2.2" for Android emulator
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Image uploaded successfully:", response.data);
  } catch (error) {
    console.error(
      "Error uploading image:",
      
    );
  }
};

/**
 * Captures an image using the provided camera reference.
 */
export const captureImage = async (cameraRef: React.RefObject<any>): Promise<void> => {
  try {
    if (cameraRef.current) {
      const targetPixelCount = 1080; // Target resolution
      const pixelRatio = PixelRatio.get(); // Device pixel ratio
      const pixels = targetPixelCount / pixelRatio;

      // Capture the image
      const tempPath = await captureRef(cameraRef.current, {
        result: "tmpfile",
        height: pixels,
        width: pixels,
        quality: 1,
        format: "png",
      });

      console.log("Image captured at temporary path:", tempPath);

      // Upload the image to the server
      await saveImage(tempPath);
    }
  } catch (error) {
    console.error("Error capturing image:");
  }
};
