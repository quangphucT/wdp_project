import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HIVGuideScreen = () => {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const hivTopics = [
    {
      id: 1,
      title: "HIV là gì?",
      icon: "🦠",
      color: "#ef4444",
      summary: "Hiểu về virus HIV và cách hoạt động",
      content: `HIV (Human Immunodeficiency Virus) là một loại virus tấn công hệ thống miễn dịch của cơ thể, đặc biệt là các tế bào CD4 (T-helper cells).

🔬 **Đặc điểm của HIV:**
• Virus RNA thuộc họ Retrovirus
• Có khả năng sao chép DNA từ RNA
• Tấn công tế bào CD4, làm suy yếu hệ miễn dịch
• Không thể tự sinh sống ngoài cơ thể con người

⚠️ **Giai đoạn nhiễm HIV:**
1. **Giai đoạn cấp tính** (2-4 tuần đầu)
2. **Giai đoạn tiềm ẩn** (có thể kéo dài nhiều năm)
3. **Giai đoạn AIDS** (khi CD4 < 200 cells/mm³)

💡 **Điều quan trọng cần nhớ:**
HIV không phải là AIDS. Với điều trị hiện đại, người nhiễm HIV có thể sống khỏe mạnh và bình thường như người bình thường.`
    },
    {
      id: 2,
      title: "Đường lây truyền HIV",
      icon: "🚨",
      color: "#f97316",
      summary: "Cách HIV lây truyền và không lây truyền",
      content: `Hiểu rõ đường lây truyền giúp bạn bảo vệ bản thân và người thân một cách hiệu quả.

✅ **HIV LÂY TRUYỀN QUA:**
🩸 **Máu:**
• Dùng chung kim tiêm, bơm kim tiêm
• Truyền máu, ghép tạng không an toàn
• Dụng cụ xăm, xỏ khuyên không vệ sinh

💏 **Quan hệ tình dục:**
• Quan hệ tình dục không sử dụng bao cao su
• Quan hệ qua đường âm đạo, hậu môn, miệng

👶 **Từ mẹ sang con:**
• Trong thời kỳ thai kỳ
• Khi sinh nở
• Qua sữa mẹ

❌ **HIV KHÔNG LAY TRUYỀN QUA:**
• Bắt tay, ôm, hôn má
• Dùng chung toilet, bồn tắm
• Muỗi, côn trùng cắn
• Ho, hắt hơi
• Dùng chung đồ ăn, ly nước
• Bơi chung bể bơi
• Tiếp xúc hàng ngày bình thường

🔒 **Lưu ý quan trọng:**
HIV rất dễ chết khi ra khỏi cơ thể. Virus không thể sống lâu trong môi trường bên ngoài.`
    },
    {
      id: 3,
      title: "Phòng ngừa HIV",
      icon: "🛡️",
      color: "#22c55e",
      summary: "Các biện pháp bảo vệ hiệu quả",
      content: `Phòng ngừa HIV hoàn toàn có thể thực hiện được với các biện pháp đúng đắn.

🔒 **QUAN HỆ TÌNH DỤC AN TOÀN:**
• Sử dụng bao cao su đúng cách mỗi lần quan hệ
• Giảm số lượng bạn tình
• Tránh quan hệ tình dục khi say rượu/chất kích thích
• Xét nghiệm HIV định kỳ cho bản thân và bạn tình

💉 **TRÁNH TIẾP XÚC VỚI MÁU:**
• Không dùng chung kim tiêm, bơm kim tiêm
• Sử dụng dụng cụ y tế vô trùng
• Đeo găng tay khi tiếp xúc với máu
• Xăm, xỏ khuyên tại cơ sở uy tín

💊 **PRE-EXPOSURE PROPHYLAXIS (PrEP):**
• Thuốc dự phòng trước phơi nhiễm
• Hiệu quả 90-99% khi dùng đúng cách
• Dành cho người có nguy cơ cao
• Cần theo dõi và tư vấn y khoa

🩺 **POST-EXPOSURE PROPHYLAXIS (PEP):**
• Thuốc dự phòng sau phơi nhiễm
• Phải sử dụng trong vòng 72 giờ
• Điều trị trong 28 ngày
• Hiệu quả cao nếu bắt đầu sớm

👶 **PHÒNG NGỪA LÂY TRUYỀN TỪ MẸ SANG CON:**
• Điều trị ARV trong thai kỳ
• Sinh mổ nếu cần thiết
• Không cho con bú sữa mẹ
• Xét nghiệm định kỳ cho trẻ`
    },
    {
      id: 4,
      title: "Xét nghiệm HIV",
      icon: "🔬",
      color: "#8b5cf6",
      summary: "Khi nào và làm thế nào để xét nghiệm",
      content: `Xét nghiệm HIV là bước quan trọng để phát hiện sớm và bảo vệ sức khỏe.

🕐 **KHI NÀO NÊN XÉT NGHIỆM:**
• Sau quan hệ tình dục không an toàn (3 tháng)
• Khi có các triệu chứng nghi ngờ
• Xét nghiệm định kỳ hàng năm (người có nguy cơ)
• Trước khi kết hôn hoặc có con
• Khi bạn tình nhiễm HIV

🔬 **LOẠI XÉT NGHIỆM:**
**1. Xét nghiệm kháng thể:**
• Phát hiện kháng thể chống HIV
• Thời gian cửa sổ: 3-12 tuần
• Chính xác 99.9%

**2. Xét nghiệm kháng nguyên:**
• Phát hiện protein p24 của HIV
• Phát hiện sớm hơn 1-3 tuần
• Thường kết hợp với xét nghiệm kháng thể

**3. Xét nghiệm PCR:**
• Phát hiện RNA của HIV
• Phát hiện sớm nhất (7-10 ngày)
• Đắt tiền nhất

📍 **NƠI XÉT NGHIỆM:**
• Bệnh viện, phòng khám
• Trung tâm VCT (Voluntary Counseling & Testing)
• Một số hiệu thuốc
• Xét nghiệm tại nhà (self-test)

🔒 **QUYỀN RIÊNG TƯ:**
• Thông tin xét nghiệm được bảo mật
• Bạn có quyền xét nghiệm ẩn danh
• Tư vấn trước và sau xét nghiệm
• Hỗ trợ tâm lý nếu cần

✅ **SAU KẾT QUẢ:**
• **Âm tính:** Tiếp tục phòng ngừa, xét nghiệm định kỳ
• **Dương tính:** Bắt đầu điều trị ngay, thông báo bạn tình`
    },
    {
      id: 5,
      title: "Điều trị HIV hiện đại",
      icon: "💊",
      color: "#06b6d4",
      summary: "ARV và cuộc sống với HIV",
      content: `Điều trị HIV hiện đại giúp người nhiễm sống khỏe mạnh và bình thường.

💊 **THUỐC KHÁNG RETROVIRUS (ARV):**
**Cách hoạt động:**
• Ngăn chặn HIV sao chép
• Giảm tải lượng virus trong máu
• Bảo vệ và phục hồi hệ miễn dịch

**Phác đồ điều trị:**
• Kết hợp 3 loại thuốc trở lên
• Uống hàng ngày, đúng giờ
• Không được bỏ liều
• Theo dõi định kỳ với bác sĩ

🎯 **MỤC TIÊU ĐIỀU TRỊ:**
**Undetectable = Untransmittable (U=U):**
• Tải lượng virus không phát hiện được (<50 copies/ml)
• Không thể lây truyền HIV cho người khác
• Đạt được sau 3-6 tháng điều trị đều đặn

📊 **THEO DÕI ĐIỀU TRỊ:**
**Xét nghiệm định kỳ:**
• Tải lượng virus (viral load)
• Số lượng CD4
• Chức năng gan, thận
• Tác dụng phụ của thuốc

🌟 **CUỘC SỐNG VỚI HIV:**
• Tuổi thọ gần như bình thường
• Có thể kết hôn, sinh con an toàn
• Làm việc, học tập bình thường
• Tham gia mọi hoạt động xã hội

⚠️ **LƯU Ý QUAN TRỌNG:**
• Tuân thủ điều trị 95% thời gian
• Không tự ý ngừng thuốc
• Thông báo với bác sĩ về thuốc khác
• Sống lành mạnh: ăn uống, tập thể dục, không hút thuốc`
    },
    {
      id: 6,
      title: "Sống tích cực với HIV",
      icon: "💪",
      color: "#f59e0b",
      summary: "Mẹo cho cuộc sống khỏe mạnh và hạnh phúc",
      content: `Có HIV không có nghĩa là cuộc sống kết thúc. Hãy sống tích cực và hạnh phúc!

🏃‍♂️ **CHĂM SÓC SỨC KHỎE:**
**Dinh dưỡng:**
• Ăn đủ 3 bữa, đa dạng thực phẩm
• Tăng cường rau xanh, trái cây
• Protein chất lượng cao
• Vitamin và khoáng chất đầy đủ
• Uống đủ nước (2-3 lít/ngày)

**Tập thể dục:**
• Vận động nhẹ nhàng đều đặn
• Yoga, đi bộ, bơi lội
• Tăng cường sức đề kháng
• Giảm stress và lo âu

**Giấc ngủ:**
• Ngủ đủ 7-8 tiếng/đêm
• Tạo môi trường ngủ thoải mái
• Tránh caffeine trước khi ngủ

🧠 **CHĂM SÓC TINH THẦN:**
• Duy trì thái độ tích cực
• Tham gia hoạt động yêu thích
• Kết nối với gia đình, bạn bè
• Tham gia nhóm hỗ trợ
• Tư vấn tâm lý khi cần

👥 **MỐI QUAN HỆ:**
**Với gia đình:**
• Chia sẻ thông tin khi sẵn sàng
• Giải thích về HIV và U=U
• Nhờ hỗ trợ khi cần thiết

**Với bạn bè:**
• Chọn người tin tưởng để chia sẻ
• Giáo dục về HIV
• Duy trì tình bạn bình thường

**Quan hệ tình cảm:**
• Chia sẻ tình trạng HIV với bạn tình
• Sử dụng biện pháp an toàn
• Người U=U không lây truyền

💼 **CÔNG VIỆC VÀ XÃ HỘI:**
• HIV không ảnh hưởng khả năng làm việc
• Không bắt buộc khai báo tình trạng HIV
• Tham gia đầy đủ hoạt động xã hội
• Đóng góp tích cực cho cộng đồng

🎯 **MỤC TIÊU CUỘC SỐNG:**
• Đặt ra mục tiêu ngắn hạn và dài hạn
• Theo đuổi ước mơ và đam mê
• Học hỏi và phát triển bản thân
• Giúp đỡ người khác trong cảnh ngộ tương tự`
    }
  ];

  const openModal = (topic) => {
    setSelectedTopic(topic);
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
            Tài liệu giáo dục HIV
          </Text>
          <Text style={{
            fontSize: 14,
            color: 'rgba(255, 255, 255, 0.9)',
          }}>
            Kiến thức toàn diện về HIV/AIDS
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
              📚 Kiến thức về HIV
            </Text>
            <Text style={{
              fontSize: 16,
              color: '#6b7280',
              textAlign: 'center',
              lineHeight: 24,
            }}>
              Trang bị kiến thức chính xác và cập nhật về HIV/AIDS để bảo vệ bản thân và cộng đồng
            </Text>
          </View>
        </View>

        {/* Topics Grid */}
        <View style={{ paddingHorizontal: 20 }}>
          {hivTopics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
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
              onPress={() => openModal(topic)}
            >
              <LinearGradient
                colors={[topic.color, `${topic.color}CC`]}
                style={{
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View style={{
                  width: 60,
                  height: 60,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}>
                  <Text style={{ fontSize: 28 }}>{topic.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: 4,
                  }}>
                    {topic.title}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: 20,
                  }}>
                    {topic.summary}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View style={{
          margin: 20,
          padding: 20,
          backgroundColor: '#f0f9ff',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#bae6fd',
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#0369a1',
            textAlign: 'center',
            marginBottom: 8,
          }}>
            💡 Lưu ý quan trọng
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#0369a1',
            textAlign: 'center',
            lineHeight: 22,
          }}>
            Thông tin chỉ mang tính chất tham khảo. Hãy tham khảo ý kiến bác sĩ chuyên khoa để được tư vấn phù hợp với tình trạng cụ thể của bạn.
          </Text>
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
          {selectedTopic && (
            <>
              {/* Modal Header */}
              <LinearGradient
                colors={[selectedTopic.color, `${selectedTopic.color}CC`]}
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
                  <Text style={{ fontSize: 32, marginRight: 12 }}>{selectedTopic.icon}</Text>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'white',
                    flex: 1,
                  }}>
                    {selectedTopic.title}
                  </Text>
                </View>
              </LinearGradient>

              {/* Modal Content */}
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
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: '#374151',
                    lineHeight: 24,
                  }}>
                    {selectedTopic.content}
                  </Text>
                </View>
              </ScrollView>
            </>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default HIVGuideScreen;
