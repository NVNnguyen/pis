import friendAPI from "@/api/friendAPI";
import { useQuery } from "@tanstack/react-query";

const useListFriend = (userIdProp: number) => {
const {
  data: listFriend,
  isLoading: isFriendLoading,
  error: isFriendError,
} = useQuery({
  queryKey: ["listFriend", userIdProp],
  queryFn: async () =>{
  const response = await friendAPI.listFriend(userIdProp);
  return response?.data;
  } ,
})
return {listFriend, isFriendLoading, isFriendError};
};

export default useListFriend;
