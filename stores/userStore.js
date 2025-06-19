import { create } from 'zustand';

/**
 * Store quản lý thông tin người dùng
 */
const useUserStore = create((set, get) => ({
  // State
  userProfile: null,
  isLoading: false,
  error: null,

  // Actions
  setUserProfile: (profile) => set({ userProfile: profile }),
  
  /**
   * Lấy thông tin hồ sơ người dùng từ API
   * @param {string} userId - ID của người dùng
   */
  fetchUserProfile: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      
      // Giả lập dữ liệu người dùng (trong dự án thực tế, bạn sẽ gọi API ở đây)
      const mockProfile = {
        id: userId || '1',
        fullName: 'Mai Thu Hằng',
        email: 'mai.hang@gmail.com',
        phone: '0912345678',
        role: 'Bệnh nhân',
        avatarUrl: 'https://i.pravatar.cc/150?img=12'
      };
      
      // Giả lập delay của network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ userProfile: mockProfile });
      return mockProfile;
    } catch (error) {
      console.error("Fetch user profile error:", error);
      set({ error: error.message });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  
  /**
   * Cập nhật thông tin hồ sơ người dùng
   * @param {Object} profileData - Dữ liệu cần cập nhật
   */
  updateUserProfile: async (profileData) => {
    try {
      set({ isLoading: true, error: null });
      
      // Giả lập API request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Cập nhật state với dữ liệu mới
      const currentProfile = get().userProfile || {};
      const updatedProfile = { ...currentProfile, ...profileData };
      set({ userProfile: updatedProfile });
      
      return updatedProfile;
    } catch (error) {
      console.error("Update user profile error:", error);
      set({ error: error.message });
      return null;
    } finally {
      set({ isLoading: false });
    }
  }
}));

export default useUserStore;
