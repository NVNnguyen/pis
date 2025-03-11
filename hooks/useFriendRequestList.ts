import friendAPI from "@/api/friendAPI";
import { useQuery } from "@tanstack/react-query";

const useFriendRequestList = (userId: number) => {
const {
  data: listFriendRequest,
  isLoading: isFriendRequestLoading,
  error: isFriendRequestError,
} = useQuery({
  queryKey: ["listFriendRequest", userId],
  queryFn: async () =>{
  const response = await friendAPI.listRequestFriend(userId);
  return response?.data;
  } ,
})
return {listFriendRequest, isFriendRequestLoading, isFriendRequestError};
};

export default useFriendRequestList;
