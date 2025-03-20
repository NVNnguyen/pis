import React, { useState, useEffect, useCallback, useRef } from "react";
import * as Linking from "expo-linking";
import * as FileSystem from "expo-file-system";
import { Platform, View } from "react-native";
import { captureRef } from "react-native-view-shot";
import QRCode from "react-native-qrcode-svg";
import infoAPI from "@/api/infoAPI";

const useGenerateAndUploadQR = (userId: number) => {
  const [qrValue, setQrValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const qrRef = useRef<any>(null);

  useEffect(() => {
    if (userId) {
      const link = Linking.createURL("PrivateMode", {
        queryParams: { userId: String(userId) },
      });
      console.log("Tạo QR URL:", link);
      setQrValue(link);
    }
  }, [userId]);

  // ✅ Chụp PNG từ QR SVG (ViewShot)
  const captureQRCodeToPng = useCallback(async (): Promise<string> => {
    try {
      const uri = await captureRef(qrRef, {
        format: "png",
        quality: 1,
      });

      const fileName = `qrcode-${Date.now()}.png`;
      const filePath = `${FileSystem.cacheDirectory}${fileName}`;

      await FileSystem.copyAsync({
        from: uri,
        to: filePath,
      });

      return filePath;
    } catch (err) {
      console.error("Lỗi khi capture QR PNG:", err);
      throw new Error("Không thể tạo ảnh QR PNG");
    }
  }, []);

  // ✅ Upload QR PNG lên server
  const saveQRToServer = useCallback(async (): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);

      const filePath = await captureQRCodeToPng();

      const formData = new FormData();
      formData.append("file", {
        uri: Platform.OS === "ios" ? filePath.replace("file://", "") : filePath,
        name: `qrcode-${Date.now()}.png`,
        type: "image/png",
      } as any);
      formData.append("value", qrValue);
      formData.append("userId", String(userId));

      const response = await infoAPI.createQRCode(userId, formData);
      const qrCodeUrl = response?.data?.qrCode;

      if (!qrCodeUrl) throw new Error("Không nhận được URL mã QR từ server");
      setUploadedUrl(qrCodeUrl);
      return qrCodeUrl;
    } catch (err: any) {
      setError(err.message || "Lỗi không xác định");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [qrValue, userId, captureQRCodeToPng]);

  const generateQRForUser = useCallback(async (): Promise<string> => {
    return await saveQRToServer();
  }, [saveQRToServer]);

  return {
    qrValue,
    setQrValue,
    isLoading,
    error,
    uploadedUrl,
    generateQRForUser,
    qrRef, // ✅ Trả ra để dùng ở component ngoài
  };
};

export default useGenerateAndUploadQR;
