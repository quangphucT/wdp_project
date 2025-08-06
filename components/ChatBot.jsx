import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import GeminiService from '../configs/geminiConfig'; // Giả sử bạn đã tạo service này để gọi API AI

const { height } = Dimensions.get('window');

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Xin chào! Tôi là trợ lý AI y tế. Tôi có thể giúp bạn trả lời các câu hỏi về sức khỏe. Bạn cần hỗ trợ gì?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    // Auto scroll to bottom when new message is added
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (inputText.trim() === '' || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await GeminiService.sendHealthcareMessage(inputText.trim());
      
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorText = 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.';
      let alertTitle = 'Lỗi kết nối';
      let alertMessage = 'Không thể kết nối đến dịch vụ AI. Vui lòng thử lại sau.';
      
      if (error.message?.includes('quota')) {
        errorText = 'Dịch vụ AI hiện đang bận. Vui lòng thử lại sau ít phút hoặc liên hệ bác sĩ để được tư vấn trực tiếp.';
        alertTitle = 'Dịch vụ tạm thời không khả dụng';
        alertMessage = 'Hạn mức sử dụng API đã đạt giới hạn. Vui lòng thử lại sau.';
      } else if (error.message?.includes('API_KEY_INVALID')) {
        errorText = 'Có lỗi cấu hình hệ thống. Vui lòng liên hệ hỗ trợ kỹ thuật.';
        alertTitle = 'Lỗi cấu hình';
        alertMessage = 'API Key không hợp lệ. Vui lòng liên hệ quản trị viên.';
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
        isUser: false,
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
      Alert.alert(alertTitle, alertMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = ({ item }) => (
    <View className={`mb-4 ${item.isUser ? 'items-end' : 'items-start'}`}>
      <View className={`max-w-[80%] px-4 py-3 rounded-2xl ${
        item.isUser 
          ? 'bg-blue-500' 
          : item.isError 
            ? 'bg-red-100 border border-red-300' 
            : 'bg-gray-100'
      }`}>
        <Text className={`text-base ${
          item.isUser 
            ? 'text-white' 
            : item.isError 
              ? 'text-red-700' 
              : 'text-gray-800'
        }`}>
          {item.text}
        </Text>
      </View>
      <Text className="text-xs text-gray-500 mt-1 mx-2">
        {formatTime(item.timestamp)}
      </Text>
    </View>
  );

  const clearChat = () => {
    Alert.alert(
      'Xóa cuộc trò chuyện',
      'Bạn có chắc chắn muốn xóa toàn bộ cuộc trò chuyện?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            setMessages([{
              id: 1,
              text: 'Xin chào! Tôi là trợ lý AI y tế. Tôi có thể giúp bạn trả lời các câu hỏi về sức khỏe. Bạn cần hỗ trợ gì?',
              isUser: false,
              timestamp: new Date()
            }]);
          }
        }
      ]
    );
  };

  const quickQuestions = [
    'HIV/AIDS có triệu chứng gì?',
    'Cách phòng ngừa HIV hiệu quả?',
    'Chế độ ăn cho người nhiễm HIV?',
    'Thuốc ARV là gì và tác dụng?'
  ];

  const sendQuickQuestion = (question) => {
    setInputText(question);
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View className="bg-blue-500 px-4 py-6 pt-12">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-white rounded-full items-center justify-center mr-3">
              <Ionicons name="chatbubble-ellipses" size={20} color="#3B82F6" />
            </View>
            <View>
              <Text className="text-white text-lg font-bold">Trợ lý AI Y tế</Text>
              <Text className="text-blue-100 text-sm">Luôn sẵn sàng hỗ trợ bạn</Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={clearChat}
            className="p-2"
          >
            <Ionicons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <View className="px-4 py-3 bg-gray-50">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Câu hỏi gợi ý:</Text>
          <View className="flex-row flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => sendQuickQuestion(question)}
                className="bg-blue-100 px-3 py-2 rounded-full"
              >
                <Text className="text-blue-700 text-sm">{question}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Loading indicator */}
      {isLoading && (
        <View className="px-4 pb-2">
          <View className="flex-row items-center">
            <View className="bg-gray-100 px-4 py-3 rounded-2xl flex-row items-center">
              <ActivityIndicator size="small" color="#666" />
              <Text className="text-gray-600 ml-2">Đang suy nghĩ...</Text>
            </View>
          </View>
        </View>
      )}

      {/* Input */}
      <View className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <View className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Nhập câu hỏi về sức khỏe..."
            className="flex-1 text-base py-2"
            multiline
            maxHeight={100}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            editable={!isLoading}
             textBreakStrategy="simple"
             keyboardType="default"
              autoCorrect={false}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={inputText.trim() === '' || isLoading}
            className={`ml-2 w-10 h-10 rounded-full items-center justify-center ${
              inputText.trim() === '' || isLoading ? 'bg-gray-300' : 'bg-blue-500'
            }`}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={inputText.trim() === '' || isLoading ? '#9CA3AF' : 'white'} 
            />
          </TouchableOpacity>
        </View>
        <Text className="text-xs text-gray-500 mt-2 text-center">
          Thông tin chỉ mang tính tham khảo, không thay thế lời khuyên của bác sĩ
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatBot;
