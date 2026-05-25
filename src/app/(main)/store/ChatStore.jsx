import { create } from "zustand";
const useChatStore = create((set)=>({
    chat: [],
    setChat: (updater) => set((state)=>({chat:updater(state.chat)})),
    allowBot:false,
    setAllowBot: (data)=>set({allowBot:data})
}))
export default useChatStore;