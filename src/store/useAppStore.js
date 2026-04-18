import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mendefinisikan Store
const useAppStore = create(
  persist(
    (set) => ({
      user: null, // State untuk menyimpan data user
      accessToken: null,
      refreshToken: null,
      selectedBranch: null, // State untuk menyimpan branch yang dipilih
      isSidebarOpen: true, // State untuk UI kontrol (contoh)
      
      // Action untuk memperbarui user beserta token
      setAuth: (userData, accessToken, refreshToken) => set({ user: userData, accessToken, refreshToken }),

      // Action untuk memilih branch
      setSelectedBranch: (branch) => set({ selectedBranch: branch }),

      // Action untuk memperbarui user
      setUser: (userData) => set({ user: userData }),
      
      // Action untuk menghapus user (Logout)
      clearUser: () => set({ user: null, accessToken: null, refreshToken: null, selectedBranch: null }),

      // Action for logout that clears all user data
      logout: () => set({ user: null, accessToken: null, refreshToken: null, selectedBranch: null, isSidebarOpen: true }),
      
      // Action untuk toggle sidebar
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    }),
    {
      name: 'app-storage', // key in localStorage
    }
  )
);

export default useAppStore;
