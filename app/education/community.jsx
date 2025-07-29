import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Linking,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CommunityScreen = () => {
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const supportGroups = [
    {
      id: 1,
      name: "Nhóm Hỗ trợ HIV/AIDS TP.HCM",
      type: "Nhóm hỗ trợ địa phương",
      description: "Gặp gỡ trực tiếp, chia sẻ kinh nghiệm và hỗ trợ lẫn nhau",
      location: "Quận 1, TP. Hồ Chí Minh",
      schedule: "Thứ 7 hàng tuần, 14:00-16:00",
      contact: "0901234567",
      email: "hivhcm@support.vn",
      color: "#ef4444",
      icon: "👥",
      features: [
        "Chia sẻ kinh nghiệm điều trị",
        "Hỗ trợ tâm lý từ đồng đội",
        "Tư vấn dinh dưỡng và sức khỏe",
        "Hoạt động giải trí cuối tuần"
      ]
    },
    {
      id: 2,
      name: "Diễn đàn HIV+ Online",
      type: "Cộng đồng trực tuyến",
      description: "Không gian an toàn để thảo luận và hỗ trợ 24/7",
      location: "Trực tuyến",
      schedule: "24/7",
      contact: "chat@hivforum.vn",
      email: "admin@hivforum.vn",
      color: "#06b6d4",
      icon: "💻",
      features: [
        "Thảo luận ẩn danh",
        "Tư vấn từ chuyên gia",
        "Chia sẻ thông tin mới nhất",
        "Nhóm chat riêng tư"
      ]
    },
    {
      id: 3,
      name: "Mạng lưới Người nhiễm HIV Việt Nam",
      type: "Tổ chức phi lợi nhuận",
      description: "Đấu tranh cho quyền lợi và hỗ trợ pháp lý",
      location: "Toàn quốc",
      schedule: "Thứ 2-6, 8:00-17:00",
      contact: "1900456789",
      email: "contact@vnp.org.vn",
      color: "#059669",
      icon: "⚖️",
      features: [
        "Tư vấn pháp lý miễn phí",
        "Đấu tranh chống kỳ thị",
        "Hỗ trợ quyền lợi bệnh nhân",
        "Vận động chính sách"
      ]
    },
    {
      id: 4,
      name: "Câu lạc bộ Sống tích cực",
      type: "Hoạt động thể thao & giải trí",
      description: "Yoga, thể dục, du lịch và các hoạt động vui chơi",
      location: "Công viên Tao Đàn, Q.1",
      schedule: "Chủ nhật, 6:00-8:00",
      contact: "0909876543",
      email: "positive@club.vn",
      color: "#f59e0b",
      icon: "🏃‍♂️",
      features: [
        "Yoga buổi sáng",
        "Đi bộ nhóm",
        "Tour du lịch ngắn ngày",
        "Sinh hoạt câu lạc bộ"
      ]
    },
    {
      id: 5,
      name: "Nhóm Hỗ trợ Gia đình",
      type: "Dành cho gia đình & người thân",
      description: "Hỗ trợ gia đình có người thân nhiễm HIV",
      location: "Bệnh viện Chợ Rẫy",
      schedule: "Thứ 3 & 6, 18:00-20:00",
      contact: "0912345678",
      email: "family@support.vn",
      color: "#8b5cf6",
      icon: "👨‍👩‍👧‍👦",
      features: [
        "Tư vấn cho gia đình",
        "Hướng dẫn chăm sóc",
        "Chia sẻ kinh nghiệm",
        "Hỗ trợ tài chính khẩn cấp"
      ]
    },
    {
      id: 6,
      name: "Nhóm Phụ nữ mang thai",
      type: "Dành cho phụ nữ nhiễm HIV",
      description: "Hỗ trợ thai kỳ an toàn và chăm sóc trẻ em",
      location: "Bệnh viện Từ Dũ",
      schedule: "Thứ 5, 14:00-16:00",
      contact: "0987654321",
      email: "women@hivcare.vn",
      color: "#ec4899",
      icon: "🤱",
      features: [
        "Tư vấn thai kỳ an toàn",
        "Hỗ trợ dinh dưỡng",
        "Chăm sóc sau sinh",
        "Tư vấn nuôi con"
      ]
    }
  ];

  const resources = [
    {
      title: "Đường dây nóng 24/7",
      phone: "1900456789",
      description: "Hỗ trợ khẩn cấp và tư vấn"
    },
    {
      title: "Tư vấn tâm lý",
      phone: "0283456789",
      description: "Chuyên gia tâm lý HIV"
    },
    {
      title: "Hỗ trợ pháp lý",
      phone: "1900123456",
      description: "Tư vấn quyền lợi và pháp luật"
    }
  ];

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleJoinGroup = (group) => {
    Alert.alert(
      "Tham gia nhóm",
      `Bạn muốn tham gia ${group.name}?`,
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Gọi điện",
          onPress: () => handleCall(group.contact)
        },
        {
          text: "Gửi email",
          onPress: () => handleEmail(group.email)
        }
      ]
    );
  };

  const openModal = (group) => {
    setSelectedGroup(group);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <LinearGradient
        colors={['#059669', '#10b981']}
        style={{
          paddingHorizontal: 20,
          paddingVertical: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
          }}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: 'white',
          }}>
            Cộng đồng hỗ trợ
          </Text>
          <Text style={{
            fontSize: 14,
            color: 'rgba(255, 255, 255, 0.9)',
          }}>
            Kết nối và chia sẻ cùng nhau
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Introduction */}
        <View style={{
          margin: 20,
          padding: 20,
          backgroundColor: 'white',
          borderRadius: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#1f2937',
              textAlign: 'center',
              marginBottom: 8,
            }}>
              🤝 Cộng đồng hỗ trợ HIV
            </Text>
            <Text style={{
              fontSize: 16,
              color: '#6b7280',
              textAlign: 'center',
              lineHeight: 24,
            }}>
              Bạn không đơn độc! Hãy kết nối với những người cùng hoàn cảnh và những người sẵn sàng hỗ trợ.
            </Text>
          </View>
        </View>

        {/* Emergency Resources */}
        <View style={{
          marginHorizontal: 20,
          marginBottom: 20,
          padding: 20,
          backgroundColor: '#fef2f2',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#fecaca',
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#dc2626',
            marginBottom: 12,
            textAlign: 'center',
          }}>
            🚨 Hỗ trợ khẩn cấp
          </Text>
          
          {resources.map((resource, index) => (
            <TouchableOpacity
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 16,
                backgroundColor: 'white',
                borderRadius: 12,
                marginBottom: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
              onPress={() => handleCall(resource.phone)}
            >
              <Ionicons name="call" size={24} color="#dc2626" style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#1f2937',
                }}>
                  {resource.title}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#6b7280',
                  marginBottom: 2,
                }}>
                  {resource.description}
                </Text>
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#dc2626',
                }}>
                  {resource.phone}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Support Groups */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: 16,
          }}>
            📋 Nhóm hỗ trợ
          </Text>

          {supportGroups.map((group) => (
            <TouchableOpacity
              key={group.id}
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                marginBottom: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
                overflow: 'hidden',
              }}
              onPress={() => openModal(group)}
            >
              <LinearGradient
                colors={[group.color, `${group.color}CC`]}
                style={{
                  padding: 16,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ fontSize: 32, marginRight: 12 }}>{group.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: 'white',
                      marginBottom: 4,
                    }}>
                      {group.name}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: '600',
                    }}>
                      {group.type}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="white" />
                </View>
                
                <Text style={{
                  fontSize: 14,
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: 20,
                  marginBottom: 12,
                }}>
                  {group.description}
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Ionicons name="location-outline" size={16} color="rgba(255, 255, 255, 0.9)" />
                  <Text style={{
                    fontSize: 14,
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginLeft: 8,
                  }}>
                    {group.location}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="time-outline" size={16} color="rgba(255, 255, 255, 0.9)" />
                  <Text style={{
                    fontSize: 14,
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginLeft: 8,
                  }}>
                    {group.schedule}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tips for joining support groups */}
        <View style={{
          margin: 20,
          padding: 20,
          backgroundColor: '#f0f9ff',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#bae6fd',
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#0369a1',
            marginBottom: 12,
            textAlign: 'center',
          }}>
            💡 Lời khuyên khi tham gia nhóm hỗ trợ
          </Text>
          
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 14, color: '#0369a1', fontWeight: '600' }}>
              ✅ Hãy mở lòng và thành thật
            </Text>
          </View>
          
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 14, color: '#0369a1', fontWeight: '600' }}>
              ✅ Tôn trọng sự riêng tư của người khác
            </Text>
          </View>
          
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 14, color: '#0369a1', fontWeight: '600' }}>
              ✅ Lắng nghe và chia sẻ kinh nghiệm
            </Text>
          </View>
          
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 14, color: '#0369a1', fontWeight: '600' }}>
              ✅ Tham gia thường xuyên để xây dựng mối quan hệ
            </Text>
          </View>
          
          <View>
            <Text style={{ fontSize: 14, color: '#0369a1', fontWeight: '600' }}>
              ✅ Đừng ngại hỏi khi cần hỗ trợ
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
          {selectedGroup && (
            <>
              <LinearGradient
                colors={[selectedGroup.color, `${selectedGroup.color}CC`]}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 16,
                  }}
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 32, marginRight: 12 }}>{selectedGroup.icon}</Text>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'white',
                    flex: 1,
                  }}>
                    {selectedGroup.name}
                  </Text>
                </View>
              </LinearGradient>

              <ScrollView style={{ flex: 1, padding: 20 }}>
                <View style={{
                  backgroundColor: 'white',
                  borderRadius: 16,
                  padding: 20,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                  marginBottom: 20,
                }}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: 8,
                  }}>
                    Về nhóm này
                  </Text>
                  <Text style={{
                    fontSize: 16,
                    color: '#374151',
                    lineHeight: 24,
                    marginBottom: 16,
                  }}>
                    {selectedGroup.description}
                  </Text>

                  <View style={{ marginBottom: 16 }}>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#1f2937',
                      marginBottom: 8,
                    }}>
                      📍 Địa điểm
                    </Text>
                    <Text style={{
                      fontSize: 16,
                      color: '#374151',
                    }}>
                      {selectedGroup.location}
                    </Text>
                  </View>

                  <View style={{ marginBottom: 16 }}>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#1f2937',
                      marginBottom: 8,
                    }}>
                      ⏰ Lịch sinh hoạt
                    </Text>
                    <Text style={{
                      fontSize: 16,
                      color: '#374151',
                    }}>
                      {selectedGroup.schedule}
                    </Text>
                  </View>

                  <View style={{ marginBottom: 20 }}>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#1f2937',
                      marginBottom: 8,
                    }}>
                      🎯 Hoạt động chính
                    </Text>
                    {selectedGroup.features.map((feature, index) => (
                      <Text key={index} style={{
                        fontSize: 16,
                        color: '#374151',
                        marginBottom: 4,
                      }}>
                        • {feature}
                      </Text>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={{
                      backgroundColor: selectedGroup.color,
                      paddingVertical: 12,
                      paddingHorizontal: 24,
                      borderRadius: 12,
                      alignItems: 'center',
                      marginBottom: 12,
                    }}
                    onPress={() => handleJoinGroup(selectedGroup)}
                  >
                    <Text style={{
                      color: 'white',
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}>
                      🤝 Tham gia nhóm
                    </Text>
                  </TouchableOpacity>

                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        backgroundColor: '#f3f4f6',
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        borderRadius: 12,
                        alignItems: 'center',
                        marginRight: 8,
                      }}
                      onPress={() => handleCall(selectedGroup.contact)}
                    >
                      <Text style={{
                        color: '#374151',
                        fontSize: 14,
                        fontWeight: 'bold',
                      }}>
                        📞 Gọi điện
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        flex: 1,
                        backgroundColor: '#f3f4f6',
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        borderRadius: 12,
                        alignItems: 'center',
                        marginLeft: 8,
                      }}
                      onPress={() => handleEmail(selectedGroup.email)}
                    >
                      <Text style={{
                        color: '#374151',
                        fontSize: 14,
                        fontWeight: 'bold',
                      }}>
                        ✉️ Email
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default CommunityScreen;
