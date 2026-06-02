import { create } from "zustand";
const useChatStore = create((set)=>({
    chat: [],
    setChat: (updater) => set((state)=>({chat:updater(state.chat)})),
}))
export default useChatStore;