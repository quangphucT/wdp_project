import {
  Entypo,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { logoutApi } from "../services/auth/logoutApi";
const HomeScreen = () => {
  const router = useRouter();
const [isAuthenticated, setIsAuthenticated] = useState(null); 
 useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) {
        router.replace("/auth/login"); // đá về trang login nếu chưa có token
      } else {
        setIsAuthenticated(true); // cho phép hiển thị màn hình nếu có token
      }
    };

    checkToken();
  }, []);

  if (isAuthenticated === null) {
    // Đang kiểm tra token
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Đang kiểm tra đăng nhập...</Text>
      </View>
    );
  }

  const features = [
    {
      title: "Lịch uống thuốc",
      desc: "Theo dõi thuốc",
      icon: <MaterialCommunityIcons name="pill" size={24} color="#1e88e5" />,
      bgColor: "#e3f2fd",
    },
    {
      title: "Hồ sơ bệnh án",
      desc: "Xem lịch sử",
      icon: <FontAwesome5 name="file-medical-alt" size={24} color="#9c27b0" />,
      bgColor: "#f3e5f5",
    },
    {
      title: "Cập nhật hồ sơ",
      desc: "Thông tin cá nhân",
      icon: <FontAwesome5 name="user-edit" size={24} color="#43a047" />,
      bgColor: "#e8f5e9",
    },
    {
      title: "Tin tức",
      desc: "Cập nhật mới",
      icon: (
        <MaterialCommunityIcons
          name="newspaper-variant-outline"
          size={24}
          color="#ff9800"
        />
      ),
      bgColor: "#fff3e0",
    },
    {
      title: "Meeting Record",
      desc: "Tư vấn video cá nhân",
      icon: <Entypo name="video" size={24} color="#00acc1" />,
      bgColor: "#e0f7fa",
    },
    {
      title: "Quản lí cuộc hẹn",
      desc: "Xem & nhắc nhở",
      icon: (
        <MaterialCommunityIcons
          name="calendar-clock"
          size={24}
          color="#d81b60"
        />
      ),
      bgColor: "#fce4ec",
    },
  ];
  const handleLogout = async() =>{
    try {
const refreshToken = await SecureStore.getItemAsync('refreshToken');
console.log("RefreshToken:", refreshToken)
       await logoutApi({
           refreshToken: refreshToken
})
      await SecureStore.deleteItemAsync('accessToken');
           await SecureStore.deleteItemAsync('refreshToken');
           router.push('/auth/login');
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ScrollView style={styles.container}>
      {/* Greeting */}
      <View style={styles.header}>
  <View style={styles.avatarCircle}>
    <Text style={styles.avatarLetter}>M</Text>
  </View>
  <View style={{ flex: 1 }}>
    <Text style={styles.greetingText}>Xin chào, Mai</Text>
    <Text style={styles.subGreeting}>Chúc bạn một ngày tốt lành</Text>
  </View>
  <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
    <Text style={styles.logoutText}>Đăng xuất</Text>
  </TouchableOpacity>
</View>


      {/* Features Grid */}
      <View style={styles.gridContainer}>
        {features.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: item.bgColor }]}
            onPress={() => {
              if (item.title === "Hồ sơ bệnh án") {
               router.push('/user/record_patient');

              }else if(item.title === "Tin tức"){
                  router.push('/blogs/blog');
              }
              // Có thể thêm điều kiện khác ở đây cho các tính năng khác
            }}
          >
            {item.icon}
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Today */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hôm nay</Text>
        <View style={styles.todayItem}>
          <Text style={styles.todayTitle}>💊 Thuốc cần uống</Text>
          <Text style={styles.todayDesc}>3 loại thuốc vào buổi sáng</Text>
        </View>
        <View style={styles.todayItem}>
          <Text style={styles.todayTitle}>📅 Lịch tái khám</Text>
          <Text style={styles.todayDesc}>15:00 - Bác sĩ Nguyễn Văn A</Text>
        </View>
      </View>

      {/* News */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tin tức mới nhất</Text>
        <View style={styles.newsCard}>
          <View style={styles.newsImageMock} />
          <View>
            <Text style={styles.newsTitle}>Cách phòng ngừa bệnh mùa hè</Text>
            <Text style={styles.newsDesc}>Các biện pháp bảo vệ sức khỏe</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f7fa",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1e88e5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarLetter: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  greetingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  subGreeting: {
    fontSize: 13,
    color: "#666",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginTop: 10,
  },
  card: {
    width: "47%",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginTop: 8,
  },
  cardDesc: {
    fontSize: 12,
    color: "#666",
  },
  section: {
    backgroundColor: "#fff",
    margin: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e88e5",
    marginBottom: 12,
  },
  todayItem: {
    marginBottom: 10,
  },
  todayTitle: {
    fontWeight: "600",
    fontSize: 14,
  },
  todayDesc: {
    fontSize: 13,
    color: "#555",
  },
  newsCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  newsImageMock: {
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },
  newsDesc: {
    fontSize: 13,
    color: "#666",
  },
});

export default HomeScreen;
