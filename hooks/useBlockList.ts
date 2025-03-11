import friendAPI from "@/api/friendAPI";
import { useQuery } from "@tanstack/react-query";

const useBlockList = (userId: number) => {
const {
  data: listBlock,
  isLoading: isListBlockLoading,
  error: isListBlockError,
} = useQuery({
  queryKey: ["listBlock", userId],
  queryFn: async () =>{
  const response = await friendAPI.listBlockFriend(userId);
  return response?.data;
  } ,
  enabled: !!userId
})
return {listBlock, isListBlockLoading, isListBlockError};
};

export default useBlockList;
