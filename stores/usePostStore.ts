import { create } from "zustand";
import { PostItemType } from "@/utils/types/PostItemType";

interface PostStoreState {
  postsStore: PostItemType[]; // Danh sách bài viết
  setPosts: (posts: PostItemType[]) => void; // Cập nhật danh sách bài viết
  getPostById: (postId: number) => PostItemType | undefined; // Lấy bài viết theo ID
}

const usePostStore = create<PostStoreState>((set, get) => ({
  postsStore: [],
  setPosts: (postsStore) => set({ postsStore }),

  getPostById: (postId) => {
    console.log("find post with postId :", postId);
    return get().postsStore.find((post) => post?.id === postId);
  },
}));

export default usePostStore;
