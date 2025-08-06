import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const HivQuiz = () => {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const questions = [
    {
      id: 1,
      question: "HIV là viết tắt của từ gì?",
      options: [
        "Human Immunodeficiency Virus",
        "Human Infectious Disease Virus", 
        "Health Information Virus",
        "Human Immune Virus"
      ],
      correctAnswer: 0,
      explanation: "HIV là viết tắt của Human Immunodeficiency Virus - Virus gây suy giảm miễn dịch ở người."
    },
    {
      id: 2,
      question: "HIV có thể lây truyền qua con đường nào?",
      options: [
        "Chỉ qua đường tình dục",
        "Qua máu, tình dục và từ mẹ sang con",
        "Qua không khí khi ho, hắt hơi",
        "Qua việc ăn chung, uống chung"
      ],
      correctAnswer: 1,
      explanation: "HIV lây truyền qua 3 đường chính: đường tình dục, đường máu và từ mẹ sang con. Không lây qua không khí hay tiếp xúc thường ngày."
    },
    {
      id: 3,
      question: "Thời gian ủ bệnh của HIV là bao lâu?",
      options: [
        "2-4 tuần",
        "2-10 năm hoặc lâu hơn",
        "6 tháng",
        "1 năm"
      ],
      correctAnswer: 1,
      explanation: "Thời gian ủ bệnh của HIV có thể kéo dài từ 2-10 năm hoặc lâu hơn, tùy thuộc vào sức khỏe và điều trị của từng người."
    },
    {
      id: 4,
      question: "Cách phòng ngừa HIV hiệu quả nhất là gì?",
      options: [
        "Chỉ sử dụng bao cao su",
        "Tránh quan hệ tình dục hoàn toàn",
        "Kết hợp nhiều biện pháp: bao cao su, xét nghiệm, PrEP",
        "Chỉ cần xét nghiệm định kỳ"
      ],
      correctAnswer: 2,
      explanation: "Phòng ngừa HIV hiệu quả nhất khi kết hợp nhiều biện pháp: sử dụng bao cao su đúng cách, xét nghiệm định kỳ, PrEP, và giáo dục tình dục an toàn."
    },
    {
      id: 5,
      question: "PrEP là gì?",
      options: [
        "Thuốc điều trị HIV",
        "Thuốc dự phòng trước phơi nhiễm",
        "Loại xét nghiệm HIV",
        "Thiết bị y tế"
      ],
      correctAnswer: 1,
      explanation: "PrEP (Pre-Exposure Prophylaxis) là thuốc dự phòng trước phơi nhiễm HIV, giúp giảm nguy cơ nhiễm HIV lên đến 99%."
    },
    {
      id: 6,
      question: "Người nhiễm HIV có thể sống bình thường không?",
      options: [
        "Không, sẽ chết trong vài tháng",
        "Có, nếu tuân thủ điều trị ARV",
        "Chỉ sống được 1-2 năm",
        "Tùy thuộc vào tuổi tác"
      ],
      correctAnswer: 1,
      explanation: "Với điều trị ARV hiện đại, người nhiễm HIV có thể sống bình thường như người không nhiễm, có tuổi thọ gần như bình thường."
    },
    {
      id: 7,
      question: "U=U có nghĩa là gì?",
      options: [
        "Undetectable = Untransmittable",
        "Unsafe = Unhealthy",
        "Untreated = Unwell",
        "Unknown = Uncertain"
      ],
      correctAnswer: 0,
      explanation: "U=U nghĩa là 'Không phát hiện được = Không lây truyền'. Khi tải lượng virus không phát hiện được, người nhiễm HIV không thể lây truyền virus qua đường tình dục."
    },
    {
      id: 8,
      question: "Khi nào nên xét nghiệm HIV?",
      options: [
        "Chỉ khi có triệu chứng",
        "Định kỳ 6 tháng/lần",
        "Sau khi có hành vi nguy cơ hoặc định kỳ",
        "Chỉ một lần trong đời"
      ],
      correctAnswer: 2,
      explanation: "Nên xét nghiệm HIV sau khi có hành vi nguy cơ cao hoặc xét nghiệm định kỳ. Phát hiện sớm giúp điều trị hiệu quả hơn."
    },
    {
      id: 9,
      question: "HIV và AIDS có giống nhau không?",
      options: [
        "Hoàn toàn giống nhau",
        "HIV là virus, AIDS là hội chứng",
        "AIDS xuất hiện trước HIV",
        "Không có mối liên hệ gì"
      ],
      correctAnswer: 1,
      explanation: "HIV là virus gây bệnh, còn AIDS là hội chứng suy giảm miễn dịch mắc phải do HIV gây ra ở giai đoạn cuối."
    },
    {
      id: 10,
      question: "Điều quan trọng nhất khi sống với HIV là gì?",
      options: [
        "Giấu kín bệnh tình",
        "Tuân thủ điều trị và sống tích cực",
        "Tránh tiếp xúc với mọi người",
        "Chỉ tập trung vào điều trị"
      ],
      correctAnswer: 1,
      explanation: "Điều quan trọng nhất là tuân thủ điều trị ARV, duy trì lối sống tích cực và khỏe mạnh, cùng với sự hỗ trợ từ gia đình và cộng đồng."
    }
  ];

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResult(false);
  };

  const handleSelectAnswer = (answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answerIndex
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResult = () => {
    setShowResult(true);
  };

  const getScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const getScoreLevel = (score) => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return { level: "Xuất sắc", color: "text-green-600", emoji: "🏆" };
    if (percentage >= 60) return { level: "Tốt", color: "text-blue-600", emoji: "👍" };
    if (percentage >= 40) return { level: "Trung bình", color: "text-yellow-600", emoji: "📚" };
    return { level: "Cần cải thiện", color: "text-red-600", emoji: "💪" };
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResult(false);
  };

  const renderWelcomeScreen = () => (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 px-4 py-6 pt-12">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="mr-3 p-2 -ml-2"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-white">
              Quiz Kiến Thức HIV
            </Text>
          </View>
        </View>
        <Text className="text-white/90 text-sm">
          Kiểm tra hiểu biết của bạn về HIV/AIDS
        </Text>
      </View>

      {/* Welcome Content */}
      <View className="px-6 py-8">
        <View className="bg-white rounded-3xl p-6 shadow-lg border border-blue-50 mb-6">
          <View className="items-center mb-6">
            <View className="bg-blue-100 p-4 rounded-full mb-4">
              <Text className="text-4xl">🧠</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
              Chào mừng đến với Quiz HIV
            </Text>
            <Text className="text-gray-600 text-center leading-relaxed">
              Kiểm tra kiến thức của bạn về HIV/AIDS thông qua 10 câu hỏi
            </Text>
          </View>

          <View className="space-y-4">
            <View className="flex-row items-center bg-blue-50 p-4 rounded-2xl">
              <View className="bg-blue-500 p-2 rounded-full mr-4">
                <Ionicons name="time" size={16} color="white" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-gray-800">Thời gian</Text>
                <Text className="text-gray-600 text-sm">Không giới hạn</Text>
              </View>
            </View>

            <View className="flex-row items-center bg-green-50 p-4 rounded-2xl">
              <View className="bg-green-500 p-2 rounded-full mr-4">
                <Ionicons name="help-circle" size={16} color="white" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-gray-800">Số câu hỏi</Text>
                <Text className="text-gray-600 text-sm">{questions.length} câu hỏi trắc nghiệm</Text>
              </View>
            </View>

            <View className="flex-row items-center bg-purple-50 p-4 rounded-2xl">
              <View className="bg-purple-500 p-2 rounded-full mr-4">
                <Ionicons name="school" size={16} color="white" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-gray-800">Mục đích</Text>
                <Text className="text-gray-600 text-sm">Nâng cao nhận thức về HIV/AIDS</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="bg-amber-50 border border-amber-200 rounded-3xl p-6 mb-6">
          <View className="flex-row items-center mb-4">
            <Ionicons name="information-circle" size={24} color="#F59E0B" />
            <Text className="text-amber-700 font-bold ml-2 text-lg">Lưu ý quan trọng</Text>
          </View>
          <View className="space-y-2">
            <Text className="text-amber-700 text-sm leading-relaxed">
              • Đọc kỹ từng câu hỏi trước khi chọn đáp án
            </Text>
            <Text className="text-amber-700 text-sm leading-relaxed">
              • Sau khi hoàn thành, bạn sẽ thấy kết quả và giải thích chi tiết
            </Text>
            <Text className="text-amber-700 text-sm leading-relaxed">
              • Quiz này chỉ mang tính giáo dục, không thay thế tư vấn y tế
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          className="bg-blue-600 py-5 rounded-2xl shadow-lg"
          onPress={handleStartQuiz}
          style={{
            shadowColor: '#2563EB',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8
          }}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="play" size={24} color="white" />
            <Text className="text-white text-lg font-bold ml-3">
              Bắt đầu Quiz
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderQuizScreen = () => {
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-blue-600 px-4 py-6 pt-12">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity 
              onPress={() => {
                Alert.alert(
                  "Thoát Quiz",
                  "Bạn có chắc muốn thoát? Tiến độ sẽ bị mất.",
                  [
                    { text: "Hủy", style: "cancel" },
                    { text: "Thoát", onPress: resetQuiz }
                  ]
                );
              }}
              className="p-2 -ml-2"
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white font-bold text-lg">
              Câu {currentQuestion + 1}/{questions.length}
            </Text>
            <View className="w-8" />
          </View>
          
          {/* Progress Bar */}
          <View className="bg-blue-500/30 h-2 rounded-full">
            <View 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>

        <ScrollView className="flex-1 px-6 py-6">
          {/* Question Card */}
          <View className="bg-white rounded-3xl p-6 shadow-lg border border-blue-50 mb-6">
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 p-3 rounded-full mr-4">
                <Ionicons name="help-circle" size={24} color="#3B82F6" />
              </View>
              <Text className="text-sm text-blue-600 font-medium">
                Câu hỏi {currentQuestion + 1}
              </Text>
            </View>
            
            <Text className="text-xl font-bold text-gray-800 leading-relaxed">
              {question.question}
            </Text>
          </View>

          {/* Options */}
          <View className="space-y-4">
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                className={`border-2 rounded-2xl p-4 ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
                onPress={() => handleSelectAnswer(index)}
              >
                <View className="flex-row items-center">
                  <View className={`w-6 h-6 rounded-full border-2 mr-4 items-center justify-center ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers[currentQuestion] === index && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>
                  <Text className={`flex-1 text-base leading-relaxed ${
                    selectedAnswers[currentQuestion] === index
                      ? 'text-blue-700 font-medium'
                      : 'text-gray-700'
                  }`}>
                    {option}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Navigation */}
        <View className="px-6 py-4 bg-white border-t border-gray-200">
          <View className="flex-row justify-between space-x-4">
            <TouchableOpacity 
              className={`flex-1 py-4 rounded-2xl border-2 ${
                currentQuestion === 0 
                  ? 'bg-gray-100 border-gray-200' 
                  : 'bg-white border-gray-300'
              }`}
              onPress={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons 
                  name="arrow-back" 
                  size={20} 
                  color={currentQuestion === 0 ? "#9CA3AF" : "#6B7280"} 
                />
                <Text className={`ml-2 font-bold ${
                  currentQuestion === 0 ? 'text-gray-400' : 'text-gray-700'
                }`}>
                  Trước
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              className={`flex-1 py-4 rounded-2xl ${
                selectedAnswers[currentQuestion] !== undefined
                  ? 'bg-blue-600' 
                  : 'bg-gray-400'
              }`}
              onPress={handleNextQuestion}
              disabled={selectedAnswers[currentQuestion] === undefined}
            >
              <View className="flex-row items-center justify-center">
                <Text className="text-white font-bold mr-2">
                  {currentQuestion === questions.length - 1 ? 'Hoàn thành' : 'Tiếp'}
                </Text>
                <Ionicons 
                  name={currentQuestion === questions.length - 1 ? "checkmark" : "arrow-forward"} 
                  size={20} 
                  color="white" 
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderResultScreen = () => {
    const score = getScore();
    const scoreLevel = getScoreLevel(score);
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <ScrollView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-blue-600 px-4 py-6 pt-12">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-white">
              Kết Quả Quiz
            </Text>
            <TouchableOpacity 
              onPress={resetQuiz}
              className="p-2"
            >
              <Ionicons name="refresh" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-white/90 text-sm mt-2">
            Xem kết quả và giải thích chi tiết
          </Text>
        </View>

        <View className="px-6 py-8">
          {/* Score Card */}
          <View className="bg-white rounded-3xl p-6 shadow-lg border border-blue-50 mb-6 items-center">
            <Text className="text-6xl mb-4">{scoreLevel.emoji}</Text>
            <Text className={`text-3xl font-bold mb-2 ${scoreLevel.color}`}>
              {score}/{questions.length}
            </Text>
            <Text className="text-xl font-bold text-gray-800 mb-2">
              {scoreLevel.level}
            </Text>
            <Text className="text-gray-600 text-center">
              Bạn đã trả lời đúng {percentage}% số câu hỏi
            </Text>
          </View>

          {/* Detailed Results */}
          <View className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <View key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <View className="flex-row items-center mb-3">
                    <View className={`p-2 rounded-full mr-3 ${
                      isCorrect ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <Ionicons 
                        name={isCorrect ? "checkmark-circle" : "close-circle"} 
                        size={20} 
                        color={isCorrect ? "#10B981" : "#EF4444"} 
                      />
                    </View>
                    <Text className="font-bold text-gray-800 flex-1">
                      Câu {index + 1}
                    </Text>
                  </View>
                  
                  <Text className="text-gray-700 mb-3 leading-relaxed">
                    {question.question}
                  </Text>
                  
                  <View className="space-y-2">
                    <View className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <Text className="text-green-700 font-medium text-sm">
                        ✓ Đáp án đúng: {question.options[question.correctAnswer]}
                      </Text>
                    </View>
                    
                    {!isCorrect && (
                      <View className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <Text className="text-red-700 font-medium text-sm">
                          ✗ Bạn chọn: {question.options[userAnswer]}
                        </Text>
                      </View>
                    )}
                    
                    <View className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <Text className="text-blue-700 text-sm leading-relaxed">
                        💡 {question.explanation}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Action Buttons */}
          <View className="mt-8 space-y-4">
            <TouchableOpacity 
              className="bg-blue-600 py-5 rounded-2xl shadow-lg"
              onPress={handleStartQuiz}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="refresh" size={24} color="white" />
                <Text className="text-white text-lg font-bold ml-3">
                  Làm lại Quiz
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-white border-2 border-gray-200 py-5 rounded-2xl"
              onPress={() => router.back()}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="arrow-back" size={24} color="#6B7280" />
                <Text className="text-gray-700 text-lg font-bold ml-3">
                  Quay lại
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  if (showResult) {
    return renderResultScreen();
  }

  if (quizStarted) {
    return renderQuizScreen();
  }

  return renderWelcomeScreen();
};

export default HivQuiz;
