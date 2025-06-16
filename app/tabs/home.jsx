// Không đổi phần import
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import logoImage from '../../assets/images/logo.png'

const HomeScreen = () => {
  const router = useRouter();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const services = [
    'Điều trị HIV',
    'Xét nghiệm các bệnh xã hội',
    'Xét nghiệm HIV',
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#1e88e5', '#1565c0']}
        style={styles.header}
      >
        <View style={styles.logoContainer}>
          <Image
            source={logoImage}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/auth/login")}
        >
          <Text style={styles.loginText}>Đăng nhập</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Navigation Menu */}
      <View style={styles.navMenu}>
        {['DỊCH VỤ', 'XÉT NGHIỆM HIV', 'TIN TỨC'].map((item, index) => (
          <View key={index} style={styles.navItemContainer}>
            <TouchableOpacity
              style={styles.navItem}
              onPress={item === 'DỊCH VỤ' ? () => setIsDropdownVisible(!isDropdownVisible) : null}
            >
              <Text style={styles.navText}>{item}</Text>
            </TouchableOpacity>
            {item === 'DỊCH VỤ' && isDropdownVisible && (
              <View style={styles.dropdown}>
                {services.map((service, idx) => (
                  <TouchableOpacity key={idx} style={styles.dropdownItem}>
                    <Text style={styles.dropdownText}>{service}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Banner */}
      <LinearGradient
        colors={['#64b5f6', '#1e88e5']}
        style={styles.banner}
      >
        <Text style={styles.bannerText}>Khám phá dịch vụ xét nghiệm HIV an toàn và nhanh chóng!</Text>
        <TouchableOpacity style={styles.bannerButton}>
          <Text style={styles.bannerButtonText}>Tìm hiểu thêm</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Dịch vụ Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Các dịch vụ</Text>
        <View style={styles.serviceCard}>
          <Text style={styles.serviceText}>Dịch vụ xét nghiệm HIV</Text>
          <Text style={styles.serviceDesc}>Nhanh chóng, chính xác, bảo mật.</Text>
        </View>
        <View style={styles.serviceCard}>
          <Text style={styles.serviceText}>Tư vấn sức khỏe</Text>
          <Text style={styles.serviceDesc}>Hỗ trợ tận tâm, chuyên nghiệp.</Text>
        </View>
      </View>

      {/* Blog Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Blog</Text>
        <View style={styles.blogCard}>
          <Text style={styles.blogText}>Hiểu biết về HIV</Text>
          <Text style={styles.blogDesc}>Thông tin quan trọng bạn cần biết.</Text>
        </View>
        <View style={styles.blogCard}>
          <Text style={styles.blogText}>Sống tích cực với HIV</Text>
          <Text style={styles.blogDesc}>Hành trình vượt qua khó khăn.</Text>
        </View>
      </View>

      {/* Footer */}
      <LinearGradient
        colors={['#1e88e5', '#1565c0']}
        style={styles.footer}
      >
        <Text style={styles.footerText}>© 2025 Dịch vụ xét nghiệm HIV</Text>
        <Text style={styles.footerText}>Liên hệ: support@hivtest.com</Text>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 40,
    paddingBottom: 20,
  },
  logoContainer: {
    width: 180,
    height: 50,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  loginButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 25,
  },
  loginText: {
    color: '#1e88e5',
    fontWeight: 'bold',
    fontSize: 14,
  },
  navMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dfe3e8',
    paddingVertical: 12,
  },
  navItemContainer: {
    position: 'relative',
  },
  navItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  navText: {
    color: '#1e88e5',
    fontSize: 14,
    fontWeight: '600',
  },
  dropdown: {
    position: 'absolute',
    top: 38,
    left: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
    width: 180,
  },
  dropdownItem: {
    padding: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  banner: {
    height: 180,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    padding: 20,
  },
  bannerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  bannerButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  bannerButtonText: {
    color: '#1e88e5',
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e88e5',
    marginBottom: 15,
    textAlign: 'center',
  },
  serviceCard: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  serviceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  serviceDesc: {
    fontSize: 14,
    color: '#4b5563',
  },
  blogCard: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  blogText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  blogDesc: {
    fontSize: 14,
    color: '#4b5563',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
    marginVertical: 5,
  },
});

export default HomeScreen;
