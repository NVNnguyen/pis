import friendAPI from "@/api/friendAPI";
import postsAPI from "@/api/postsAPI";
import { useQuery } from "@tanstack/react-query";


const useProfileInformation = (userId: number, friendId: number) => {

    const {
        data: profileInformation,
        isLoading: isProfileDetailLoading,
        error: postProfileError,
    } = useQuery({
        queryKey: ["profileInformation", friendId],
        queryFn: async () => {
            const response = await friendAPI.profile(
                userId, friendId
            );
            return response?.data;
        },
        enabled: !!friendId,
     
    });
    return { profileInformation, isProfileDetailLoading, postProfileError };
};
export default useProfileInformation;