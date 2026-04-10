import { create } from 'zustand';

export const useUIStore = create((set) => ({
  activeModal: '',
  isLoading: false,
  toast: null,
  setActiveModal: (activeModal) => set({ activeModal }),
  setLoading: (isLoading) => set({ isLoading }),
  showToast: (toast) => set({ toast }),
  clearToast: () => set({ toast: null }),
}));
