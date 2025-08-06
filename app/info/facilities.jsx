import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FacilitiesScreen = () => {
  const router = useRouter();

  const facilities = [
    {
      id: 1,
      name: "Phòng khám HIV Care Hub - Cơ sở chính",
      address: "FPT University HCMC, 7 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh 700000, Vietnam",
      phone: "028-3822-5555",
      email: "info@hivcarehub.vn",
      workingHours: "Thứ 2 - Thứ 7: 7:00 - 17:00",
      services: [
        "Tư vấn và xét nghiệm HIV",
        "Điều trị ARV",
        "Tư vấn dinh dưỡng",
        "Hỗ trợ tâm lý",
        "Theo dõi và chăm sóc định kỳ"
      ],
      doctors: [
        { name: "TS.BS Nguyễn Văn An", specialty: "Nhiễm khuẩn" },
        { name: "BS.CKI Trần Thị Bình", specialty: "Nội khoa" },
        { name: "ThS.BS Lê Văn Cường", specialty: "Tâm lý học" }
      ],
      facilities_detail: [
        "Phòng khám hiện đại với trang thiết bị y tế tiên tiến",
        "Phòng xét nghiệm đạt tiêu chuẩn quốc tế",
        "Khu vực tư vấn riêng tư và thoải mái",
        "Hệ thống bảo mật thông tin bệnh nhân tuyệt đối"
      ]
    },
    // {
    //   id: 2,
    //   name: "HIV Care Hub - Chi nhánh Quận 3",
    //   address: "456 Đường Võ Văn Tần, Quận 3, TP.HCM",
    //   phone: "028-3933-7777",
    //   email: "q3@hivcarehub.vn",
    //   workingHours: "Thứ 2 - Thứ 6: 8:00 - 17:00",
    //   services: [
    //     "Tư vấn và xét nghiệm HIV",
    //     "Điều trị ARV",
    //     "Chăm sóc sức khỏe tổng quát"
    //   ],
    //   doctors: [
    //     { name: "BS.CKII Phạm Thị Dung", specialty: "Nhiễm khuẩn" },
    //     { name: "BS Hoàng Văn Em", specialty: "Nội khoa" }
    //   ],
    //   facilities_detail: [
    //     "Cơ sở mới với không gian hiện đại",
    //     "Phòng khám được thiết kế thân thiện",
    //     "Khu vực chờ thoải mái và riêng tư"
    //   ]
    // }
  ];

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleMap = (address) => {
    const encodedAddress = encodeURIComponent(address);
    Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <LinearGradient
        colors={['#3b82f6', '#1d4ed8']}
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
            Thông tin cơ sở
          </Text>
          <Text style={{
            fontSize: 14,
            color: 'rgba(255, 255, 255, 0.9)',
          }}>
            Hệ thống phòng khám HIV Care Hub
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
            <View style={{
              width: 80,
              height: 80,
              backgroundColor: '#3b82f6',
              borderRadius: 40,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <Ionicons name="medical" size={40} color="white" />
            </View>
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#1f2937',
              textAlign: 'center',
              marginBottom: 8,
            }}>
              HIV Care Hub
            </Text>
            <Text style={{
              fontSize: 16,
              color: '#6b7280',
              textAlign: 'center',
              lineHeight: 24,
            }}>
              Hệ thống chăm sóc sức khỏe toàn diện cho người nhiễm HIV/AIDS với đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm
            </Text>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 16,
          }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#3b82f6' }}>15+</Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Năm kinh nghiệm</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#10b981' }}>5000+</Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Bệnh nhân</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#f59e0b' }}>24/7</Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Hỗ trợ</Text>
            </View>
          </View>
        </View>

        {/* Facilities List */}
        {facilities.map((facility, index) => (
          <View
            key={facility.id}
            style={{
              marginHorizontal: 20,
              marginBottom: 20,
              backgroundColor: 'white',
              borderRadius: 16,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            {/* Facility Header */}
            <LinearGradient
              colors={index === 0 ? ['#3b82f6', '#1d4ed8'] : ['#10b981', '#059669']}
              style={{ padding: 16 }}
            >
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: 'white',
                marginBottom: 4,
              }}>
                {facility.name}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="location" size={16} color="rgba(255, 255, 255, 0.9)" />
                <Text style={{
                  fontSize: 14,
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginLeft: 4,
                  flex: 1,
                }}>
                  {facility.address}
                </Text>
              </View>
            </LinearGradient>

            <View style={{ padding: 16 }}>
              {/* Contact Info */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: 8,
                }}>
                  Thông tin liên hệ
                </Text>
                
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 8,
                  }}
                  onPress={() => handleCall(facility.phone)}
                >
                  <Ionicons name="call" size={20} color="#3b82f6" />
                  <Text style={{
                    fontSize: 14,
                    color: '#3b82f6',
                    marginLeft: 8,
                    fontWeight: '500',
                  }}>
                    {facility.phone}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 8,
                  }}
                  onPress={() => handleEmail(facility.email)}
                >
                  <Ionicons name="mail" size={20} color="#3b82f6" />
                  <Text style={{
                    fontSize: 14,
                    color: '#3b82f6',
                    marginLeft: 8,
                    fontWeight: '500',
                  }}>
                    {facility.email}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 8,
                  }}
                  onPress={() => handleMap(facility.address)}
                >
                  <Ionicons name="map" size={20} color="#3b82f6" />
                  <Text style={{
                    fontSize: 14,
                    color: '#3b82f6',
                    marginLeft: 8,
                    fontWeight: '500',
                  }}>
                    Xem bản đồ
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Working Hours */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: 8,
                }}>
                  Giờ làm việc
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#6b7280',
                  lineHeight: 20,
                }}>
                  {facility.workingHours}
                </Text>
              </View>

              {/* Services */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: 8,
                }}>
                  Dịch vụ
                </Text>
                {facility.services.map((service, idx) => (
                  <View
                    key={idx}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 4,
                    }}
                  >
                    <View style={{
                      width: 6,
                      height: 6,
                      backgroundColor: '#3b82f6',
                      borderRadius: 3,
                      marginRight: 8,
                    }} />
                    <Text style={{
                      fontSize: 14,
                      color: '#6b7280',
                    }}>
                      {service}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Doctors */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: 8,
                }}>
                  Đội ngũ bác sĩ
                </Text>
                {facility.doctors.map((doctor, idx) => (
                  <View
                    key={idx}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 4,
                    }}
                  >
                    <View style={{
                      width: 8,
                      height: 8,
                      backgroundColor: '#10b981',
                      borderRadius: 4,
                      marginRight: 8,
                    }} />
                    <Text style={{
                      fontSize: 14,
                      color: '#1f2937',
                      fontWeight: '500',
                      flex: 1,
                    }}>
                      {doctor.name}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: '#6b7280',
                      backgroundColor: '#f3f4f6',
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 8,
                    }}>
                      {doctor.specialty}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Facilities Detail */}
              <View>
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: 8,
                }}>
                  Cơ sở vật chất
                </Text>
                {facility.facilities_detail.map((item, idx) => (
                  <View
                    key={idx}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 4,
                    }}
                  >
                    <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                    <Text style={{
                      fontSize: 14,
                      color: '#6b7280',
                      marginLeft: 8,
                      flex: 1,
                    }}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}

        {/* Footer */}
        <View style={{
          margin: 20,
          padding: 20,
          backgroundColor: '#f8fafc',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#e5e7eb',
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#1f2937',
            textAlign: 'center',
            marginBottom: 8,
          }}>
            Cam kết của chúng tôi
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#6b7280',
            textAlign: 'center',
            lineHeight: 22,
          }}>
            Chúng tôi cam kết cung cấp dịch vụ chăm sóc sức khỏe chất lượng cao,
            bảo mật thông tin bệnh nhân tuyệt đối và tạo môi trường thân thiện,
            không phán xét cho tất cả bệnh nhân.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FacilitiesScreen;
