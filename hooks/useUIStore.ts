import { create } from "zustand";

type UIState = {
  isCreatePostOpen: boolean;
  openCreatePost: () => void;
  closeCreatePost: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  isCreatePostOpen: false,
  openCreatePost: () => set({ isCreatePostOpen: true }),
  closeCreatePost: () => set({ isCreatePostOpen: false }),
}));
