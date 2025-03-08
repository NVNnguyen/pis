import Http from "@/utils/Http";
import { getToken } from "@/utils/storage";

const BASE_URL_FRIEND = `/friends`;
let http: any;

const initHttp = async () => {
  const token = await getToken();
  http = new Http(token || "").instance;
};
initHttp(); // Gọi khi app khởi động


const friendAPI = {
    follow: async (userId: number, friendId: number) => {
      try {
        const response = await http.post(`${BASE_URL_FRIEND}/follow`, {
        userId, 
        friendId ,
        });
        console.log(response.message)
        console.log("follow with: ", userId, friendId);
        console.log(response?.data?.message)
        return response?.data?.message;
      } catch (error) {
        console.error("Error fetching follow api for :", error);
        throw error;
      }
    },
      unFollow: async (userId: number, friendId: number) => {
        try {
            const response = await http.delete(`${BASE_URL_FRIEND}/unfollow`, {
              data: { userId, friendId }, 
        });
            console.log(response?.data?.message)
            return response?.data?.message;
        } catch (error) {
            console.error("Error fetching unFollow api for :", error);
            throw error;
        }
    },  
      addFriend: async (userId: number, friendId: number) => {
        try {
          const response = await http.post(`${BASE_URL_FRIEND}/friendRequest`, {
            "userId": userId, 
            "friendId": friendId ,
          });
          console.log(response?.data?.message)
          return response?.data?.message;
        } catch (error) {
          console.error("Error fetching addFriend api for :", error);
          throw error;
        }
      },
      unFriend: async (userId: number, friendId: number) => {
        try {
          const response = await http.delete(`${BASE_URL_FRIEND}/cancelFriendRequest`, {
            "userId": userId, 
            "friendId": friendId ,
          });
          console.log(response?.data?.message)
        return response?.data?.message;
        } catch (error) {
          console.error("Error fetching unFriend api for :", error);
          throw error;
        }
      },
      acceptFriend: async (userId: number, friendId: number) => {
        try {
          const response = await http.put(`${BASE_URL_FRIEND}/acceptFriend`, {
            "userId": userId, 
            "friendId": friendId ,
          });
          console.log(response?.data?.message)
          return response?.data?.message;;
        } catch (error) {
          console.error("Error fetching acceptFriend API for :", error);
          throw error;
        }
      },
      rejectFriend: async (userId: number, friendId: number) => {
        try {
          const response = await http.put(`${BASE_URL_FRIEND}/rejectFriend`, {
            "userId": userId, 
            "friendId": friendId ,
          });
          console.log(response?.data?.message)
          return response?.data?.message;
        } catch (error) {
          console.error("Error fetching rejectFriend for :", error);
          throw error;
        }
      },
   
  };
  
  export default friendAPI;