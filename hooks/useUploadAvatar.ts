import infoAPI from "@/api/infoAPI";
import { useQuery, useQueryClient } from "@tanstack/react-query"

const useUploadAvatar = ( formData: FormData | null , userIdProp: number) => {
    const queryClient = useQueryClient();
 const {
        data: upLoadAvatar,
        isLoading: isUpLoadAvatarLoading,
        error: isUpLoadAvatarError
    } = useQuery({
        queryKey: ["upLoadAvatar",userIdProp],
        queryFn: async () =>{
            if (formData === null) return; 
            const response = await infoAPI.uploadAvatar(formData, userIdProp);
            queryClient.invalidateQueries({ queryKey: ["userInfo", userIdProp] });
            queryClient.invalidateQueries({
              queryKey: ["postsProfile", userIdProp],
            });
            return response?.data;
        },
        enabled: !!userIdProp && !!formData,
    })
    return {upLoadAvatar, isUpLoadAvatarLoading, isUpLoadAvatarError}
}

export default useUploadAvatar;