import { create } from "zustand";

const useNavigationStore = create((set) => ({
  pendingHref: null,
  setPendingHref: (href) => set({ pendingHref: href }),
  firstRender: 0,
  setFirstRender: (data) => set({ firstRender: data }),
  statusHref: false,
  setStatusHref: (href) => set({ statusHref: href }),
  clearPendingHref: () => set({ pendingHref: null }),
}));

export default useNavigationStore;