import { FollowListType } from "@/utils/types/FollowListType";
import { create } from "zustand";


interface FollowStoreState {
  followStore: FollowListType;
  setFollow: (follows: FollowListType) => void; // Cập nhật danh 
  resetFollow: () => void; // Thêm hàm reset
}

const useFollowStore = create<FollowStoreState>((set) => ({
  followStore: {} as FollowListType,
  setFollow: (followStore) => set({ followStore }),
  resetFollow: () => set({ followStore: {} as FollowListType }), // Reset danh sách follow
}));

export default useFollowStore;
