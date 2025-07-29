import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from './environment';

// Sử dụng API key từ environment config
const API_KEY = config.GOOGLE_API_KEY;

class GeminiService {
  constructor() {
    if (!API_KEY || API_KEY === 'YOUR_GOOGLE_API_KEY_HERE') {
      throw new Error('Google API Key chưa được cấu hình. Vui lòng cập nhật file environment.js');
    }
    this.genAI = new GoogleGenerativeAI(API_KEY);
    // Sử dụng model miễn phí
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  }

  async sendMessage(message) {
    try {
      const result = await this.model.generateContent(message);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Xử lý các loại lỗi cụ thể
      if (error.message?.includes('quota')) {
        throw new Error('Đã vượt quá hạn mức sử dụng API. Vui lòng kiểm tra billing hoặc thử lại sau.');
      } else if (error.message?.includes('API_KEY_INVALID')) {
        throw new Error('API Key không hợp lệ. Vui lòng kiểm tra lại API Key.');
      } else if (error.message?.includes('PERMISSION_DENIED')) {
        throw new Error('Không có quyền truy cập API. Vui lòng kiểm tra cấu hình API Key.');
      }
      
      throw error;
    }
  }

  async sendMessageWithContext(messages) {
    try {
      // Chuyển đổi messages thành format phù hợp cho Gemini
      const prompt = messages.map(msg => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n') + '\nAssistant:';

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error) {
      console.error('Error calling Gemini API with context:', error);
      throw error;
    }
  }

  async sendHealthcareMessage(message, patientInfo = null) {
    try {
      let prompt = `Bạn là một trợ lý y tế AI chuyên nghiệp. Hãy trả lời câu hỏi sau một cách chính xác và hữu ích về sức khỏe:

${message}

Lưu ý: 
- Chỉ cung cấp thông tin y tế chung, không thay thế lời khuyên của bác sĩ
- Khuyến khích người dùng tham khảo ý kiến chuyên gia y tế khi cần thiết
- Trả lời bằng tiếng Việt một cách rõ ràng và dễ hiểu`;

      if (patientInfo) {
        prompt += `\n\nThông tin bệnh nhân: ${JSON.stringify(patientInfo)}`;
      }

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error) {
      console.error('Error calling Gemini API for healthcare:', error);
      
      // Trả về response mặc định khi API lỗi
      return this.getFallbackResponse(message);
    }
  }

  getFallbackResponse(message) {
    const fallbackResponses = {
      'cảm cúm': 'Triệu chứng cảm cúm thường gặp bao gồm: sốt, ho, đau họng, nghẹt mũi, đau đầu và mệt mỏi. Bạn nên nghỉ ngơi đầy đủ, uống nhiều nước và tham khảo ý kiến bác sĩ nếu triệu chứng kéo dài.',
      'đau đầu': 'Đau đầu có thể do nhiều nguyên nhân: căng thẳng, mệt mỏi, thiếu nước, hoặc các vấn đề sức khỏe khác. Bạn nên nghỉ ngơi trong phòng tối, massage nhẹ và uống đủ nước. Nếu đau đầu thường xuyên, hãy gặp bác sĩ.',
      'sốt': 'Sốt là phản ứng tự nhiên của cơ thể khi chống lại nhiễm trùng. Bạn nên nghỉ ngơi, uống nhiều nước, và theo dõi nhiệt độ. Nếu sốt trên 39°C hoặc kéo dài, hãy liên hệ bác sĩ ngay.',
      'default': 'Xin lỗi, hiện tại tôi đang gặp vấn đề kỹ thuật với dịch vụ AI. Để được tư vấn y tế chính xác, bạn vui lòng:\n\n1. Liên hệ trực tiếp với bác sĩ\n2. Gọi hotline y tế: 19003432\n3. Thử lại sau ít phút\n\nĐối với các tình huống khẩn cấp, vui lòng gọi 115 hoặc đến cơ sở y tế gần nhất.'
    };

    // Tìm response phù hợp dựa trên từ khóa
    const lowerMessage = message.toLowerCase();
    for (const [keyword, response] of Object.entries(fallbackResponses)) {
      if (lowerMessage.includes(keyword) && keyword !== 'default') {
        return response;
      }
    }

    return fallbackResponses.default;
  }
}

export default new GeminiService();
