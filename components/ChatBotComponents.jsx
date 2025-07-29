import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

const ChatBotFloatingButton = () => {
  const router = useRouter();

  const openChatBot = () => {
    router.push('/tabs/chat');
  };

  return (
    <TouchableOpacity
      onPress={openChatBot}
      className="absolute bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full items-center justify-center shadow-lg"
      style={{
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <Ionicons name="chatbubble-ellipses" size={24} color="white" />
    </TouchableOpacity>
  );
};

const ChatBotCard = () => {
  const router = useRouter();

  const openChatBot = () => {
    router.push('/tabs/chat');
  };

  return (
    <TouchableOpacity
      onPress={openChatBot}
      className="bg-white rounded-xl p-4 mb-4 shadow-lg border border-gray-100"
    >
      <View className="flex-row items-center">
        <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
          <Ionicons name="chatbubble-ellipses" size={24} color="#3B82F6" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800 mb-1">Trợ lý AI Y tế</Text>
          <Text className="text-sm text-gray-600">Hỏi đáp về sức khỏe với AI</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
};

export { ChatBotCard, ChatBotFloatingButton };

