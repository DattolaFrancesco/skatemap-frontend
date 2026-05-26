import { create } from "zustand";

const useNavigationStore = create((set) => ({
  pendingHref: null,
  setPendingHref: (href) => set({ pendingHref: href }),
  statusHref: false,
  setStatusHref: (href) => set({ statusHref: href }),
  clearPendingHref: () => set({ pendingHref: null }),
}));

export default useNavigationStore;