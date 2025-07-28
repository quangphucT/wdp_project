import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getProfileUserApi } from "../../services/auth/getProfileUserApi";
import { updateProfileUserApi } from "../../services/auth/updateProfileUserApi";
import { deleteAvatarFromFirebase, uploadAvatarToFirebase } from "../../services/firebase/avatarService";
import useAuthStore from "../../stores/authStore";

const ProfilePatient = () => {
  const { user } = useAuthStore();
  const [dataProfile, setDataProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      const response = await getProfileUserApi();
      console.log("Profile response:", response.data);
      
      if (response.data && response.data.data) {
        setDataProfile(response.data.data);
        setEditForm({
          name: response.data.data.name || "",
          phoneNumber: response.data.data.phoneNumber || "",
          email: response.data.data.email || "",
          avatar: response.data.data.avatar || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin profile");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchProfile(true);
  };

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Thông báo', 'Cần quyền truy cập thư viện ảnh để thay đổi avatar');
        return false;
      }
    }
    return true;
  };

  const handleChooseAvatar = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    Alert.alert(
      'Chọn ảnh',
      'Bạn muốn chọn ảnh từ đâu?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Thư viện',
          onPress: () => pickImageFromLibrary(),
        },
        {
          text: 'Chụp ảnh',
          onPress: () => takePhoto(),
        },
      ]
    );
  };

  const pickImageFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await handleAvatarUpload(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Thông báo', 'Cần quyền truy cập camera để chụp ảnh');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await handleAvatarUpload(result.assets[0]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Lỗi', 'Không thể chụp ảnh');
    }
  };

  const handleAvatarUpload = async (imageAsset) => {
    try {
      setIsUploadingAvatar(true);
      
      // Get user ID from current user state or dataProfile
      let userId = user?.id || dataProfile?.id;
      
      // If not available, try to get from SecureStore
      if (!userId) {
        try {
          const storedUserId = await SecureStore.getItemAsync('userId');
          userId = storedUserId;
        } catch (error) {
          console.error('Error getting userId from SecureStore:', error);
        }
      }
      
      if (!userId) {
        Alert.alert('Lỗi', 'Không thể xác định người dùng');
        return;
      }

      // Upload to Firebase and get download URL
      const avatarUrl = await uploadAvatarToFirebase(imageAsset, userId);

      // Delete old avatar if exists
      if (dataProfile?.avatar) {
        await deleteAvatarFromFirebase(dataProfile.avatar);
      }

      // Update profile with new avatar URL
      const response = await updateProfileUserApi({
        avatar: avatarUrl
      });
      
      if (response.data) {
        // Update local state
        setDataProfile(prev => ({
          ...prev,
          avatar: avatarUrl,
        }));
        
        setEditForm(prev => ({
          ...prev,
          avatar: avatarUrl,
        }));
        
        Alert.alert('Thành công', 'Cập nhật avatar thành công!');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      
      const errorMessage = error.message || 
                          error.response?.data?.message || 
                          'Không thể cập nhật avatar';
      
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      
      // Validate input
      if (!editForm.name.trim()) {
        Alert.alert("Lỗi", "Vui lòng nhập họ và tên");
        return;
      }

      const response = await updateProfileUserApi({
        name: editForm.name.trim(),
        phoneNumber: editForm.phoneNumber.trim(),
      });
      
      if (response.data) {
        // Update local state with new data
        setDataProfile(prev => ({
          ...prev,
          name: editForm.name.trim(),
          phoneNumber: editForm.phoneNumber.trim(),
        }));
        
        setIsEditing(false);
        Alert.alert("Thành công", "Cập nhật profile thành công!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Không thể cập nhật profile";
      
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa xác định";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return '#4CAF50';
      case 'INACTIVE': return '#F44336';
      case 'PENDING': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE': return 'Hoạt động';
      case 'INACTIVE': return 'Không hoạt động';
      case 'PENDING': return 'Chờ xử lý';
      default: return 'Không xác định';
    }
  };

  if (isLoading && !dataProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  if (!dataProfile) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#F44336" />
        <Text style={styles.errorText}>Không thể tải thông tin profile</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProfile}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={['#2196F3']}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(true)}
        >
          <Ionicons name="create-outline" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <TouchableOpacity 
          style={styles.avatarContainer} 
          onPress={handleChooseAvatar}
          disabled={isUploadingAvatar}
        >
          {dataProfile.avatar ? (
            <Image source={{ uri: dataProfile.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={50} color="#9E9E9E" />
            </View>
          )}
          
          {/* Upload overlay */}
          <View style={styles.avatarOverlay}>
            {isUploadingAvatar ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="camera" size={24} color="white" />
            )}
          </View>
        </TouchableOpacity>
        
        <Text style={styles.name}>{dataProfile.name}</Text>
        <Text style={styles.changeAvatarText}>
          {isUploadingAvatar ? 'Đang upload...' : 'Nhấn để thay đổi ảnh đại diện'}
        </Text>
        
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(dataProfile.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {getStatusText(dataProfile.status)}
            </Text>
          </View>
        </View>
      </View>

      {/* Profile Information */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
        
        <View style={styles.infoItem}>
          <View style={styles.infoLabel}>
            <Ionicons name="mail-outline" size={20} color="#666" />
            <Text style={styles.labelText}>Email</Text>
          </View>
          <Text style={styles.infoValue}>{dataProfile.email}</Text>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoLabel}>
            <Ionicons name="call-outline" size={20} color="#666" />
            <Text style={styles.labelText}>Số điện thoại</Text>
          </View>
          <Text style={styles.infoValue}>
            {dataProfile.phoneNumber || "Chưa cập nhật"}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoLabel}>
            <Ionicons name="id-card-outline" size={20} color="#666" />
            <Text style={styles.labelText}>ID</Text>
          </View>
          <Text style={styles.infoValue}>{dataProfile.id}</Text>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoLabel}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.labelText}>Ngày tạo</Text>
          </View>
          <Text style={styles.infoValue}>{formatDate(dataProfile.createdAt)}</Text>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoLabel}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.labelText}>Cập nhật lần cuối</Text>
          </View>
          <Text style={styles.infoValue}>{formatDate(dataProfile.updatedAt)}</Text>
        </View>
      </View>

      {/* Update Profile Modal */}
      <Modal
        visible={isEditing}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsEditing(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Cập nhật thông tin</Text>
            <TouchableOpacity onPress={handleUpdateProfile} disabled={isLoading}>
              <Text style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}>
                Lưu
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Avatar Section in Modal */}
            <View style={styles.modalAvatarSection}>
              <Text style={styles.inputLabel}>Ảnh đại diện</Text>
              <TouchableOpacity 
                style={styles.modalAvatarContainer} 
                onPress={handleChooseAvatar}
                disabled={isUploadingAvatar}
              >
                {editForm.avatar || dataProfile.avatar ? (
                  <Image 
                    source={{ uri: editForm.avatar || dataProfile.avatar }} 
                    style={styles.modalAvatar} 
                  />
                ) : (
                  <View style={styles.modalAvatarPlaceholder}>
                    <Ionicons name="person" size={40} color="#9E9E9E" />
                  </View>
                )}
                
                <View style={styles.modalAvatarOverlay}>
                  {isUploadingAvatar ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Ionicons name="camera" size={20} color="white" />
                  )}
                </View>
              </TouchableOpacity>
              <Text style={styles.modalAvatarText}>
                {isUploadingAvatar ? 'Đang upload...' : 'Nhấn để thay đổi ảnh'}
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Họ và tên</Text>
              <TextInput
                style={styles.textInput}
                value={editForm.name}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, name: text }))}
                placeholder="Nhập họ và tên"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                value={editForm.email}
                editable={false}
                placeholder="Email"
              />
              <Text style={styles.helpText}>Email không thể thay đổi</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Số điện thoại</Text>
              <TextInput
                style={styles.textInput}
                value={editForm.phoneNumber}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, phoneNumber: text }))}
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    padding: 8,
  },
  avatarSection: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 30,
    marginTop: 10,
  },
  avatarContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  changeAvatarText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: 'white',
    marginTop: 10,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  infoItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
  saveButtonDisabled: {
    color: '#ccc',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  disabledInput: {
    backgroundColor: '#f8f8f8',
    color: '#999',
  },
  helpText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  modalAvatarSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalAvatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  modalAvatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalAvatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  modalAvatarText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default ProfilePatient;
