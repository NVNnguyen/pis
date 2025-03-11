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
          return response?.data?.message;
        } catch (error) {
          console.error("Error fetching addFriend api for :", error);
          throw error;
        }
      },
      unFriend: async (userId: number, friendId: number) => {
        try {
          const response = await http.delete(`${BASE_URL_FRIEND}/unfriend`, {
             userId, 
            friendId ,
          });
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
          return response?.data?.message;
        } catch (error) {
          console.error("Error fetching rejectFriend for :", error);
          throw error;
        }
      },
      listFriend: async (userId: number) => {
        try {
          const response = await http.get(`${BASE_URL_FRIEND}/${userId}`);
          return response?.data
        } catch (error) {
          console.error("Error fetching rejectFriend for :", error);
          throw error;
        }
      },
      blockFriend: async (userId: number, friendId: number) => {
        // Kiểm tra dữ liệu đầu vào (optional)
        if (!userId || !friendId) {
          throw new Error("userId and friendId are required");
        }
        
        try {
          const response = await http.put(`${BASE_URL_FRIEND}/blockFriend`, {
            userId: userId,
            friendId: friendId
          });
          console.log("Response block friend:", response?.data);
          return response?.data;
        } catch (error) {
          console.error("Error blocking friend:", error);
          throw error;
        }
      },
      unClockFriend:  async (userId: number, friendId: number) => {
        try {
          const response = await http.put(`${BASE_URL_FRIEND}/unblockFriend`, {
            userId,
            friendId
          });
          console.log("response unCLock: ", response?.data)
          return response?.data
        } catch (error) {
          console.error("Error fetching rejectFriend for :", error);
          throw error;
        }
      },
      listRequestFriend: async (userId: number) => {
        try {
          const response = await http.get(`${BASE_URL_FRIEND}/requestFriends/${userId}`);
          console.log("response requestFriend list: ", response?.data)
          return response?.data
        } catch (error) {
          console.error("Error requestFriend list for :", error);
          throw error;
        }
      },
   
  };
  
  export default friendAPI;