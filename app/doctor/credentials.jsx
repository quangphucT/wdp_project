import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllDoctorApi } from '../../services/doctor/getInforDoctorApi';
import useAuthStore from '../../stores/authStore';

const DoctorCredentialsScreen = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      if (user?.id) {
        try {
          setIsLoading(true);
          const response = await getAllDoctorApi(user.id);
          setDoctorInfo(response.data.data);
        } catch (error) {
          console.error('Error fetching doctor info:', error);
          Alert.alert('Lỗi', 'Không thể tải thông tin bác sĩ');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDoctorInfo();
  }, [user?.id]);

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={{ marginTop: 16, color: '#6b7280' }}>Đang tải thông tin...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <LinearGradient
        colors={['#10b981', '#059669']}
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
            Bằng cấp & Chuyên môn
          </Text>
          <Text style={{
            fontSize: 14,
            color: 'rgba(255, 255, 255, 0.9)',
          }}>
            Thông tin chuyên môn của bác sĩ
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {doctorInfo ? (
          <>
            {/* Doctor Profile Card */}
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
              <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <View style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: '#10b981',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 12,
                }}>
                  <Text style={{ fontSize: 32, color: 'white' }}>👨‍⚕️</Text>
                </View>
                <Text style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: '#1f2937',
                  textAlign: 'center',
                }}>
                  {doctorInfo.user?.name || 'Bác sĩ'}
                </Text>
                <Text style={{
                  fontSize: 16,
                  color: '#6b7280',
                  textAlign: 'center',
                }}>
                  {doctorInfo.user?.email}
                </Text>
                <Text style={{
                  fontSize: 16,
                  color: '#6b7280',
                  textAlign: 'center',
                }}>
                  {doctorInfo.user?.phoneNumber}
                </Text>
              </View>

              {/* Status Badge */}
              <View style={{
                alignItems: 'center',
                marginBottom: 20,
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: doctorInfo.isAvailable ? '#dcfce7' : '#fee2e2',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                }}>
                  <View style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: doctorInfo.isAvailable ? '#22c55e' : '#ef4444',
                    marginRight: 8,
                  }} />
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: doctorInfo.isAvailable ? '#166534' : '#991b1b',
                  }}>
                    {doctorInfo.isAvailable ? 'Đang hoạt động' : 'Không hoạt động'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Specialization Card */}
            <View style={{
              marginHorizontal: 20,
              marginBottom: 20,
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
              }}>
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#3b82f6',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}>
                  <Ionicons name="medical" size={24} color="white" />
                </View>
                <Text style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#1f2937',
                }}>
                  Chuyên khoa
                </Text>
              </View>
              
              <View style={{
                backgroundColor: '#f0f9ff',
                padding: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#bfdbfe',
              }}>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: '#1e40af',
                  textAlign: 'center',
                }}>
                  {doctorInfo.specialization || 'Chưa cập nhật'}
                </Text>
              </View>
            </View>

            {/* Certifications Card */}
            <View style={{
              marginHorizontal: 20,
              marginBottom: 20,
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
              }}>
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#f59e0b',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}>
                  <Ionicons name="ribbon" size={24} color="white" />
                </View>
                <Text style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#1f2937',
                }}>
                  Bằng cấp & Chứng chỉ
                </Text>
              </View>

              {doctorInfo.certifications && doctorInfo.certifications.length > 0 ? (
                doctorInfo.certifications.map((cert, index) => (
                  <View key={index} style={{
                    backgroundColor: '#fef3c7',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: '#fbbf24',
                  }}>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                      <Ionicons name="checkmark-circle" size={20} color="#d97706" style={{ marginRight: 8 }} />
                      <Text style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: '#92400e',
                        flex: 1,
                      }}>
                        {cert}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={{
                  backgroundColor: '#f3f4f6',
                  padding: 16,
                  borderRadius: 8,
                  alignItems: 'center',
                }}>
                  <Text style={{
                    fontSize: 14,
                    color: '#6b7280',
                    fontStyle: 'italic',
                  }}>
                    Chưa có thông tin bằng cấp
                  </Text>
                </View>
              )}
            </View>

            {/* Professional Info Card */}
            <View style={{
              marginHorizontal: 20,
              marginBottom: 20,
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
              }}>
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#8b5cf6',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}>
                  <Ionicons name="information-circle" size={24} color="white" />
                </View>
                <Text style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#1f2937',
                }}>
                  Thông tin nghề nghiệp
                </Text>
              </View>

              <View style={{
                backgroundColor: '#f8fafc',
                padding: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#e2e8f0',
              }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>Vai trò:</Text>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#1f2937' }}>
                    {doctorInfo.user?.role?.name || 'DOCTOR'}
                  </Text>
                </View>
                
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>Ngày tham gia:</Text>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#1f2937' }}>
                    {new Date(doctorInfo.createdAt).toLocaleDateString('vi-VN')}
                  </Text>
                </View>

                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>Cập nhật cuối:</Text>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#1f2937' }}>
                    {new Date(doctorInfo.updatedAt).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
              </View>
            </View>

          </>
        ) : (
          <View style={{
            margin: 20,
            padding: 40,
            backgroundColor: 'white',
            borderRadius: 16,
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: 18,
              color: '#6b7280',
              textAlign: 'center',
            }}>
              Không thể tải thông tin bác sĩ
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DoctorCredentialsScreen;
