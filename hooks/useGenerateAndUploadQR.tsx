import { useState, useCallback, useRef, useEffect } from "react";
import QRCode from "react-native-qrcode-svg";
import { Platform, View } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";
import infoAPI from "@/api/infoAPI";

interface QRCodeRef {
  toDataURL: (callback: (base64: string) => void) => void;
}

interface QRCodeOptions {
  size?: number;
  color?: string;
  backgroundColor?: string;
  logo?: any;
  logoSize?: number;
  logoBackgroundColor?: string;
  logoMargin?: number;
  logoBorderRadius?: number;
  [key: string]: any;
}

const useGenerateAndUploadQR = (
  options: QRCodeOptions = {},
  userId: number
) => {
  if (!userId || isNaN(userId)) {
    throw new Error("Invalid userId");
  }

  const [qrValue, setQrValue] = useState<string>(
    Linking.createURL("PrivateMode", {
      queryParams: { userId: String(userId) },
    })
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const qrRef = useRef<QRCodeRef | null>(null);
  const [isQRCodeRendered, setIsQRCodeRendered] = useState(false);
  const renderResolveRef = useRef<(() => void) | null>(null);

  const qrOptions: QRCodeOptions = {
    size: options.size || 200,
    color: options.color || "black",
    backgroundColor: options.backgroundColor || "white",
    logo: options.logo,
    logoSize: options.logoSize,
    logoBackgroundColor: options.logoBackgroundColor,
    logoMargin: options.logoMargin,
    logoBorderRadius: options.logoBorderRadius,
    ...options,
  };

  useEffect(() => {
    setQrValue(
      Linking.createURL("PrivateMode", {
        queryParams: { userId: String(userId) },
      })
    );
  }, [userId]);

  // Hàm chờ QRCodeComponent render
  const waitForQRCodeRender = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      if (isQRCodeRendered) {
        console.log("QRCode is already rendered");
        resolve();
        return;
      }
      console.log("Waiting for QRCode to render...");
      renderResolveRef.current = resolve;
    });
  }, [isQRCodeRendered]);

  useEffect(() => {
    if (isQRCodeRendered && renderResolveRef.current) {
      console.log("QRCode render completed, resolving promise");
      renderResolveRef.current();
      renderResolveRef.current = null;
    }
  }, [isQRCodeRendered]);

  const getQRCodeBase64 = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!qrRef.current || !isQRCodeRendered) {
        reject(new Error("QR code ref is not available or not rendered yet"));
        return;
      }
      qrRef.current.toDataURL((base64: string) => resolve(base64));
    });
  }, [isQRCodeRendered]);

  const saveQRCodeToFile = useCallback(async (): Promise<string> => {
    const base64Data = await getQRCodeBase64();
    const fileName = `qrcode-${Date.now()}.png`;
    const filePath = `${FileSystem.cacheDirectory}${fileName}`;
    const base64Image =
      base64Data.split("data:image/png;base64,")[1] || base64Data;

    await FileSystem.writeAsStringAsync(filePath, base64Image, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return filePath;
  }, [getQRCodeBase64]);

  const saveQRToServer = useCallback(
    async (valueParam?: string): Promise<string> => {
      const valueToUse = valueParam || qrValue;
      if (!valueToUse) throw new Error("No QR value provided");

      setQrValue(valueToUse);
      setIsLoading(true);
      setError(null);

      try {
        const filePath = await saveQRCodeToFile();
        const formData = new FormData();
        formData.append("file", {
          uri:
            Platform.OS === "ios" ? filePath.replace("file://", "") : filePath,
          name: `qrcode-${Date.now()}.png`,
          type: "image/png",
        } as any);
        formData.append("value", valueToUse);
        formData.append("userId", userId.toString());

        const response = await infoAPI.createQRCode(userId, formData);
        console.log("API Response:", response.data);
        const qrCodeUrl = response?.data.qrCode;
        if (!qrCodeUrl) {
          throw new Error("No QR code URL returned from server");
        }
        setUploadedUrl(qrCodeUrl);
        return qrCodeUrl;
      } catch (err: any) {
        const errorMessage = err.message || "Unknown error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [qrValue, userId, saveQRCodeToFile]
  );

  const generateQRForUser = useCallback(async (): Promise<string> => {
    await waitForQRCodeRender(); // Đợi QRCodeComponent render
    const deepLink = Linking.createURL("PrivateMode", {
      queryParams: { userId: String(userId) },
    });
    console.log("Generated Deep Link:", deepLink);
    return await saveQRToServer(deepLink);
  }, [saveQRToServer, userId, waitForQRCodeRender]);

  const QRCodeComponent = useCallback((): JSX.Element => {
    console.log("Rendering QRCodeComponent");
    return (
      <QRCode
        value={qrValue}
        size={qrOptions.size}
        color={qrOptions.color}
        backgroundColor={qrOptions.backgroundColor}
        logo={qrOptions.logo}
        logoSize={qrOptions.logoSize}
        logoBackgroundColor={qrOptions.logoBackgroundColor}
        logoMargin={qrOptions.logoMargin}
        logoBorderRadius={qrOptions.logoBorderRadius}
        getRef={(ref: QRCodeRef | null) => {
          console.log("QRCode getRef called, ref:", ref);
          qrRef.current = ref;
          if (ref) setIsQRCodeRendered(true);
        }}
      />
    );
  }, [
    qrValue,
    qrOptions.size,
    qrOptions.color,
    qrOptions.backgroundColor,
    qrOptions.logo,
    qrOptions.logoSize,
    qrOptions.logoBackgroundColor,
    qrOptions.logoMargin,
    qrOptions.logoBorderRadius,
  ]);

  const HiddenQRCode = useCallback(() => {
    console.log("Rendering HiddenQRCode");
    return (
      <View style={{ position: "absolute", opacity: 0, width: 1, height: 1 }}>
        <QRCodeComponent />
      </View>
    );
  }, [QRCodeComponent]);

  return {
    qrValue,
    setQrValue,
    isLoading,
    error,
    uploadedUrl,
    getQRCodeBase64,
    generateQRForUser,
    QRCodeComponent,
    HiddenQRCode,
  };
};

export default useGenerateAndUploadQR;
