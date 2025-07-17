// Simplified ProfilePatient for testing without Firebase
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    TouchableOpacity,
    View,
} from "react-native";
import { pickAvatarSimple, takePhotoSimple } from "../services/avatar/simpleAvatarService";

const SimpleAvatarTest = () => {
  const [avatarUri, setAvatarUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChooseAvatar = async () => {
    Alert.alert(
      'Chọn ảnh',
      'Bạn muốn chọn ảnh từ đâu?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Thư viện', onPress: handlePickFromLibrary },
        { text: 'Chụp ảnh', onPress: handleTakePhoto },
      ]
    );
  };

  const handlePickFromLibrary = async () => {
    try {
      setIsLoading(true);
      const uri = await pickAvatarSimple();
      if (uri) {
        setAvatarUri(uri);
        Alert.alert('Thành công', 'Đã chọn ảnh thành công!');
      }
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      setIsLoading(true);
      const uri = await takePhotoSimple();
      if (uri) {
        setAvatarUri(uri);
        Alert.alert('Thành công', 'Đã chụp ảnh thành công!');
      }
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity 
        onPress={handleChooseAvatar} 
        disabled={isLoading}
        style={{
          width: 150,
          height: 150,
          borderRadius: 75,
          backgroundColor: '#f0f0f0',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {avatarUri ? (
          <Image 
            source={{ uri: avatarUri }} 
            style={{ width: 150, height: 150, borderRadius: 75 }}
          />
        ) : (
          <Ionicons name="person" size={60} color="#999" />
        )}
        
        <View style={{
          position: 'absolute',
          bottom: 5,
          right: 5,
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: '#2196F3',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="camera" size={20} color="white" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SimpleAvatarTest;
