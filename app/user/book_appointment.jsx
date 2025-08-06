import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { slots } from '../../constants/timeSlots';
import { getSlotsByShift } from "../../data/timeSlots";
import { bookAppointmentApi } from "../../services/appointment/bookApointmentApi";
import { getAllServiceApi } from "../../services/appointment/getAllServiceApi";
import { getAllAppointmentStaffApi } from "../../services/appointment/getAppointmentStaffApi";
import { getDetailsServiceApi } from "../../services/appointment/getDetailsServiceApi";
import { getProfileUserApi } from "../../services/auth/getProfileUserApi";
import { getAllDoctorApi } from "../../services/doctor/getAllDoctor";
import getScheduleDoctorAll from "../../services/doctor/getScheduleDoctor";


const BookAppointment = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 2 states
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [doctorSchedules, setDoctorSchedules] = useState([]);
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  
  // Step 3 states
  const [note, setNote] = useState('');

  // Format tiền tệ VND
  const formatCurrency = (amount) => {
    if (!amount) return '0₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Load patient info từ getProfile API
  useEffect(() => {
    const loadPatientInfo = async () => {
      try {
        setLoading(true);
        
        // Lấy userId từ SecureStore
        const userId = await SecureStore.getItemAsync("userId");
        
        if (!userId) {
          throw new Error('Không tìm thấy thông tin người dùng đã đăng nhập');
        }

        // Call API getProfile để lấy thông tin user
        const response = await getProfileUserApi();
        
        if (response?.data?.data) {
          const userData = response.data.data;
          setPatientInfo({
            name: userData.name || 'Chưa có thông tin',
            email: userData.email || 'Chưa có thông tin',
            phone: userData.phoneNumber || 'Chưa có thông tin',
            id: userData.id
          });
        } else {
          throw new Error('Không thể lấy thông tin profile');
        }
      } catch (error) {
        console.error('Error loading patient info:', error);
        Alert.alert('Lỗi', 'Không thể tải thông tin người dùng: ' + error.message);
        setPatientInfo({
          name: 'Lỗi tải thông tin',
          email: 'Lỗi tải thông tin',
          phone: 'Lỗi tải thông tin'
        });
      } finally {
        setLoading(false);
      }
    };

    loadPatientInfo();
  }, []);

  // Load services
  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await getAllServiceApi();
        setServices(response.data.data.data);
      } catch (error) {
        console.error("Error fetching services:", error);
        Alert.alert('Lỗi', 'Không thể tải danh sách dịch vụ');
      }
    };

    loadServices();
  }, []);

  // Load doctors
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const response = await getAllDoctorApi();
        setDoctors(response.data.data.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        Alert.alert('Lỗi', 'Không thể tải danh sách bác sĩ');
      }
    };

    loadDoctors();
  }, []);

  // Load service details khi chọn service
  const handleSelectService = async (service) => {
    try {
      setLoading(true);
      const response = await getDetailsServiceApi(service.id);
      const newServiceDetails = response.data.data;
      
      setServiceDetails(newServiceDetails);
      setSelectedService(service);
      setShowServiceModal(false);
      
      // Reset time slot khi thay đổi service
      setSelectedTimeSlot(null);
      setAvailableSlots([]);
      
      // Reset date selection khi chọn service mới
      setSelectedDate('');
      setTempDate(new Date());
    } catch (error) {
      console.error('Error fetching service details:', error);
      Alert.alert('Lỗi', 'Không thể tải chi tiết dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedService) {
      setCurrentStep(2);
    } else if (currentStep === 2 && selectedDate && selectedTimeSlot) {
      // Dịch vụ tư vấn: cần ngày và time slot
      // Dịch vụ thường: cần ngày, bác sĩ và time slot
      const isConsultService = serviceDetails?.type === 'CONSULT';
      if (isConsultService || selectedDoctor) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      // Xử lý đặt lịch hẹn ở đây
      handleBookAppointment();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBookAppointment = async () => {
    try {
      setLoading(true);
      
      // Xác định type dựa trên service type
      const serviceType = serviceDetails?.type === 'CONSULT' ? 'ONLINE' : 'OFFLINE';
      
      console.log('Service details for type checking:', {
        serviceDetails,
        serviceDetailsType: serviceDetails?.type,
        selectedServiceName: selectedService?.name,
        determinedServiceType: serviceType
      });
      
      // Tạo appointment data theo format yêu cầu
      const appointmentData = {
        userId: parseInt(patientInfo.id),
        serviceId: parseInt(selectedService.id),
        appointmentTime: `${selectedDate}T${selectedTimeSlot.start}:00.000Z`,
        isAnonymous: false,
        type: serviceType,
        notes: note || ""
      };
      
      // Chỉ thêm doctorId nếu không phải là dịch vụ tư vấn (ONLINE)
      if (serviceType !== 'ONLINE') {
        appointmentData.doctorId = parseInt(selectedDoctor.id);
      }
      
     
      if (serviceType !== 'ONLINE') {
        console.log('- doctorId:', appointmentData.doctorId, typeof appointmentData.doctorId);
      }
      
      
  
      
      
      const response = await bookAppointmentApi(appointmentData);
      
      if (response?.data) {
        Alert.alert(
          'Thành công', 
          'Đặt lịch hẹn thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setCurrentStep(1);
                setSelectedService(null);
                setServiceDetails(null);
                setSelectedDate('');
                setSelectedDoctor(null);
                setSelectedTimeSlot(null);
                setNote('');
                setAvailableSlots([]);
              }
            }
          ]
        );
      }
    } catch (error) {
      let errorMessage = 'Không thể đặt lịch hẹn. Vui lòng thử lại.';
      let errorTitle = 'Lỗi';
      
      // Xử lý error message từ API với cấu trúc lồng nhau
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Trường hợp message là object (nested structure)
        if (errorData.message && typeof errorData.message === 'object') {
          if (errorData.message.message) {
            errorMessage = errorData.message.message;
            
            // Xử lý một số message phổ biến để hiển thị thân thiện hơn
            switch (errorData.message.message) {
              case 'No available doctor for this slot':
                errorMessage = 'Không có bác sĩ nào có lịch trống trong khung giờ này. Vui lòng chọn thời gian khác hoặc bác sĩ khác.';
                errorTitle = 'Khung giờ đã hết chỗ';
                break;
              case 'Doctor is not available':
                errorMessage = 'Bác sĩ không có lịch làm việc trong ngày này. Vui lòng chọn bác sĩ khác hoặc ngày khác.';
                errorTitle = 'Bác sĩ không có lịch';
                break;
              case 'Appointment time is in the past':
                errorMessage = 'Không thể đặt lịch hẹn trong quá khứ. Vui lòng chọn thời gian trong tương lai.';
                errorTitle = 'Thời gian không hợp lệ';
                break;
              case 'User already has an appointment at this time':
                errorMessage = 'Bạn đã có lịch hẹn trong khung giờ này. Vui lòng chọn thời gian khác.';
                errorTitle = 'Trung lịch hẹn';
                break;
              case 'Service is not available':
                errorMessage = 'Dịch vụ không khả dụng trong thời gian này. Vui lòng chọn dịch vụ khác.';
                errorTitle = 'Dịch vụ không khả dụng';
                break;
              default:
                // Giữ nguyên message từ API nếu không có translation
                break;
            }
          }
        }
        // Trường hợp message là string
        else if (errorData.message && typeof errorData.message === 'string') {
          errorMessage = errorData.message;
        }
        // Trường hợp chỉ có error field
        else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Đặt loading về false trước khi hiển thị Alert
      setLoading(false);
      
      // Sử dụng setTimeout để đảm bảo Alert hiển thị sau khi loading đã tắt
      setTimeout(() => {
        Alert.alert(
          errorTitle, 
          errorMessage, 
          [
            {
              text: 'Đóng',
              style: 'cancel'
            },
            {
              text: 'Thử lại',
              onPress: () => {
                // Nếu lỗi liên quan đến slot, reset time slot để user chọn lại
                if (errorMessage.includes('khung giờ') || errorMessage.includes('thời gian')) {
                  setSelectedTimeSlot(null);
                  // Reload available slots nếu cần
                  if (selectedDate && selectedDoctor && serviceDetails?.type !== 'CONSULT') {
                    loadDoctorScheduleAndSlots(selectedDoctor.id);
                  } else if (selectedDate && serviceDetails?.type === 'CONSULT') {
                    generateConsultationSlotsWithServiceDetailsAndDate(serviceDetails, selectedDate);
                  }
                }
              }
            }
          ]
        );
      }, 100);
      
      return; // Early return để tránh chạy finally block
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDoctor = async (doctor) => {
    try {
      setLoading(true);
      setSelectedDoctor(doctor);
      setShowDoctorModal(false);
      
      // Load doctor schedules và existing appointments
      await loadDoctorScheduleAndSlots(doctor.id);
    } catch (error) {
      console.error('Error selecting doctor:', error);
      Alert.alert('Lỗi', 'Không thể tải lịch trình bác sĩ');
    } finally {
      setLoading(false);
    }
  };

  const loadDoctorScheduleAndSlots = async (doctorId) => {
    try {
      // Load doctor schedules
      const scheduleResponse = await getScheduleDoctorAll.getScheduleDoctorAll(doctorId);
      const schedules = scheduleResponse.data.data || [];
      setDoctorSchedules(schedules);

      // Load existing appointments
      const appointmentResponse = await getAllAppointmentStaffApi();
      const appointments = appointmentResponse.data.data.data || [];
      setExistingAppointments(appointments);

      // Calculate available slots nếu đã có ngày được chọn
      if (selectedDate) {
        calculateAvailableSlots(schedules, appointments, doctorId);
      }
    } catch (error) {
      console.error('Error loading doctor schedule and appointments:', error);
      throw error;
    }
  };

  // Generate time slots cho dịch vụ tư vấn với serviceDetails và date cụ thể
  const generateConsultationSlotsWithServiceDetailsAndDate = (serviceDetailsParam, dateStr) => {
    if (!dateStr || !serviceDetailsParam) return;

    const availableSlots = [];
    
    // Kiểm tra xem ngày được chọn có phải là ngày hôm nay không
    const today = new Date();
    const localYear = today.getFullYear();
    const localMonth = (today.getMonth() + 1).toString().padStart(2, '0');
    const localDay = today.getDate().toString().padStart(2, '0');
    const todayStr = `${localYear}-${localMonth}-${localDay}`;
    const isToday = dateStr === todayStr;
    
    // Lấy thời gian hiện tại
    const currentHours = today.getHours();
    const currentMinutes = today.getMinutes();

    // Lấy khung giờ hoạt động của service
    const serviceStartTime = serviceDetailsParam.startTime || '07:00';
    const serviceEndTime = serviceDetailsParam.endTime || '17:00';
    
    const [serviceStartHour] = serviceStartTime.split(':').map(Number);
    const [serviceEndHour] = serviceEndTime.split(':').map(Number);

    console.log('Generating consultation slots with specific service details and date:', {
      selectedDate: dateStr,
      isToday,
      serviceTime: `${serviceStartTime} - ${serviceEndTime}`,
      currentTime: `${currentHours}:${currentMinutes}`,
      totalSlots: slots.length,
      serviceName: serviceDetailsParam.name
    });

    // Lọc slots theo khung giờ hoạt động của service
    slots.forEach(slot => {
      const [slotStartHour] = slot.start.split(':').map(Number);
      
      // Kiểm tra slot có nằm trong khung giờ hoạt động của service không
      const isWithinServiceTime = slotStartHour >= serviceStartHour && slotStartHour < serviceEndHour;
      
      if (!isWithinServiceTime) {
        console.log(`Slot ${slot.start} outside service time (${serviceStartTime}-${serviceEndTime})`);
        return;
      }

      // Kiểm tra slot đã qua chưa (chỉ cho ngày hôm nay)
      let isPastTime = false;
      if (isToday) {
        const [slotHour, slotMinute] = slot.start.split(':').map(Number);
        if (slotHour < currentHours || (slotHour === currentHours && slotMinute <= currentMinutes)) {
          isPastTime = true;
        }
      }

      if (!isPastTime) {
        availableSlots.push({
          start: slot.start,
          end: slot.end,
          shift: slotStartHour < 12 ? 'MORNING' : 'AFTERNOON',
          available: true,
          display: `${slot.start} - ${slot.end}`
        });
      }
    });

    console.log('Generated consultation slots with specific service details and date:', availableSlots);
    setAvailableSlots(availableSlots);
  };

  const calculateAvailableSlots = (schedules, appointments, doctorId) => {
    if (!selectedDate) return;

    // Sử dụng selectedDate trực tiếp (đã ở dạng YYYY-MM-DD)
    const selectedDateStr = selectedDate;
    const daySchedules = schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date).toISOString().split('T')[0];
      return scheduleDate === selectedDateStr && !schedule.isOff;
    });

    // Filter appointments cho bác sĩ và ngày đã chọn
    const doctorAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentTime).toISOString().split('T')[0];
      return appointment.doctorId === doctorId && 
             appointmentDate === selectedDateStr &&
             appointment.status !== 'CANCELLED';
    });

    // Kiểm tra xem ngày được chọn có phải là ngày hôm nay không
    const today = new Date();
    // Chuyển đổi ngày hiện tại về dạng YYYY-MM-DD (local timezone)
    const localYear = today.getFullYear();
    const localMonth = (today.getMonth() + 1).toString().padStart(2, '0');
    const localDay = today.getDate().toString().padStart(2, '0');
    const todayStr = `${localYear}-${localMonth}-${localDay}`;
    const isToday = selectedDateStr === todayStr;
    
    // Lấy thời gian hiện tại (giờ và phút) - local timezone
    const currentHours = today.getHours();
    const currentMinutes = today.getMinutes();
    const currentTimeStr = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;

  

    // Tạo available slots từ timeSlots cố định
    const availableSlots = [];
    
    daySchedules.forEach(schedule => {
      // Lấy slots theo ca làm việc
      const shiftSlots = getSlotsByShift(schedule.shift);
      
      shiftSlots.forEach(slot => {
        // Check slot có nằm trong thời gian hoạt động của service không
        let isWithinServiceTime = true;
        if (serviceDetails?.startTime && serviceDetails?.endTime) {
          const [slotHours] = slot.start.split(':').map(Number);
          const [serviceStartHours] = serviceDetails.startTime.split(':').map(Number);
          const [serviceEndHours] = serviceDetails.endTime.split(':').map(Number);
          
          // Slot phải nằm trong khoảng thời gian của service
          if (slotHours < serviceStartHours || slotHours >= serviceEndHours) {
            isWithinServiceTime = false;
          }
          
          console.log(`Service time check - Slot ${slot.start}: serviceTime=${serviceDetails.startTime}-${serviceDetails.endTime}, slotHour=${slotHours}, isWithinServiceTime=${isWithinServiceTime}`);
        }

        // Check nếu slot này đã có appointment
        const isBooked = doctorAppointments.some(appointment => {
          const appointmentTime = new Date(appointment.appointmentTime);
          
          // Lấy giờ và phút từ appointmentTime
          const appointmentHours = appointmentTime.getUTCHours();
          const appointmentMinutes = appointmentTime.getUTCMinutes();
          const appointmentTimeStr = `${appointmentHours.toString().padStart(2, '0')}:${appointmentMinutes.toString().padStart(2, '0')}`;
          
          // So sánh với slot.start
          return appointmentTimeStr === slot.start;
        });

        // Check nếu slot này đã qua (chỉ áp dụng cho ngày hôm nay)
        let isPastTime = false;
        if (isToday) {
          const [slotHours, slotMinutes] = slot.start.split(':').map(Number);
          // So sánh thời gian: slot đã qua nếu thời gian bắt đầu <= thời gian hiện tại
          if (slotHours < currentHours || (slotHours === currentHours && slotMinutes <= currentMinutes)) {
            isPastTime = true;
          }
          
          console.log(`Slot ${slot.start}: currentTime=${currentTimeStr}, slotTime=${slot.start}, isPast=${isPastTime}`);
        }

        // Chỉ thêm slot nếu: chưa được đặt + chưa qua thời gian + nằm trong thời gian service
        if (!isBooked && !isPastTime && isWithinServiceTime) {
          availableSlots.push({
            start: slot.start,
            end: slot.end,
            shift: schedule.shift,
            available: true,
            display: `${slot.start} - ${slot.end}`
          });
        }
      });
    });
    setAvailableSlots(availableSlots);
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setTempDate(date);
      // Chuyển đổi date thành YYYY-MM-DD sử dụng local timezone
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
    
      
      setSelectedDate(dateStr);
      
      // Kiểm tra loại dịch vụ để generate slots phù hợp
      if (serviceDetails?.type === 'CONSULT') {
        // Dịch vụ tư vấn - generate slots tự do theo khung giờ service
        generateConsultationSlotsWithServiceDetailsAndDate(serviceDetails, dateStr);
      } else if (selectedDoctor) {
        // Dịch vụ thường - tính theo lịch bác sĩ
        setTimeout(() => {
          calculateAvailableSlots(doctorSchedules, existingAppointments, selectedDoctor.id);
        }, 100);
      }
    }
  };

  const getMinDate = () => {
    return new Date(); // Không cho chọn ngày quá khứ
  };

  const renderStepIndicator = () => (
    <View className="flex-row justify-center items-center mb-6">
      {[1, 2, 3].map((step, index) => (
        <View key={step} className="flex-row items-center">
          <View 
            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              currentStep >= step 
                ? 'bg-blue-600 border-blue-500' 
                : 'bg-white border-gray-300'
            }`}
            style={currentStep >= step ? {
              shadowColor: '#2563EB',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4
            } : {}}
          >
            <Text className={`text-sm font-bold ${
              currentStep >= step ? 'text-white' : 'text-gray-500'
            }`}>
              {step}
            </Text>
          </View>
          {index < 2 && (
            <View className={`w-8 h-1 mx-2 rounded-full ${
              currentStep > step 
                ? 'bg-blue-600' 
                : 'bg-gray-300'
            }`} />
          )}
        </View>
      ))}
    </View>
  );

  const renderPatientInfo = () => (
    <View className="mx-6 mb-6 bg-white rounded-3xl p-6 shadow-lg border border-indigo-50">
      <View className="flex-row items-center mb-6">
        <View className="bg-indigo-100 p-3 rounded-full mr-4">
          <Ionicons name="person" size={24} color="#6366F1" />
        </View>
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-800">
            Thông Tin Bệnh Nhân
          </Text>
          <Text className="text-sm text-indigo-600 font-medium mt-1">
            Thông tin tài khoản của bạn
          </Text>
        </View>
      </View>
      
      <View className="space-y-4">
        <View className="bg-indigo-50 rounded-2xl p-4 border border-indigo-200">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="person-circle" size={20} color="#6366F1" />
              <Text className="text-sm text-gray-600 ml-2 font-medium">Họ và tên</Text>
            </View>
            <Text className="text-sm font-bold text-gray-800">
              {patientInfo?.name}
            </Text>
          </View>
        </View>
        
        <View className="bg-indigo-50 rounded-2xl p-4 border border-indigo-200">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="mail" size={20} color="#6366F1" />
              <Text className="text-sm text-gray-600 ml-2 font-medium">Email</Text>
            </View>
            <Text className="text-sm font-bold text-gray-800">
              {patientInfo?.email}
            </Text>
          </View>
        </View>
        
        <View className="bg-indigo-50 rounded-2xl p-4 border border-indigo-200">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="call" size={20} color="#6366F1" />
              <Text className="text-sm text-gray-600 ml-2 font-medium">Số điện thoại</Text>
            </View>
            <Text className="text-sm font-bold text-gray-800">
              {patientInfo?.phone}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderDateSelection = () => (
    <View className="mx-6 mb-6 space-y-6">
      {/* Date Selection Card */}
      <View className="bg-white rounded-3xl p-6 shadow-lg border border-blue-50">
        <View className="flex-row items-center mb-6">
          <View className="bg-blue-100 p-3 rounded-full mr-4">
            <Ionicons name="calendar" size={24} color="#3B82F6" />
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800">
              Chọn Ngày Khám
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-sm text-blue-600 font-medium">Bắt buộc</Text>
              <Text className="text-red-500 ml-1 text-lg">*</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          className={`border-2 rounded-2xl p-4 ${
            selectedDate 
              ? 'border-blue-200 bg-blue-50' 
              : 'border-gray-200 bg-gray-50'
          }`}
          onPress={() => setShowDatePicker(true)}
        >
          {selectedDate ? (
            <View className="flex-row items-center">
              <View className="bg-blue-500 p-2 rounded-full mr-4">
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800">
                  {(() => {
                    const [year, month, day] = selectedDate.split('-').map(Number);
                    const date = new Date(year, month - 1, day);
                    return date.toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    });
                  })()}
                </Text>
                <Text className="text-sm text-blue-600 font-medium mt-1">
                  ✓ Đã chọn ngày khám
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#3B82F6" />
            </View>
          ) : (
            <View className="flex-row items-center">
              <View className="bg-gray-300 p-2 rounded-full mr-4">
                <Ionicons name="calendar-outline" size={16} color="#6B7280" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 font-medium">
                  Chọn ngày khám bệnh
                </Text>
                <Text className="text-xs text-gray-400 mt-1">
                  Nhấn để mở lịch
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Doctor Selection Card */}
      <View className="bg-white rounded-3xl p-6 shadow-lg border border-purple-50">
        <View className="flex-row items-center mb-6">
          <View className="bg-purple-100 p-3 rounded-full mr-4">
            <Ionicons name="person" size={24} color="#8B5CF6" />
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800">
              Chọn Bác Sĩ
            </Text>
            <View className="flex-row items-center mt-1">
              {serviceDetails?.type !== 'CONSULT' ? (
                <>
                  <Text className="text-sm text-purple-600 font-medium">Bắt buộc</Text>
                  <Text className="text-red-500 ml-1 text-lg">*</Text>
                </>
              ) : (
                <Text className="text-sm text-gray-500 font-medium">Tự động</Text>
              )}
            </View>
          </View>
        </View>

        {serviceDetails?.type !== 'CONSULT' ? (
          <TouchableOpacity 
            className={`border-2 rounded-2xl p-4 ${
              selectedDoctor 
                ? 'border-purple-200 bg-purple-50' 
                : 'border-gray-200 bg-gray-50'
            }`}
            onPress={() => setShowDoctorModal(true)}
          >
            {selectedDoctor ? (
              <View className="flex-row items-center">
                <View className="bg-purple-500 p-2 rounded-full mr-4">
                  <Ionicons name="checkmark" size={16} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-800">
                    {selectedDoctor.user?.name || selectedDoctor.name}
                  </Text>
                  <Text className="text-sm text-purple-600 font-medium mt-1">
                    {selectedDoctor.specialization || 'Bác sĩ đa khoa'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8B5CF6" />
              </View>
            ) : (
              <View className="flex-row items-center">
                <View className="bg-gray-300 p-2 rounded-full mr-4">
                  <Ionicons name="person-outline" size={16} color="#6B7280" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 font-medium">
                    Chọn bác sĩ khám
                  </Text>
                  <Text className="text-xs text-gray-400 mt-1">
                    Nhấn để xem danh sách bác sĩ
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View className="border-2 border-emerald-200 bg-emerald-50 rounded-2xl p-4">
            <View className="flex-row items-center">
              <View className="bg-emerald-500 p-2 rounded-full mr-4">
                <Ionicons name="videocam" size={16} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800">
                  Tư vấn trực tuyến
                </Text>
                <Text className="text-sm text-emerald-600 font-medium mt-1">
                  Hệ thống sẽ tự động phân bổ chuyên gia
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Time Slots Card */}
      {selectedDate && ((serviceDetails?.type === 'CONSULT') || 
        (serviceDetails?.type !== 'CONSULT' && selectedDoctor)) && (
        <View className="bg-white rounded-3xl p-6 shadow-lg border border-green-50">
          <View className="flex-row items-center mb-6">
            <View className="bg-green-100 p-3 rounded-full mr-4">
              <Ionicons name="time" size={24} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-800">
                {serviceDetails?.type === 'CONSULT' ? 'Giờ Tư Vấn' : 'Giờ Khám Bệnh'}
              </Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-sm text-green-600 font-medium">Bắt buộc</Text>
                <Text className="text-red-500 ml-1 text-lg">*</Text>
              </View>
            </View>
          </View>
          
          {availableSlots.length > 0 ? (
            <View className="space-y-4">
              {/* Morning Slots */}
              {availableSlots.filter(slot => slot.shift === 'MORNING' || slot.start < '12:00').length > 0 && (
                <View>
                  <Text className="text-sm font-bold text-gray-700 mb-3">
                    🌅 Buổi Sáng
                  </Text>
                  <View className="flex-row flex-wrap gap-3">
                    {availableSlots
                      .filter(slot => slot.shift === 'MORNING' || slot.start < '12:00')
                      .map((slot, index) => (
                        <TouchableOpacity
                          key={index}
                          className={`border-2 rounded-xl px-4 py-3 min-w-[100px] ${
                            selectedTimeSlot?.start === slot.start 
                              ? 'bg-green-500 border-green-500' 
                              : 'bg-green-50 border-green-200'
                          }`}
                          onPress={() => setSelectedTimeSlot(slot)}
                        >
                          <Text className={`text-sm font-bold text-center ${
                            selectedTimeSlot?.start === slot.start ? 'text-white' : 'text-green-700'
                          }`}>
                            {slot.display}
                          </Text>
                        </TouchableOpacity>
                      ))
                    }
                  </View>
                </View>
              )}

              {/* Afternoon Slots */}
              {availableSlots.filter(slot => slot.shift === 'AFTERNOON' || slot.start >= '12:00').length > 0 && (
                <View>
                  <Text className="text-sm font-bold text-gray-700 mb-3">
                    🌇 Buổi Chiều
                  </Text>
                  <View className="flex-row flex-wrap gap-3">
                    {availableSlots
                      .filter(slot => slot.shift === 'AFTERNOON' || slot.start >= '12:00')
                      .map((slot, index) => (
                        <TouchableOpacity
                          key={index}
                          className={`border-2 rounded-xl px-4 py-3 min-w-[100px] ${
                            selectedTimeSlot?.start === slot.start 
                              ? 'bg-green-500 border-green-500' 
                              : 'bg-green-50 border-green-200'
                          }`}
                          onPress={() => setSelectedTimeSlot(slot)}
                        >
                          <Text className={`text-sm font-bold text-center ${
                            selectedTimeSlot?.start === slot.start ? 'text-white' : 'text-green-700'
                          }`}>
                            {slot.display}
                          </Text>
                        </TouchableOpacity>
                      ))
                    }
                  </View>
                </View>
              )}
            </View>
          ) : (
            <View className="bg-gray-50 rounded-2xl p-6 items-center">
              <View className="bg-gray-200 p-4 rounded-full mb-4">
                <Ionicons name="calendar-outline" size={32} color="#9CA3AF" />
              </View>
              <Text className="text-gray-700 font-bold text-center mb-2">
                Không có giờ khám khả dụng
              </Text>
              <Text className="text-gray-500 text-sm text-center leading-relaxed">
                {(() => {
                  const today = new Date();
                  const localYear = today.getFullYear();
                  const localMonth = (today.getMonth() + 1).toString().padStart(2, '0');
                  const localDay = today.getDate().toString().padStart(2, '0');
                  const todayStr = `${localYear}-${localMonth}-${localDay}`;
                  
                  let message = 'Vui lòng chọn ngày khác';
                  
                  if (selectedDate === todayStr) {
                    message = 'Các giờ khám có thể đã được đặt hoặc đã qua';
                  }
                  
                  if (serviceDetails?.startTime && serviceDetails?.endTime) {
                    message += `\n\nDịch vụ "${selectedService?.name}" chỉ hoạt động từ ${serviceDetails.startTime} - ${serviceDetails.endTime}`;
                  }
                  
                  return message;
                })()}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderConfirmation = () => (
    <View className="mx-6 mb-6 space-y-6">
      {/* Summary Card */}
      <View className="bg-white rounded-3xl p-6 shadow-lg border border-orange-50">
        <View className="flex-row items-center mb-6">
          <View className="bg-orange-100 p-3 rounded-full mr-4">
            <Ionicons name="clipboard" size={24} color="#F97316" />
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800">
              Xác Nhận Thông Tin
            </Text>
            <Text className="text-sm text-orange-600 font-medium mt-1">
              Kiểm tra lại thông tin đặt lịch
            </Text>
          </View>
        </View>

        {/* Appointment Summary */}
        <View className="bg-orange-50 rounded-2xl p-5 border border-orange-200">
          <View className="flex-row items-center mb-4">
            <View className="bg-orange-500 p-2 rounded-full mr-3">
              <Ionicons name="calendar" size={16} color="white" />
            </View>
            <Text className="text-lg font-bold text-gray-800">
              Thông tin lịch hẹn
            </Text>
          </View>
          
          <View className="space-y-4">
            {/* Service Info */}
            <View className="bg-white rounded-xl p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600 font-medium">Dịch vụ</Text>
                <Text className="text-sm font-bold text-gray-800 flex-1 text-right">
                  {selectedService?.name}
                </Text>
              </View>
            </View>
            
            {/* Doctor Info (if not consultation) */}
            {serviceDetails?.type !== 'CONSULT' && (
              <View className="bg-white rounded-xl p-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-600 font-medium">Bác sĩ</Text>
                  <Text className="text-sm font-bold text-gray-800 flex-1 text-right">
                    {selectedDoctor?.user?.name}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between mt-2">
                  <Text className="text-xs text-gray-500">Chuyên khoa</Text>
                  <Text className="text-xs text-purple-600 font-medium">
                    {selectedDoctor?.specialization || 'Đa khoa'}
                  </Text>
                </View>
              </View>
            )}
            
            {/* Consultation Type (if consultation) */}
            {serviceDetails?.type === 'CONSULT' && (
              <View className="bg-white rounded-xl p-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-600 font-medium">Loại dịch vụ</Text>
                  <View className="flex-row items-center">
                    <Ionicons name="videocam" size={16} color="#3B82F6" />
                    <Text className="text-sm font-bold text-blue-600 ml-2">
                      Tư vấn trực tuyến
                    </Text>
                  </View>
                </View>
              </View>
            )}
            
            {/* Date Info */}
            <View className="bg-white rounded-xl p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600 font-medium">Ngày khám</Text>
                <Text className="text-sm font-bold text-gray-800 flex-1 text-right">
                  {(() => {
                    const [year, month, day] = selectedDate.split('-').map(Number);
                    const date = new Date(year, month - 1, day);
                    return date.toLocaleDateString('vi-VN');
                  })()}
                </Text>
              </View>
            </View>
            
            {/* Time Info */}
            <View className="bg-white rounded-xl p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600 font-medium">Giờ khám</Text>
                <View className="flex-row items-center">
                  <Ionicons name="time" size={16} color="#10B981" />
                  <Text className="text-sm font-bold text-gray-800 ml-2">
                    {selectedTimeSlot?.display}
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Price Info */}
            <View className="bg-white rounded-xl p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600 font-medium">Giá dịch vụ</Text>
                <View className="flex-row items-center">
                  <Ionicons name="cash" size={16} color="#10B981" />
                  <Text className="text-lg font-bold text-green-600 ml-2">
                    {formatCurrency(serviceDetails?.price)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Notes Card */}
      <View className="bg-white rounded-3xl p-6 shadow-lg border border-blue-50">
        <View className="flex-row items-center mb-4">
          <View className="bg-blue-100 p-3 rounded-full mr-4">
            <Ionicons name="document-text" size={24} color="#3B82F6" />
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800">
              Ghi Chú
            </Text>
            <Text className="text-sm text-blue-600 font-medium mt-1">
              Tùy chọn (không bắt buộc)
            </Text>
          </View>
        </View>

        <TextInput
          className="border-2 border-gray-200 rounded-2xl p-4 text-sm text-gray-800 min-h-[100px] bg-gray-50"
          placeholder="Nhập ghi chú về triệu chứng, yêu cầu đặc biệt..."
          value={note}
          onChangeText={setNote}
          multiline
          textAlignVertical="top"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Important Notes Card */}
      <View className="bg-white rounded-3xl p-6 shadow-lg border border-red-50">
        <View className="flex-row items-center mb-4">
          <View className="bg-red-100 p-3 rounded-full mr-4">
            <Ionicons name="information-circle" size={24} color="#EF4444" />
          </View>
          <Text className="text-xl font-bold text-gray-800">
            Lưu Ý Quan Trọng
          </Text>
        </View>
        
        <View className="space-y-3">
          <View className="flex-row items-start">
            <View className="bg-red-500 w-2 h-2 rounded-full mt-2 mr-3"></View>
            <Text className="text-sm text-gray-700 flex-1 leading-relaxed">
              Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục
            </Text>
          </View>
          
          <View className="flex-row items-start">
            <View className="bg-red-500 w-2 h-2 rounded-full mt-2 mr-3"></View>
            <Text className="text-sm text-gray-700 flex-1 leading-relaxed">
              Mang theo giấy tờ tùy thân và thẻ bảo hiểm y tế (nếu có)
            </Text>
          </View>
          
          <View className="flex-row items-start">
            <View className="bg-red-500 w-2 h-2 rounded-full mt-2 mr-3"></View>
            <Text className="text-sm text-gray-700 flex-1 leading-relaxed">
              Liên hệ hotline để thay đổi lịch hẹn trước 24h
            </Text>
          </View>
          
          {serviceDetails?.type === 'CONSULT' && (
            <View className="flex-row items-start">
              <View className="bg-blue-500 w-2 h-2 rounded-full mt-2 mr-3"></View>
              <Text className="text-sm text-gray-700 flex-1 leading-relaxed">
                Dịch vụ tư vấn trực tuyến - chúng tôi sẽ liên hệ qua video call
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderServiceSelection = () => (
    <View className="mx-6 mb-6 bg-white rounded-3xl p-6 shadow-lg border border-blue-50">
      <View className="flex-row items-center mb-6">
        <View className="bg-emerald-100 p-3 rounded-full mr-4">
          <Ionicons name="medical" size={24} color="#10B981" />
        </View>
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-800">
            Chọn Dịch Vụ
          </Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-sm text-emerald-600 font-medium">Bắt buộc</Text>
            <Text className="text-red-500 ml-1 text-lg">*</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        className={`border-2 rounded-2xl p-4 ${
          selectedService 
            ? 'border-emerald-200 bg-emerald-50' 
            : 'border-gray-200 bg-gray-50'
        }`}
        onPress={() => setShowServiceModal(true)}
      >
        {selectedService ? (
          <View className="flex-row items-center">
            <View className="bg-emerald-500 p-2 rounded-full mr-4">
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-800">
                {selectedService.name}
              </Text>
              <Text className="text-sm text-emerald-600 font-medium mt-1">
                ✓ Đã chọn dịch vụ
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#10B981" />
          </View>
        ) : (
          <View className="flex-row items-center">
            <View className="bg-gray-300 p-2 rounded-full mr-4">
              <Ionicons name="medical-outline" size={16} color="#6B7280" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-500 font-medium">
                Chọn dịch vụ khám bệnh
              </Text>
              <Text className="text-xs text-gray-400 mt-1">
                Nhấn để xem danh sách dịch vụ
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </View>
        )}
      </TouchableOpacity>

      {/* Service Details */}
      {serviceDetails && (
        <View className="mt-6 p-5 bg-emerald-50 rounded-2xl border border-emerald-200">
          <View className="flex-row items-center mb-4">
            <View className="bg-emerald-500 p-2 rounded-full mr-3">
              <Ionicons name="checkmark-circle" size={16} color="white" />
            </View>
            <Text className="text-lg font-bold text-gray-800">
              {serviceDetails.name}
            </Text>
          </View>
          
          <View className="space-y-3">
            <View className="flex-row items-center justify-between bg-white rounded-xl p-3">
              <View className="flex-row items-center">
                <Ionicons name="cash-outline" size={16} color="#10B981" />
                <Text className="text-sm text-gray-600 ml-2">Giá dịch vụ</Text>
              </View>
              <Text className="text-lg font-bold text-emerald-600">
                {formatCurrency(serviceDetails.price)}
              </Text>
            </View>
            
            <View className="flex-row items-center justify-between bg-white rounded-xl p-3">
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={16} color="#10B981" />
                <Text className="text-sm text-gray-600 ml-2">Thời gian hoạt động</Text>
              </View>
              <Text className="text-sm font-bold text-gray-800">
                {serviceDetails.startTime} - {serviceDetails.endTime}
              </Text>
            </View>
          </View>
          
          {serviceDetails.description && (
            <View className="mt-4 p-3 bg-white rounded-xl">
              <Text className="text-sm text-gray-600 leading-relaxed">
                {serviceDetails.description}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderServiceModal = () => (
    <Modal
      visible={showServiceModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowServiceModal(false)}
    >
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[80%]">
          {/* Modal Header */}
          <View className="p-6 border-b border-gray-100">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <View className="bg-emerald-100 p-2 rounded-full mr-3">
                  <Ionicons name="medical" size={20} color="#10B981" />
                </View>
                <Text className="text-xl font-bold text-gray-800">
                  Chọn Dịch Vụ
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => setShowServiceModal(false)}
                className="p-2 bg-gray-100 rounded-full"
              >
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <Text className="text-sm text-gray-600 mt-2">
              Chọn dịch vụ y tế phù hợp với nhu cầu của bạn
            </Text>
          </View>
          
          {/* Services List */}
          <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
            {services.map((service, index) => (
              <TouchableOpacity
                key={service.id}
                className={`border-2 rounded-2xl p-5 mb-4 ${
                  selectedService?.id === service.id 
                    ? 'border-emerald-300 bg-emerald-50' 
                    : 'border-gray-200 bg-white'
                }`}
                onPress={() => handleSelectService(service)}
              >
                <View className="flex-row items-start">
                  <View className={`p-3 rounded-full mr-4 ${
                    selectedService?.id === service.id 
                      ? 'bg-emerald-500' 
                      : 'bg-gray-100'
                  }`}>
                    <Ionicons 
                      name="medical" 
                      size={20} 
                      color={selectedService?.id === service.id ? "white" : "#6B7280"} 
                    />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-lg font-bold text-gray-800">
                        {service.name}
                      </Text>
                      {selectedService?.id === service.id && (
                        <View className="bg-emerald-500 p-1 rounded-full">
                          <Ionicons name="checkmark" size={16} color="white" />
                        </View>
                      )}
                    </View>
                    
                    <Text className="text-sm text-gray-600 mb-3 leading-relaxed">
                      {service.description}
                    </Text>
                    
                    <View className="flex-row items-center justify-between">
                      <View className="bg-emerald-100 px-3 py-2 rounded-full">
                        <Text className="text-sm font-bold text-emerald-700">
                          {formatCurrency(service.price)}
                        </Text>
                      </View>
                      {selectedService?.id === service.id ? (
                        <Text className="text-sm font-medium text-emerald-600">
                          ✓ Đã chọn
                        </Text>
                      ) : (
                        <Text className="text-sm text-gray-500">
                          Nhấn để chọn
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderDoctorModal = () => {
    // Không hiển thị modal chọn bác sĩ cho dịch vụ tư vấn
    if (serviceDetails?.type === 'CONSULT') {
      return null;
    }

    return (
      <Modal
        visible={showDoctorModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDoctorModal(false)}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-3xl max-h-[80%]">
            {/* Modal Header */}
            <View className="p-6 border-b border-gray-100">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <View className="bg-purple-100 p-2 rounded-full mr-3">
                    <Ionicons name="person" size={20} color="#8B5CF6" />
                  </View>
                  <Text className="text-xl font-bold text-gray-800">
                    Chọn Bác Sĩ
                  </Text>
                </View>
                <TouchableOpacity 
                  onPress={() => setShowDoctorModal(false)}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <Ionicons name="close" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <Text className="text-sm text-gray-600 mt-2">
                Chọn bác sĩ phù hợp với nhu cầu của bạn
              </Text>
            </View>
            
            {/* Doctors List */}
            <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
              {doctors.map((doctor, index) => (
                <TouchableOpacity
                  key={doctor.id}
                  className={`border-2 rounded-2xl p-5 mb-4 ${
                    selectedDoctor?.id === doctor.id 
                      ? 'border-purple-300 bg-purple-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                  onPress={() => handleSelectDoctor(doctor)}
                >
                  <View className="flex-row items-start">
                    <View className={`p-4 rounded-full mr-4 ${
                      selectedDoctor?.id === doctor.id 
                        ? 'bg-purple-500' 
                        : 'bg-gray-100'
                    }`}>
                      <Ionicons 
                        name="person" 
                        size={24} 
                        color={selectedDoctor?.id === doctor.id ? "white" : "#6B7280"} 
                      />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-lg font-bold text-gray-800">
                          {doctor.user?.name || 'Tên bác sĩ'}
                        </Text>
                        {selectedDoctor?.id === doctor.id && (
                          <View className="bg-purple-500 p-1 rounded-full">
                            <Ionicons name="checkmark" size={16} color="white" />
                          </View>
                        )}
                      </View>
                      
                      <Text className="text-sm text-gray-600 mb-2">
                        {doctor.user?.email || 'Email không có'}
                      </Text>
                      
                      <View className="bg-purple-100 px-3 py-2 rounded-full self-start">
                        <Text className="text-sm font-bold text-purple-700">
                          {doctor.specialization || 'Bác sĩ đa khoa'}
                        </Text>
                      </View>
                      
                      <View className="flex-row items-center justify-between mt-3">
                        {selectedDoctor?.id === doctor.id ? (
                          <Text className="text-sm font-medium text-purple-600">
                            ✓ Đã chọn
                          </Text>
                        ) : (
                          <Text className="text-sm text-gray-500">
                            Nhấn để chọn
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 px-4 py-6 pt-12">
        <View className="flex-row items-center mb-4">
          <Ionicons name="calendar-outline" size={24} color="white" />
          <Text className="text-xl font-bold text-white ml-3">
            Đặng Ký Lịch Hẹn Khám Bệnh
          </Text>
        </View>
        <Text className="text-white/90 text-sm">
          Đặt lịch hẹn với các chuyên gia y tế của chúng tôi
        </Text>
      </View>

      {/* Step Indicator */}
      <View className="bg-white pt-6 pb-2">
        {renderStepIndicator()}
      </View>

      {/* Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Patient Info */}
        {renderPatientInfo()}

        {/* Step 1: Service Selection */}
        {currentStep === 1 && renderServiceSelection()}

        {/* Step 2: Date and Doctor Selection */}
        {currentStep === 2 && renderDateSelection()}

        {/* Step 3: Confirmation and Note */}
        {currentStep === 3 && renderConfirmation()}

        {/* Navigation Buttons */}
        <View className="px-6 pb-8 space-y-4">
          {currentStep > 1 && (
            <TouchableOpacity 
              className="py-4 rounded-2xl flex-row items-center justify-center bg-white border-2 border-gray-200 shadow-sm"
              onPress={handleBack}
            >
              <Ionicons name="arrow-back" size={20} color="#6B7280" />
              <Text className="font-bold ml-3 text-gray-700 text-lg">
                Quay lại
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            className={`py-5 rounded-2xl flex-row items-center justify-center shadow-lg border-2 ${
              (currentStep === 1 && selectedService) || 
              (currentStep === 2 && selectedDate && selectedTimeSlot && (serviceDetails?.type === 'CONSULT' || selectedDoctor)) ||
              currentStep === 3
                ? 'bg-blue-600 border-blue-500' 
                : 'bg-gray-400 border-gray-300'
            }`}
            onPress={handleNext}
            disabled={
              (currentStep === 1 && !selectedService) ||
              (currentStep === 2 && (!selectedDate || !selectedTimeSlot || (serviceDetails?.type !== 'CONSULT' && !selectedDoctor)))
            }
            style={{
              shadowColor: (currentStep === 1 && selectedService) || 
                          (currentStep === 2 && selectedDate && selectedTimeSlot && (serviceDetails?.type === 'CONSULT' || selectedDoctor)) ||
                          currentStep === 3 ? '#2563EB' : '#6B7280',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8
            }}
          >
            <Text className={`font-bold mr-3 text-lg ${
              (currentStep === 1 && selectedService) || 
              (currentStep === 2 && selectedDate && selectedTimeSlot && (serviceDetails?.type === 'CONSULT' || selectedDoctor)) ||
              currentStep === 3
                ? 'text-white' : 'text-gray-600'
            }`}>
              {currentStep === 1 ? 'Tiếp tục' : currentStep === 2 ? 'Xác nhận' : 'Đặt lịch hẹn'}
            </Text>
            <Ionicons 
              name={currentStep === 3 ? "checkmark-circle" : "arrow-forward"}
              size={22} 
              color={
                (currentStep === 1 && selectedService) || 
                (currentStep === 2 && selectedDate && selectedTimeSlot && (serviceDetails?.type === 'CONSULT' || selectedDoctor)) ||
                currentStep === 3
                  ? "white" : "#9CA3AF"
              } 
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modals */}
      {renderServiceModal()}
      {renderDoctorModal()}

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          minimumDate={getMinDate()}
          onChange={handleDateChange}
        />
      )}

      {/* Loading Overlay */}
      {loading && (
        <View className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <View className="bg-white p-6 rounded-lg">
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text className="text-gray-600 mt-2 text-center">Đang tải...</Text>
          </View>
        </View>
      )}
    </View>
  );
}

export default BookAppointment