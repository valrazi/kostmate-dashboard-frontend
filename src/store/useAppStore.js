import { create } from 'zustand';

// Mendefinisikan Store
const useAppStore = create((set) => ({
  user: null, // State untuk menyimpan data user
  isSidebarOpen: true, // State untuk UI kontrol (contoh)
  
  // Action untuk memperbarui user
  setUser: (userData) => set({ user: userData }),
  
  // Action untuk menghapus user (Logout)
  clearUser: () => set({ user: null }),

  // Action for logout that clears all user data
  logout: () => set({ user: null, isSidebarOpen: true }),
  
  // Action untuk toggle sidebar
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

export default useAppStore;
