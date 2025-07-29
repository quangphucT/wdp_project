import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Linking,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const StigmaReductionScreen = () => {
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const stigmaTopics = [
    {
      id: 1,
      title: "Hiểu về kỳ thị HIV",
      icon: "💭",
      color: "#dc2626",
      summary: "Tìm hiểu về nguồn gốc và tác hại của kỳ thị",
      content: `Kỳ thị HIV là một trong những rào cản lớn nhất trong việc phòng chống và điều trị HIV.

🔍 **KỲ THỊ HIV LÀ GÌ?**
• Thái độ tiêu cực, phân biệt đối xử với người nhiễm HIV
• Dựa trên sự hiểu biết sai lệch và sợ hãi
• Gây tổn hại về mặt tinh thần và xã hội
• Ngăn cản việc xét nghiệm và điều trị

😰 **NGUỒN GỐC CỦA KỲ THỊ:**
**Thiếu hiểu biết:**
• Không hiểu rõ về đường lây truyền HIV
• Sợ hãi bị lây nhiễm qua tiếp xúc thường ngày
• Thông tin sai lệch từ các nguồn không đáng tin cậy

**Định kiến xã hội:**
• Liên kết HIV với các nhóm người cụ thể
• Quan niệm về đạo đức và lối sống
• Sự kỳ thị có từ trước đối với một số nhóm

**Nỗi sợ hãi:**
• Sợ bệnh tật và cái chết
• Lo lắng về sự lây lan
• Thiếu tự tin trong kiến thức của mình

💔 **TÁC ĐỘNG CỦA KỲ THỊ:**
**Đối với người nhiễm HIV:**
• Trầm cảm, lo âu, căng thẳng tâm lý
• Cô lập, mất mạng lưới hỗ trợ xã hội
• Ngại xét nghiệm và điều trị kịp thời
• Chất lượng cuộc sống giảm sút

**Đối với cộng đồng:**
• Cản trở công tác phòng chống HIV
• Làm tăng số ca nhiễm mới
• Tạo ra môi trường thiếu an toàn
• Chia rẽ xã hội

📊 **THỰC TRẠNG KỲ THỊ HIỆN NAY:**
• 40% người nhiễm HIV từng bị phân biệt đối xử
• 60% e ngại chia sẻ tình trạng với người khác
• 30% từng bị từ chối dịch vụ y tế
• 25% mất việc làm hoặc cơ hội học tập

🎯 **TẠI SAO PHẢI CHỐNG KỲ THỊ?**
• HIV không lây qua tiếp xúc thường ngày
• Người nhiễm HIV có thể sống khỏe mạnh
• U=U: Không phát hiện được = Không lây truyền
• Mọi người đều có quyền được tôn trọng và yêu thương`
    },
    {
      id: 2,
      title: "Sự thật về HIV",
      icon: "🔍",
      color: "#059669",
      summary: "Những sự thật quan trọng để phá vỡ định kiến",
      content: `Hiểu đúng về HIV giúp chúng ta loại bỏ những định kiến và kỳ thị không cần thiết.

✅ **SỰ THẬT VỀ LAY TRUYỀN:**
**HIV KHÔNG lây truyền qua:**
• Bắt tay, ôm, hôn má
• Ngồi cạnh nhau, ăn chung bàn
• Sử dụng chung toilet, bồn tắm
• Dùng chung ly nước, đũa, thìa
• Ho, hắt hơi
• Muỗi, côn trùng cắn
• Bơi chung bể bơi
• Làm việc, học tập chung

**HIV CHỈ lây truyền qua:**
• Quan hệ tình dục không an toàn
• Tiếp xúc với máu nhiễm HIV
• Từ mẹ sang con (nếu không điều trị)

🏥 **SỰ THẬT VỀ ĐIỀU TRỊ:**
• HIV không phải là bản án tử hình
• Với điều trị ARV, người nhiễm HIV sống bình thường
• Tuổi thọ gần như không khác biệt
• U=U: Tải lượng virus không phát hiện = Không lây truyền
• Có thể kết hôn, sinh con an toàn

👥 **SỰ THẬT VỀ NGƯỜI NHIỄM HIV:**
• Họ là những người bình thường như chúng ta
• Có thể làm mọi công việc
• Đóng góp tích cực cho xã hội
• Cần được yêu thương và hỗ trợ
• Không đáng bị kỳ thị hay phân biệt đối xử

🔬 **SỰ THẬT VỀ KHOA HỌC:**
• HIV đã được nghiên cứu kỹ lưỡng hơn 40 năm
• Có phương pháp phòng ngừa hiệu quả 99%
• Thuốc điều trị ngày càng tiến bộ
• Nhiều quốc gia đã kiểm soát được dịch HIV

💡 **NHỮNG HIỂU LẦM THƯỜNG GẶP:**
❌ "HIV chỉ ảnh hưởng một số nhóm người"
✅ Bất kỳ ai cũng có thể nhiễm HIV nếu không phòng ngừa

❌ "Người nhiễm HIV sẽ chết sớm"
✅ Với điều trị đúng, tuổi thọ gần như bình thường

❌ "HIV lây qua tiếp xúc thường ngày"
✅ HIV chỉ lây qua 3 đường: tình dục, máu, mẹ-con

❌ "Người nhiễm HIV nguy hiểm"
✅ Những người điều trị tốt không thể lây truyền HIV

❌ "HIV là hình phạt cho lối sống không đúng"
✅ HIV là bệnh như bao bệnh khác, ai cũng có thể mắc

🎯 **THÔNG ĐIỆP QUAN TRỌNG:**
Hiểu biết đúng đắn là chìa khóa để chấm dứt kỳ thị. Hãy trang bị kiến thức chính xác và chia sẻ với mọi người xung quanh.`
    },
    {
      id: 3,
      title: "Ngôn ngữ tích cực",
      icon: "💬",
      color: "#7c3aed",
      summary: "Cách nói chuyện không kỳ thị về HIV",
      content: `Ngôn ngữ chúng ta sử dụng có thể làm tổn thương hoặc chữa lành. Hãy chọn từ ngữ tích cực.

✅ **NÓI ĐÚNG CÁCH:**

**Thay vì:** "Nạn nhân HIV", "Người bị HIV"
**Hãy nói:** "Người nhiễm HIV", "Người sống với HIV"

**Thay vì:** "Bệnh HIV", "Căn bệnh thế kỷ"
**Hãy nói:** "Tình trạng nhiễm HIV", "HIV"

**Thay vì:** "Nhóm nguy cơ cao"
**Hãy nói:** "Người có hành vi nguy cơ cao"

**Thay vì:** "Sạch", "An toàn" (về tình trạng HIV âm tính)
**Hãy nói:** "HIV âm tính", "Chưa nhiễm HIV"

**Thay vì:** "Lây lan HIV", "Truyền bệnh"
**Hãy nói:** "Lây truyền HIV", "Phơi nhiễm HIV"

🗣️ **NGUYÊN TẮC GIAO TIẾP:**

**1. Tôn trọng:**
• Sử dụng ngôn ngữ không phán xét
• Tránh các từ ngữ mang tính tiêu cực
• Lắng nghe mà không định kiến

**2. Chính xác:**
• Sử dụng thuật ngữ y khoa đúng
• Tránh thông tin sai lệch
• Tham khảo nguồn tin đáng tin cậy

**3. Đồng cảm:**
• Thể hiện sự quan tâm chân thành
• Tránh thái độ thương hại
• Coi họ như những người bình thường

**4. Tích cực:**
• Nhấn mạnh khả năng sống khỏe mạnh
• Nói về hy vọng và cơ hội
• Tránh ngôn ngữ bi quan

💭 **VÍ DỤ TRONG GIAO TIẾP:**

**Khi ai đó chia sẻ tình trạng HIV:**
❌ "Tôi rất tiếc cho bạn"
✅ "Cảm ơn bạn đã tin tưởng chia sẻ với tôi"

❌ "Bạn sẽ ổn chứ?"
✅ "Bạn có cần hỗ trợ gì không?"

❌ "Tôi sẽ cầu nguyện cho bạn"
✅ "Tôi sẽ luôn ở đây khi bạn cần"

**Khi thảo luận về HIV:**
❌ "Những người như thế"
✅ "Người nhiễm HIV"

❌ "Họ nên cẩn thận hơn"
✅ "Chúng ta cần tăng cường giáo dục phòng ngừa"

📱 **TRÊN MẠNG XÃ HỘI:**
• Chia sẻ thông tin chính xác
• Phản đối bình luận kỳ thị
• Hỗ trợ các chiến dịch tích cực
• Tránh chia sẻ tin giả về HIV

🎯 **MỤC TIÊU:**
Tạo ra môi trường giao tiếp an toàn, tôn trọng và hỗ trợ cho mọi người, đặc biệt là những người bị ảnh hưởng bởi HIV.`
    },
    {
      id: 4,
      title: "Hỗ trợ người thân",
      icon: "🤝",
      color: "#ea580c",
      summary: "Cách hỗ trợ người thân nhiễm HIV",
      content: `Khi người thân nhiễm HIV, sự hỗ trợ của bạn rất quan trọng cho hành trình phục hồi của họ.

❤️ **PHẢN ỨNG BAN ĐẦU:**

**Điều nên làm:**
• Bình tĩnh và lắng nghe
• Cảm ơn họ vì đã tin tưởng chia sẻ
• Hỏi họ cần hỗ trợ gì
• Tìm hiểu về HIV từ nguồn đáng tin cậy
• Tiếp tục yêu thương và tôn trọng họ

**Điều không nên làm:**
• Hoảng sợ hoặc phản ứng thái quá
• Đổ lỗi hoặc phán xét
• Chia sẻ thông tin cho người khác mà không được phép
• Tránh né hoặc xa cách họ
• Coi họ như người bệnh hoặc yếu đuối

🏠 **SỐNG CHUNG TRONG GIA ĐÌNH:**

**An toàn hoàn toàn khi:**
• Ăn chung bàn, dùng chung đồ ăn
• Ôm, hôn má, bắt tay
• Sử dụng chung toilet, phòng tắm
• Ngủ chung giường
• Làm việc nhà cùng nhau
• Chăm sóc trẻ em

**Lưu ý nhỏ:**
• Không dùng chung bàn chải đánh răng, dao cạo
• Băng bó vết thương đúng cách
• Đeo găng tay nếu tiếp xúc với máu

💊 **HỖ TRỢ ĐIỀU TRỊ:**

**Nhắc nhở uống thuốc:**
• Giúp thiết lập thói quen uống thuốc
• Đặt báo thức nhắc nhở
• Chuẩn bị hộp thuốc theo ngày
• Đi khám cùng nếu họ muốn

**Hỗ trợ tinh thần:**
• Động viên khi họ nản chí
• Nhắc nhở về tiến bộ điều trị
• Tôn vinh những thành tựu nhỏ
• Chia sẻ thông tin tích cực về HIV

🍎 **CHĂM SÓC SỨC KHỎE:**

**Dinh dưỡng:**
• Nấu những món ăn bổ dưỡng
• Khuyến khích ăn đủ bữa
• Cung cấp vitamin và khoáng chất
• Đảm bảo họ uống đủ nước

**Thể dục:**
• Tập thể dục cùng nhau
• Đi bộ, yoga, bơi lội
• Tạo động lực cho hoạt động thể chất
• Tôn trọng giới hạn của họ

🧠 **HỖ TRỢ TINH THẦN:**

**Lắng nghe:**
• Tạo không gian an toàn để họ chia sẻ
• Không phán xét hay đưa ra lời khuyên
• Thể hiện sự quan tâm chân thành
• Tôn trọng cảm xúc của họ

**Hoạt động tích cực:**
• Làm những việc họ yêu thích
• Duy trì các hoạt động xã hội
• Khuyến khích theo đuổi sở thích
• Tạo kỷ niệm đẹp cùng nhau

👥 **XÂY DỰNG MẠNG LƯỚI HỖ TRỢ:**
• Kết nối với nhóm hỗ trợ HIV
• Tìm bác sĩ chuyên khoa tốt
• Liên hệ với tổ chức phi lợi nhuận
• Chia sẻ với bạn bè thân thiết (nếu họ đồng ý)

⚖️ **BẢO VỆ QUYỀN LỢI:**
• Hỗ trợ khi bị phân biệt đối xử
• Tìm hiểu về quyền pháp lý
• Đồng hành trong các cuộc hẹn y tế
• Bảo vệ sự riêng tư của họ

🎯 **ĐIỀU QUAN TRỌNG NHẤT:**
Tình yêu thương và sự chấp nhận vô điều kiện là món quà lớn nhất bạn có thể dành cho người thân nhiễm HIV.`
    },
    {
      id: 5,
      title: "Thay đổi cộng đồng",
      icon: "🌍",
      color: "#0891b2",
      summary: "Cùng nhau xây dựng cộng đồng không kỳ thị",
      content: `Mỗi người chúng ta đều có thể góp phần tạo ra một cộng đồng bao dung và không kỳ thị.

🗣️ **GIÁO DỤC VÀ CHIA SẺ:**

**Tại gia đình:**
• Giáo dục con em về HIV đúng cách
• Chia sẻ kiến thức với người thân
• Làm gương về thái độ không kỳ thị
• Khuyến khích đối thua tích cực

**Tại nơi làm việc:**
• Đề xuất chương trình giáo dục HIV
• Ủng hộ chính sách không phân biệt đối xử
• Tạo môi trường làm việc an toàn
• Hỗ trợ đồng nghiệp khi cần

**Tại trường học:**
• Tham gia các chương trình giáo dục giới tính
• Chia sẻ thông tin chính xác với bạn bè
• Phản đối các hành vi bắt nạt liên quan đến HIV
• Tạo không gian an toàn cho thảo luận

📱 **HOẠT ĐỘNG TRỰC TUYẾN:**

**Mạng xã hội:**
• Chia sẻ thông tin chính xác về HIV
• Phản đối bình luận kỳ thị
• Hỗ trợ các chiến dịch nâng cao nhận thức
• Theo dõi các tổ chức uy tín về HIV

**Tạo nội dung tích cực:**
• Viết blog về chống kỳ thị HIV
• Tạo video giáo dục
• Chia sẻ câu chuyện cá nhân (nếu phù hợp)
• Tham gia thảo luận trực tuyến

🤝 **THAM GIA CỘNG ĐỒNG:**

**Tình nguyện:**
• Làm tình nguyện viên cho tổ chức HIV/AIDS
• Tham gia các chiến dịch nâng cao nhận thức
• Hỗ trợ người nhiễm HIV trong cộng đồng
• Tham gia các sự kiện gây quỹ

**Vận động chính sách:**
• Ủng hộ luật chống phân biệt đối xử
• Liên hệ với đại diện dân cử
• Tham gia các cuộc biểu tình ôn hòa
• Hỗ trợ các tổ chức đấu tranh cho quyền con người

💼 **TẠI NƠI LÀM VIỆC:**

**Lãnh đạo:**
• Xây dựng chính sách không kỳ thị
• Đào tạo nhân viên về HIV
• Tạo môi trường làm việc bao dung
• Cung cấp bảo hiểm y tế toàn diện

**Nhân viên:**
• Học hỏi về HIV và chia sẻ kiến thức
• Ủng hộ đồng nghiệp
• Báo cáo hành vi phân biệt đối xử
• Tham gia các hoạt động nâng cao nhận thức

🏥 **TRONG LĨNH VỰC Y TẾ:**

**Nhân viên y tế:**
• Điều trị người nhiễm HIV với tôn trọng
• Cập nhật kiến thức về HIV liên tục
• Giáo dục bệnh nhân và gia đình
• Bảo vệ quyền riêng tư của bệnh nhân

**Bệnh nhân:**
• Đòi hỏi dịch vụ y tế có chất lượng
• Báo cáo hành vi phân biệt đối xử
• Chia sẻ trải nghiệm tích cực
• Hỗ trợ bệnh nhân khác

🎯 **HOẠT ĐỘNG CỤ THỂ:**

**Ngày Thế giới phòng chống AIDS (1/12):**
• Tham gia các sự kiện cộng đồng
• Đeo ruy băng đỏ
• Chia sẻ thông tin trên mạng xã hội
• Quyên góp cho các tổ chức HIV

**Trong cuộc sống hàng ngày:**
• Sửa chữa khi nghe thông tin sai lệch
• Phản đối bình luận kỳ thị
• Ủng hộ doanh nghiệp không kỳ thị
• Tạo không gian an toàn cho mọi người

📊 **ĐO LƯỜNG TÁC ĐỘNG:**

**Chỉ số thành công:**
• Giảm số ca kỳ thị được báo cáo
• Tăng số người xét nghiệm HIV
• Cải thiện chất lượng cuộc sống của người nhiễm HIV
• Tăng nhận thức cộng đồng về HIV

🌟 **TẦM NHÌN:**
Một cộng đồng nơi mọi người, bất kể tình trạng HIV, đều được tôn trọng, yêu thương và có cơ hội sống trọn vẹn cuộc đời mình.

💪 **HÀNH ĐỘNG NGAY HÔM NAY:**
• Tìm hiểu thêm về HIV từ nguồn đáng tin cậy
• Chia sẻ bài viết này với bạn bè
• Tham gia một tổ chức địa phương về HIV
• Cam kết sử dụng ngôn ngữ không kỳ thị`
    }
  ];

  const openModal = (topic) => {
    setSelectedSection(topic);
    setModalVisible(true);
  };

  const handleContactSupport = () => {
    // Open phone dialer for HIV support hotline
    Linking.openURL('tel:19003456');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <LinearGradient
        colors={['#7c3aed', '#8b5cf6']}
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
            Giảm kỳ thị HIV
          </Text>
          <Text style={{
            fontSize: 14,
            color: 'rgba(255, 255, 255, 0.9)',
          }}>
            Cùng nhau xây dựng cộng đồng bao dung
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
              🤝 Chống kỳ thị HIV
            </Text>
            <Text style={{
              fontSize: 16,
              color: '#6b7280',
              textAlign: 'center',
              lineHeight: 24,
            }}>
              Kỳ thị HIV là rào cản lớn nhất trong việc phòng chống và điều trị. Hãy cùng nhau thay đổi!
            </Text>
          </View>

          {/* Quick Stats */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 16,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
          }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#dc2626' }}>40%</Text>
              <Text style={{ fontSize: 12, color: '#6b7280', textAlign: 'center' }}>Người nhiễm HIV bị kỳ thị</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#059669' }}>U=U</Text>
              <Text style={{ fontSize: 12, color: '#6b7280', textAlign: 'center' }}>Không phát hiện = Không lây</Text>
            </View>
          
          </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#7c3aed' }}>0</Text>
              <Text style={{ fontSize: 12, color: '#6b7280', textAlign: 'center' }}>Lây qua tiếp xúc thường ngày</Text>
            </View>
        </View>

        {/* Topics */}
        <View style={{ paddingHorizontal: 20 }}>
          {stigmaTopics.map((topic) => (
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

        {/* Call to Action */}
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
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#1f2937',
            textAlign: 'center',
            marginBottom: 12,
          }}>
            🌟 Bạn có thể làm gì ngay hôm nay?
          </Text>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: '#374151', marginBottom: 8, fontWeight: '600' }}>
              ✅ Chia sẻ thông tin chính xác về HIV
            </Text>
            <Text style={{ fontSize: 16, color: '#374151', marginBottom: 8, fontWeight: '600' }}>
              ✅ Sử dụng ngôn ngữ tôn trọng và không kỳ thị
            </Text>
            <Text style={{ fontSize: 16, color: '#374151', marginBottom: 8, fontWeight: '600' }}>
              ✅ Hỗ trợ người thân và bạn bè
            </Text>
            <Text style={{ fontSize: 16, color: '#374151', marginBottom: 8, fontWeight: '600' }}>
              ✅ Tham gia các hoạt động cộng đồng
            </Text>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: '#7c3aed',
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 12,
              alignItems: 'center',
            }}
            onPress={handleContactSupport}
          >
            <Text style={{
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
            }}>
              📞 Gọi đường dây hỗ trợ: 1900 3456
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer Message */}
        <View style={{
          margin: 20,
          padding: 20,
          backgroundColor: '#fef3c7',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#fbbf24',
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#92400e',
            textAlign: 'center',
            marginBottom: 8,
          }}>
            💛 Thông điệp quan trọng
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#92400e',
            textAlign: 'center',
            lineHeight: 22,
          }}>
            &ldquo;Kỳ thị HIV tồn tại vì thiếu hiểu biết. Hãy là người thay đổi bằng kiến thức và tình yêu thương.&rdquo;
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
          {selectedSection && (
            <>
              <LinearGradient
                colors={[selectedSection.color, `${selectedSection.color}CC`]}
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
                  <Text style={{ fontSize: 32, marginRight: 12 }}>{selectedSection.icon}</Text>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'white',
                    flex: 1,
                  }}>
                    {selectedSection.title}
                  </Text>
                </View>
              </LinearGradient>

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
                    {selectedSection.content}
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

export default StigmaReductionScreen;
