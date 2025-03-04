import { CameraType, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";

const useCamera = () =>{
      const [facing, setFacing] = useState<CameraType>("back");
      const [permission, requestPermission] = useCameraPermissions();
      const cameraRef = useRef(null);
      useEffect(() => {
          if (!permission) {
            requestPermission();
          }
        }, [permission, requestPermission]);
      
        if (!permission) {
          return ;
        }
      
        if (!permission.granted) {
          return;
        }
        return {facing, setFacing, cameraRef};
    }
  
export default useCamera;