import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const TestAvatarPicker = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Thông báo', 'Cần quyền truy cập thư viện ảnh để chọn ảnh');
        return false;
      }
    }
    return true;
  };

  const handleChooseImage = async () => {
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
          text: 'Thư viện ảnh',
          onPress: () => pickImageFromLibrary(),
        },
        {
          text: 'Chụp ảnh mới',
          onPress: () => takePhoto(),
        },
        {
          text: 'Mở Gallery khác',
          onPress: () => openAlternativeGallery(),
        },
      ]
    );
  };

  const pickImageFromLibrary = async () => {
    try {
      setIsLoading(true);
      console.log('Opening image library...');

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1, // Max quality for testing
        allowsMultipleSelection: false,
        presentationStyle: ImagePicker.UIImagePickerPresentationStyle.AUTOMATIC,
      });

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageAsset = result.assets[0];
        console.log('Selected image:', {
          uri: imageAsset.uri,
          width: imageAsset.width,
          height: imageAsset.height,
          type: imageAsset.type,
          fileSize: imageAsset.fileSize
        });

        setSelectedImage(imageAsset.uri);
        Alert.alert('Thành công', `Đã chọn ảnh!\nKích thước: ${imageAsset.width}x${imageAsset.height}\nDung lượng: ${Math.round(imageAsset.fileSize / 1024)}KB`);
      } else {
        console.log('No image selected or canceled');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', `Không thể chọn ảnh: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const openAlternativeGallery = async () => {
    try {
      setIsLoading(true);
      console.log('Opening alternative gallery...');

      // Try with different options to access more sources
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Disable editing to see more sources
        quality: 1,
        allowsMultipleSelection: false,
        presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN,
      });

      console.log('Alternative gallery result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageAsset = result.assets[0];
        console.log('Selected image from alternative:', {
          uri: imageAsset.uri,
          width: imageAsset.width,
          height: imageAsset.height,
          type: imageAsset.type,
          fileSize: imageAsset.fileSize
        });

        setSelectedImage(imageAsset.uri);
        Alert.alert('Thành công', `Đã chọn ảnh từ gallery khác!\nKích thước: ${imageAsset.width}x${imageAsset.height}\nDung lượng: ${Math.round(imageAsset.fileSize / 1024)}KB`);
      } else {
        Alert.alert('Thông báo', 'Không có ảnh nào được chọn. Hãy thử:\n1. Download ảnh từ Google Photos về thiết bị\n2. Sử dụng ảnh từ Downloads folder\n3. Chụp ảnh mới với camera');
      }
    } catch (error) {
      console.error('Error opening alternative gallery:', error);
      Alert.alert('Lỗi', `Không thể mở gallery: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const takePhoto = async () => {
    try {
      setIsLoading(true);
      console.log('Requesting camera permission...');

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Thông báo', 'Cần quyền truy cập camera để chụp ảnh');
        return;
      }

      console.log('Opening camera...');

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1, // Max quality for testing
      });

      console.log('Camera result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageAsset = result.assets[0];
        console.log('Captured image:', {
          uri: imageAsset.uri,
          width: imageAsset.width,
          height: imageAsset.height,
          type: imageAsset.type,
          fileSize: imageAsset.fileSize
        });

        setSelectedImage(imageAsset.uri);
        Alert.alert('Thành công', `Đã chụp ảnh!\nKích thước: ${imageAsset.width}x${imageAsset.height}\nDung lượng: ${Math.round(imageAsset.fileSize / 1024)}KB`);
      } else {
        console.log('No photo taken or canceled');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Lỗi', `Không thể chụp ảnh: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    Alert.alert('Đã xóa', 'Đã xóa ảnh đã chọn');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Test Avatar Picker</Text>
        <Text style={styles.subtitle}>Kiểm tra chức năng chọn ảnh thật</Text>
      </View>

      {/* Avatar Display */}
      <View style={styles.avatarSection}>
        <TouchableOpacity 
          style={styles.avatarContainer} 
          onPress={handleChooseImage}
          disabled={isLoading}
        >
          {selectedImage ? (
            <Image 
              source={{ uri: selectedImage }} 
              style={styles.avatar}
              onError={(error) => {
                console.error('Image load error:', error);
                Alert.alert('Lỗi', 'Không thể hiển thị ảnh');
              }}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="image-outline" size={50} color="#9E9E9E" />
            </View>
          )}
          
          {/* Overlay */}
          <View style={styles.avatarOverlay}>
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="camera" size={24} color="white" />
            )}
          </View>
        </TouchableOpacity>

        <Text style={styles.instructionText}>
          {isLoading ? 'Đang xử lý...' : 'Nhấn để chọn/chụp ảnh'}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonSection}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={handleChooseImage}
          disabled={isLoading}
        >
          <Ionicons name="images-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Chọn ảnh</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.alternativeButton]} 
          onPress={() => pickImageFromLibrary()}
          disabled={isLoading}
        >
          <Ionicons name="folder-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Thư viện cục bộ</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.alternativeButton]} 
          onPress={() => takePhoto()}
          disabled={isLoading}
        >
          <Ionicons name="camera-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Chụp ảnh</Text>
        </TouchableOpacity>

        {selectedImage && (
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={clearImage}
            disabled={isLoading}
          >
            <Ionicons name="trash-outline" size={20} color="#666" />
            <Text style={[styles.buttonText, { color: '#666' }]}>Xóa ảnh</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Image Info */}
      {selectedImage && (
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Thông tin ảnh:</Text>
          <Text style={styles.infoText}>URI: {selectedImage}</Text>
          <Text style={styles.infoText}>Trạng thái: Đã tải thành công ✅</Text>
        </View>
      )}

      {/* Instructions */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>💡 Hướng dẫn:</Text>
        <Text style={styles.infoText}>• Google Photos: Download ảnh về thiết bị trước</Text>
        <Text style={styles.infoText}>• Gallery: Chỉ hiển thị ảnh lưu cục bộ</Text>
        <Text style={styles.infoText}>• Camera: Chụp ảnh mới sẽ lưu vào thiết bị</Text>
        <Text style={styles.infoText}>• Downloads: Kiểm tra thư mục Downloads</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  avatarSection: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 40,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  avatarPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  buttonSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
  },
  alternativeButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: 'white',
  },
  infoSection: {
    backgroundColor: 'white',
    margin: 20,
    padding: 15,
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

export default TestAvatarPicker;
