// hooks/useSearchUsers.js
import infoAPI from "@/api/infoAPI";
import postsAPI from "@/api/postsAPI";
import { useQuery } from "@tanstack/react-query";

const useSearchUsers = (text: string, userId: number)=>{
    
  const {
    data: search ,
    isLoading: isSearchLoading,
    error: searchError,
  } = useQuery({
    queryKey: ["searchUsers", text],
    queryFn: async () => {
      const response = await infoAPI.searchFriend(text, userId);
      return response.data;
    },
    enabled: !!text,
    staleTime: 5 * 60 * 1000 // cache 5 phút
  });
return {
    search,
    isSearchLoading,
    searchError
}
};
export default useSearchUsers;