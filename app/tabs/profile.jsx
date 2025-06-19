import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image, ScrollView,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';
import useAuthStore from '../../stores/authStore';
import { useAuthCheck } from '../../utils/auth';

const Profile = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthCheck(router);

  // Sử dụng Zustand store
  const { logout, user } = useAuthStore(state => ({
    logout: state.logout,
    user: state.user
  }));

  // Local state cho form
  const [formData, setFormData] = useState({
    email: '', phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Cập nhật giá trị form
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Cập nhật form khi có dữ liệu từ store
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
      }));
    }
  }, [user]);

  // Xử lý lưu thay đổi
  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      // Kiểm tra nếu đang thay đổi mật khẩu
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setSaveMessage('Mật khẩu mới không khớp');
          return;
        }

        if (!formData.currentPassword) {
          setSaveMessage('Vui lòng nhập mật khẩu hiện tại');
          return;
        }

        // Ở đây có thể thêm logic gọi API đổi mật khẩu
      }

      setSaveMessage('Lưu thay đổi thành công');

      // Xóa các trường mật khẩu
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Update profile error:', error);
      setSaveMessage('Lỗi khi cập nhật thông tin');
    } finally {
      setIsSaving(false);
    }
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    logout(router);
  };

  if (authLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2">Đang tải...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return null; // Router sẽ tự redirect sang màn hình login
  }

  return (
    <ScrollView className="flex-1 bg-white p-4">
      {/* Header */}
      <View className="mb-5 flex-row justify-between items-center">
        <View>          <Text className="text-lg font-semibold">
          Xin chào, {user?.name?.split(' ').pop() || 'User'}
        </Text>
          <Text className="text-base font-semibold mt-1.5">Cập nhật hồ sơ</Text>
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          className="px-3 py-1 bg-red-50 rounded-full"
        >
          <Text className="text-red-500 text-sm">Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar + Name */}
      <View className="items-center mb-5">
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
          className="w-20 h-20 rounded-full mb-2.5"
        />
        <Text className="text-lg font-semibold">{user?.name || 'User'}</Text>
        <Text className="text-sm text-gray-500">{user?.role || 'Người dùng'}</Text>
      </View>

      {/* Save Message */}
      {saveMessage ? (
        <View className={`p-3 rounded-lg mb-3 ${saveMessage.includes('thành công') ? 'bg-green-100' : 'bg-red-100'}`}>
          <Text className={saveMessage.includes('thành công') ? 'text-green-700' : 'text-red-700'}>
            {saveMessage}
          </Text>
        </View>
      ) : null}

      {/* Input Fields */}
      <View className="space-y-3">
        <TextInput
          className="border border-gray-300 rounded-lg p-3 bg-gray-50"
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
          placeholder="Email"
          keyboardType="email-address"
        />
        <TextInput
          className="border border-gray-300 rounded-lg p-3 bg-gray-50"
          value={formData.phone}
          onChangeText={(text) => handleChange('phone', text)}
          placeholder="Số điện thoại"
          keyboardType="phone-pad"
        />

        <View className="h-px bg-gray-200 my-2" />
        <Text className="text-base font-medium text-gray-700">Đổi mật khẩu</Text>

        <TextInput
          className="border border-gray-300 rounded-lg p-3 bg-gray-50"
          value={formData.currentPassword}
          onChangeText={(text) => handleChange('currentPassword', text)}
          placeholder="Mật khẩu hiện tại"
          secureTextEntry
        />
        <TextInput
          className="border border-gray-300 rounded-lg p-3 bg-gray-50"
          value={formData.newPassword}
          onChangeText={(text) => handleChange('newPassword', text)}
          placeholder="Mật khẩu mới"
          secureTextEntry
        />
        <TextInput
          className="border border-gray-300 rounded-lg p-3 bg-gray-50"
          value={formData.confirmPassword}
          onChangeText={(text) => handleChange('confirmPassword', text)}
          placeholder="Xác nhận mật khẩu mới"
          secureTextEntry
        />

        {/* Save Button */}
        <TouchableOpacity
          className={`rounded-lg p-3 items-center mt-2 ${isSaving ? 'bg-blue-300' : 'bg-blue-500'}`}
          onPress={handleSaveChanges}
          disabled={isSaving}
        >
          {isSaving ? (
            <View className="flex-row items-center">
              <ActivityIndicator size="small" color="#ffffff" />
              <Text className="text-white font-semibold ml-2">Đang lưu...</Text>
            </View>
          ) : (
            <Text className="text-white font-semibold">Lưu thay đổi</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Forgot Password */}
      <View className="mt-6 bg-blue-50 p-4 rounded-lg">
        <Text className="font-semibold text-base">Quên mật khẩu?</Text>
        <Text className="text-sm text-gray-600 my-1">
          Nhận mã xác nhận qua email để đặt lại mật khẩu mới.
        </Text>
        <TouchableOpacity>
          <Text className="text-blue-600 font-medium mt-1">📩 Gửi yêu cầu</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;
