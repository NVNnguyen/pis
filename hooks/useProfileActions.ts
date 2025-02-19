import { useState } from "react";

const useProfileActions = (userInfo: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleFollow = () => {
    setIsModalVisible(false);
  };

  const handleFollowStatus = () => {
    if (userInfo?.userPostResponse.follow) {
      setIsModalVisible(true);
    }
  };

  return {
    isModalVisible,
    setIsModalVisible,
    toggleFollow,
    handleFollowStatus,
  };
};

export default useProfileActions;
