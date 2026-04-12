import { create } from 'zustand';

export const useUIStore = create((set) => ({
  activeModal: '',
  isLoading: false,
  isMobileMenuOpen: false,
  toast: null,
  setActiveModal: (activeModal) => set({ activeModal }),
  setLoading: (isLoading) => set({ isLoading }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  showToast: (toast) => set({ toast }),
  clearToast: () => set({ toast: null }),
}));
