import infoAPI from "@/api/infoAPI";
import { useQuery } from "@tanstack/react-query";

const useUserFollowInfo = (userIdProp: number) => {
const {
  data: followInfo,
  isLoading: isFollowLoading,
  error: isFollowError,
} = useQuery({
  queryKey: ["followInfo", userIdProp],
  queryFn: async () =>{
  const response = await infoAPI.userFollow(userIdProp);
  return response?.data;
  },
})
return {followInfo, isFollowLoading, isFollowError};
};

export default useUserFollowInfo;
