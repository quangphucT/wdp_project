import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { create } from 'zustand';

/**
 * Store quản lý các tính năng của ứng dụng
 */
const useFeatureStore = create((set, get) => ({
  // Các dịch vụ chính hiển thị trên home
  mainFeatures: [
    {
      id: 'medicine',
      title: "Lịch uống thuốc",
      desc: "Theo dõi thuốc",
      icon: <MaterialCommunityIcons name="pill" size={24} color="#1e88e5" />,
      bgColor: "bg-blue-50",
      route: '/user/lich_uong_thuoc',
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
      id: 'appointments',
      title: "Quản lí cuộc hẹn",
      desc: "Xem & nhắc nhở",
      icon: <MaterialCommunityIcons name="calendar-clock" size={24} color="#d81b60" />,
      bgColor: "bg-pink-50",
      route: '/user/user_appointment',
    },
    {
      id: 'news',
      title: "Tin tức",
      desc: "Cập nhật mới",
      icon: <MaterialCommunityIcons name="newspaper-variant-outline" size={24} color="#ff9800" />,
      bgColor: "bg-orange-50",
      route: '/blogs/blog',
    }
  ],

  // Nhóm dịch vụ y tế
  medicalServices: [
    {
      id: 'book_appointments',
      title: "Đặt lịch cuộc hẹn",
      desc: "Đặt lịch khám",
      icon: "📅",
      bgColor: "bg-red-50",
      route: '/user/book_appointment',
    },
    {
      id: 'facility_info',
      title: "Thông tin cơ sở",
      desc: "Giới thiệu phòng khám",
      icon: "🏥",
      bgColor: "bg-blue-50",
      route: '/info/facilities',
    },
    {
      id: 'profile',
      title: "Cập nhật hồ sơ",
      desc: "Thông tin cá nhân",
      icon: <FontAwesome5 name="user-edit" size={24} color="#43a047" />,
      bgColor: "bg-green-50",
      route: '/user/profile_patient',
    }
  ],

  // Nhóm hỗ trợ HIV
  hivSupport: [
    {
      id: 'hiv_education',
      title: "Tài liệu giáo dục HIV",
      desc: "Kiến thức về HIV/AIDS",
      icon: "📚",
      bgColor: "bg-green-50",
      route: '/education/hiv-guide',
    },
    {
      id: 'hiv_quiz',
      title: "Quiz kiến thức HIV",
      desc: "Kiểm tra hiểu biết về HIV",
      icon: "🧠",
      bgColor: "bg-blue-50",
      route: '/education/hiv-quiz',
    },
    {
      id: 'stigma_reduction',
      title: "Giảm kỳ thị HIV",
      desc: "Thay đổi nhận thức",
      icon: "🤝",
      bgColor: "bg-purple-50",
      route: '/education/stigma-reduction',
    },
    {
      id: 'community_support',
      title: "Hỗ trợ cộng đồng",
      desc: "Chia sẻ & kết nối",
      icon: "�",
      bgColor: "bg-cyan-50",
      route: '/education/community',
    }
  ],

  // Lấy danh sách tính năng chính
  getMainFeatures: () => get().mainFeatures,

  // Lấy nhóm dịch vụ y tế
  getMedicalServices: () => get().medicalServices,

  // Lấy nhóm hỗ trợ HIV
  getHivSupport: () => get().hivSupport,

  // Lấy tất cả features (để tương thích với code cũ)
  getFeatures: () => [...get().mainFeatures, ...get().medicalServices, ...get().hivSupport],

  // Lấy tính năng theo id
  getFeatureById: (id) => {
    const allFeatures = [...get().mainFeatures, ...get().medicalServices, ...get().hivSupport];
    return allFeatures.find(feature => feature.id === id);
  },

  // Lấy tính năng theo route
  getFeatureByRoute: (route) => {
    const allFeatures = [...get().mainFeatures, ...get().medicalServices, ...get().hivSupport];
    return allFeatures.find(feature => feature.route === route);
  }
}));

export default useFeatureStore;
