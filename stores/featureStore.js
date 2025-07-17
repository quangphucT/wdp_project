import { Entypo, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { create } from 'zustand';

/**
 * Store quản lý các tính năng của ứng dụng
 */
const useFeatureStore = create((set, get) => ({
  // State
  features: [
    {
      id: 'medicine',
      title: "Lịch uống thuốc",
      desc: "Theo dõi thuốc",
      icon: <MaterialCommunityIcons name="pill" size={24} color="#1e88e5" />,
      bgColor: "bg-blue-50",
      route: '/tabs/schedule',
    },
    {
      id: 'records',
      title: "Hồ sơ bệnh án",
      desc: "Xem lịch sử",
      icon: <FontAwesome5 name="file-medical-alt" size={24} color="#9c27b0" />,
      bgColor: "bg-purple-50",
      route: '/user/record_patient',
    },
    {
      id: 'profile',
      title: "Cập nhật hồ sơ",
      desc: "Thông tin cá nhân",
      icon: <FontAwesome5 name="user-edit" size={24} color="#43a047" />,
      bgColor: "bg-green-50",
      route: '/user/profile_patient',
    },
    {
      id: 'news',
      title: "Tin tức",
      desc: "Cập nhật mới",
      icon: (
        <MaterialCommunityIcons
          name="newspaper-variant-outline"
          size={24}
          color="#ff9800"
        />
      ),
      bgColor: "bg-orange-50",
      route: '/blogs/blog',
    },
    {
      id: 'meeting',
      title: "Meeting Record",
      desc: "Tư vấn video cá nhân",
      icon: <Entypo name="video" size={24} color="#00acc1" />,
      bgColor: "bg-cyan-50",
      route: null, // Chưa có màn hình cụ thể
    },
    {
      id: 'appointments',
      title: "Quản lí cuộc hẹn",
      desc: "Xem & nhắc nhở",
      icon: (
        <MaterialCommunityIcons
          name="calendar-clock"
          size={24}
          color="#d81b60"
        />
      ),
      bgColor: "bg-pink-50",
      route: '/tabs/schedule',
    },
  ],

  // Lấy danh sách tính năng
  getFeatures: () => get().features,

  // Lấy tính năng theo id
  getFeatureById: (id) => get().features.find(feature => feature.id === id),

  // Lấy tính năng theo route
  getFeatureByRoute: (route) => get().features.find(feature => feature.route === route),

  // Thêm tính năng mới
  addFeature: (feature) => {
    if (!feature.id) {
      feature.id = Date.now().toString();
    }
    set(state => ({
      features: [...state.features, feature]
    }));
    return feature.id;
  },

  // Cập nhật tính năng
  updateFeature: (id, updatedFeature) => {
    set(state => ({
      features: state.features.map(feature => 
        feature.id === id ? { ...feature, ...updatedFeature } : feature
      )
    }));
  },

  // Xóa tính năng
  removeFeature: (id) => {
    set(state => ({
      features: state.features.filter(feature => feature.id !== id)
    }));
  }
}));

export default useFeatureStore;
