import { useState, useEffect } from "react";
import infoAPI from "@/api/infoAPI";

const useUserFollowInfo = (userIdProp: number) => {
  const [follower, setFollower] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);

  useEffect(() => {
    if (!userIdProp) return;

    const fetchUserFollowInfo = async () => {
      try {
        const response = await infoAPI.userFollow(userIdProp);
        if (response?.data) {
          setFollower(response.data.followers ?? 0);
          setFollowing(response.data.followingNumber ?? 0);
        }
      } catch (error) {
        console.error("Error fetching follow info:", error);
      }
    };

    fetchUserFollowInfo();
  }, [userIdProp]);

  return { follower, following };
};

export default useUserFollowInfo;
