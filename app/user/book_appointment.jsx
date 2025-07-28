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
      
      console.log('=== APPOINTMENT BOOKING PAYLOAD ===');
      console.log('Full payload:', JSON.stringify(appointmentData, null, 2));
      console.log('Individual fields:');
      console.log('- userId:', appointmentData.userId, typeof appointmentData.userId);
      if (serviceType !== 'ONLINE') {
        console.log('- doctorId:', appointmentData.doctorId, typeof appointmentData.doctorId);
      }
      console.log('- serviceId:', appointmentData.serviceId, typeof appointmentData.serviceId);
      console.log('- appointmentTime:', appointmentData.appointmentTime, typeof appointmentData.appointmentTime);
      console.log('- isAnonymous:', appointmentData.isAnonymous, typeof appointmentData.isAnonymous);
      console.log('- type:', appointmentData.type, typeof appointmentData.type);
      console.log('- notes:', appointmentData.notes, typeof appointmentData.notes);
      console.log('===================================');
      
      console.log('=== COMPARISON WITH WORKING PAYLOAD ===');
      console.log('Working Swagger payload:');
      console.log('{"userId": 8, "serviceId": 2, "appointmentTime": "2025-07-28T10:30:00.000Z", "isAnonymous": false, "type": "ONLINE", "notes": "test conssultationbnn"}');
      console.log('App payload:');
      console.log(JSON.stringify(appointmentData));
      console.log('Differences check:');
      console.log('- userId type match:', typeof appointmentData.userId === 'number', 'App:', appointmentData.userId, 'Expected: number');
      console.log('- serviceId type match:', typeof appointmentData.serviceId === 'number', 'App:', appointmentData.serviceId, 'Expected: number');
      console.log('- appointmentTime format:', appointmentData.appointmentTime);
      console.log('- type match:', appointmentData.type === 'ONLINE', 'App:', appointmentData.type, 'Expected: ONLINE');
      console.log('- isAnonymous match:', appointmentData.isAnonymous === false, 'App:', appointmentData.isAnonymous, 'Expected: false');
      console.log('- notes type:', typeof appointmentData.notes, 'Value:', appointmentData.notes);
      console.log('=====================================');
      
      console.log('Booking appointment with data:', {
        ...appointmentData,
        appointmentTimeFormatted: appointmentData.appointmentTime,
        selectedDate,
        selectedTimeSlot: selectedTimeSlot.start,
        patientId: patientInfo.id,
        doctorId: serviceType !== 'ONLINE' ? selectedDoctor?.id : 'N/A (consultation)',
        serviceId: selectedService.id,
        serviceType: serviceDetails?.type,
        determinedType: serviceType
      });
      
      // Gọi API đặt lịch hẹn
      console.log('Calling bookAppointmentApi...');
      console.log('API URL:', process.env.EXPO_PUBLIC_API_URL + '/appointments');
      
      // Kiểm tra token trước khi gọi API
      const token = await SecureStore.getItemAsync('accessToken');
      console.log('Access token exists:', !!token);
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
      
      const response = await bookAppointmentApi(appointmentData);
      console.log('API Response:', response);
      
      if (response?.data) {
        console.log('Booking successful:', response.data);
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
      console.error('=== BOOKING ERROR ===');
      console.error('Full error object:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error response headers:', error.response?.headers);
      console.error('Error config:', error.config);
      console.error('Error request:', error.request);
      
      // Log network info
      console.error('=== NETWORK DEBUG ===');
      console.error('Request URL:', error.config?.url);
      console.error('Request method:', error.config?.method);
      console.error('Request headers:', error.config?.headers);
      console.error('Request data:', error.config?.data);
      console.error('====================');
      
      let errorMessage = 'Không thể đặt lịch hẹn. Vui lòng thử lại.';
      
      // Xử lý error message từ API
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        console.error('API Error Message:', error.response.data.message);
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
        console.error('API Error:', error.response.data.error);
      } else if (error.message) {
        errorMessage = error.message;
        console.error('Network Error:', error.message);
      }
      
      // Log full error details for debugging
      if (error.response?.data) {
        console.error('Full API error response:', JSON.stringify(error.response.data, null, 2));
      }
      
      Alert.alert('Lỗi', errorMessage);
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

    console.log('Current time check:', {
      selectedDate: selectedDateStr,
      todayStr,
      isToday,
      currentTime: currentTimeStr,
      localTimezone: `GMT${today.getTimezoneOffset() / -60 >= 0 ? '+' : ''}${today.getTimezoneOffset() / -60}`
    });

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

    console.log('Available slots after filtering:', availableSlots);
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
      
      console.log('Date selection:', {
        selectedDate: date,
        formattedDate: dateStr,
        localTimezone: `GMT${date.getTimezoneOffset() / -60 >= 0 ? '+' : ''}${date.getTimezoneOffset() / -60}`
      });
      
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
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= step ? 'bg-purple-500' : 'bg-gray-300'
            }`}
          >
            <Text className={`text-sm font-bold ${
              currentStep >= step ? 'text-white' : 'text-gray-600'
            }`}>
              {step}
            </Text>
          </View>
          {index < 2 && (
            <View className={`w-8 h-0.5 mx-2 ${
              currentStep > step ? 'bg-purple-500' : 'bg-gray-300'
            }`} />
          )}
        </View>
      ))}
    </View>
  );

  const renderPatientInfo = () => (
    <View className="bg-white mx-4 mb-4 rounded-xl p-4 shadow-sm">
      <View className="flex-row items-center mb-3">
        <Ionicons name="person" size={20} color="#8B5CF6" />
        <Text className="text-lg font-semibold text-gray-800 ml-2">
          Thông Tin Bệnh Nhân
        </Text>
      </View>
      
      <View className="space-y-3">
        <View className="flex-row justify-between">
          <Text className="text-sm text-gray-600 flex-1">Họ và tên</Text>
          <Text className="text-sm font-medium text-gray-800 flex-2">
            {patientInfo?.name}
          </Text>
        </View>
        
        <View className="flex-row justify-between">
          <Text className="text-sm text-gray-600 flex-1">Email</Text>
          <Text className="text-sm font-medium text-gray-800 flex-2">
            {patientInfo?.email}
          </Text>
        </View>
        
        <View className="flex-row justify-between">
          <Text className="text-sm text-gray-600 flex-1">Số điện thoại</Text>
          <Text className="text-sm font-medium text-gray-800 flex-2">
            {patientInfo?.phone}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderDateSelection = () => (
    <View className="bg-white mx-4 mb-4 rounded-xl p-4 shadow-sm">
      {/* Hiển thị phần chọn ngày cho tất cả dịch vụ */}
      <View className="flex-row items-center mb-3">
        <Ionicons name="calendar" size={20} color="#8B5CF6" />
        <Text className="text-lg font-semibold text-gray-800 ml-2">
          Chọn Ngày Khám
        </Text>
        <Text className="text-red-500 ml-1">*</Text>
      </View>

      <TouchableOpacity 
        className="border border-gray-300 rounded-lg p-4 flex-row items-center justify-between mb-4"
        onPress={() => setShowDatePicker(true)}
      >
        {selectedDate ? (
          <View className="flex-row items-center flex-1">
            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            <View className="ml-3">
              <Text className="text-sm font-bold text-gray-800">
                {(() => {
                  // Parse selectedDate (YYYY-MM-DD) để tránh timezone issues
                  const [year, month, day] = selectedDate.split('-').map(Number);
                  const date = new Date(year, month - 1, day); // month - 1 vì getMonth() bắt đầu từ 0
                  
                  console.log('Date display:', {
                    selectedDate,
                    parsedDate: date,
                    displayString: date.toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })
                  });
                  
                  return date.toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  });
                })()}
              </Text>
              <Text className="text-xs text-gray-500">
                {(() => {
                  const [year] = selectedDate.split('-').map(Number);
                  return year;
                })()}
              </Text>
            </View>
          </View>
        ) : (
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />
            <Text className="text-gray-500 ml-3">Chọn ngày khám bệnh</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      </TouchableOpacity>

      <View className="flex-row items-center mb-3">
        <Ionicons name="person" size={20} color="#8B5CF6" />
        <Text className="text-lg font-semibold text-gray-800 ml-2">
          Chọn Bác Sĩ
        </Text>
        {serviceDetails?.type !== 'CONSULT' && (
          <Text className="text-red-500 ml-1">*</Text>
        )}
      </View>

      {/* Chỉ hiển thị phần chọn bác sĩ nếu không phải dịch vụ tư vấn */}
      {serviceDetails?.type !== 'CONSULT' ? (
        <TouchableOpacity 
          className="border border-gray-300 rounded-lg p-3 flex-row items-center justify-between"
          onPress={() => setShowDoctorModal(true)}
        >
          {selectedDoctor ? (
            <View className="flex-row items-center flex-1">
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <View className="ml-2 flex-1">
                <Text className="text-sm font-medium text-gray-800">
                  {selectedDoctor.user?.name || selectedDoctor.name}
                </Text>
                <Text className="text-xs text-blue-600">
                  {selectedDoctor.specialization || 'Bác sĩ đa khoa'}
                </Text>
              </View>
            </View>
          ) : (
            <Text className="text-gray-500">Chọn bác sĩ</Text>
          )}
          <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      ) : (
        <View className="border border-blue-200 bg-blue-50 rounded-lg p-3 flex-row items-center">
          <Ionicons name="videocam" size={16} color="#3B82F6" />
          <Text className="text-sm text-blue-700 ml-2 flex-1">
            Dịch vụ tư vấn trực tuyến - Không cần chọn bác sĩ cụ thể
          </Text>
        </View>
      )}

      {/* Available Time Slots */}
      {selectedDate && ((serviceDetails?.type === 'CONSULT') || 
        (serviceDetails?.type !== 'CONSULT' && selectedDoctor)) && (
        <View className="mt-4">
          <View className="flex-row items-center mb-3">
            <Ionicons name="time" size={20} color="#8B5CF6" />
            <Text className="text-lg font-semibold text-gray-800 ml-2">
              {serviceDetails?.type === 'CONSULT' ? 'Giờ tư vấn khả dụng' : 'Giờ khám khả dụng'}
            </Text>
          </View>
          
          {availableSlots.length > 0 ? (
            <View className="flex-row flex-wrap gap-2">
              {availableSlots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  className={`border rounded-lg px-3 py-2 flex-row items-center ${
                    selectedTimeSlot?.start === slot.start 
                      ? 'bg-purple-100 border-purple-300' 
                      : 'bg-green-50 border-green-200'
                  }`}
                  onPress={() => setSelectedTimeSlot(slot)}
                >
                  <Ionicons 
                    name={selectedTimeSlot?.start === slot.start ? "radio-button-on" : "checkmark-circle"} 
                    size={14} 
                    color={selectedTimeSlot?.start === slot.start ? "#8B5CF6" : "#10B981"} 
                  />
                  <Text className={`text-xs font-medium ml-1 ${
                    selectedTimeSlot?.start === slot.start ? 'text-purple-700' : 'text-green-700'
                  }`}>
                    {slot.display}
                  </Text>
                  {serviceDetails?.type !== 'CONSULT' && (
                    <Text className={`text-xs ml-1 ${
                      selectedTimeSlot?.start === slot.start ? 'text-purple-600' : 'text-green-600'
                    }`}>
                      ({slot.shift === 'MORNING' ? 'Sáng' : 'Chiều'})
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="bg-gray-50 rounded-lg p-4 items-center">
              <Ionicons name="calendar-outline" size={24} color="#9CA3AF" />
              <Text className="text-gray-500 text-sm mt-2 text-center">
                {(() => {
                  // Kiểm tra ngày hôm nay bằng local timezone
                  const today = new Date();
                  const localYear = today.getFullYear();
                  const localMonth = (today.getMonth() + 1).toString().padStart(2, '0');
                  const localDay = today.getDate().toString().padStart(2, '0');
                  const todayStr = `${localYear}-${localMonth}-${localDay}`;
                  
                  let message = 'Không có giờ khám nào khả dụng trong ngày này';
                  
                  if (selectedDate === todayStr) {
                    message += '\n(Các slot có thể đã được đặt hoặc đã qua giờ)';
                  }
                  
                  // Thêm thông tin về thời gian hoạt động của service
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
    <View className="bg-white mx-4 mb-4 rounded-xl p-4 shadow-sm">
      <View className="flex-row items-center mb-4">
        <Ionicons name="clipboard" size={20} color="#8B5CF6" />
        <Text className="text-lg font-semibold text-gray-800 ml-2">
          Xác Nhận Thông Tin
        </Text>
      </View>

      {/* Tóm tắt thông tin đặt lịch */}
      <View className="bg-gray-50 rounded-lg p-4 mb-4">
        <Text className="text-sm font-bold text-gray-800 mb-3">
          Thông tin lịch hẹn:
        </Text>
        
        <View className="space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-600">Dịch vụ:</Text>
            <Text className="text-sm font-medium text-gray-800 flex-1 text-right">
              {selectedService?.name}
            </Text>
          </View>
          
          {/* Chỉ hiển thị thông tin bác sĩ nếu không phải dịch vụ tư vấn */}
          {serviceDetails?.type !== 'CONSULT' && (
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600">Bác sĩ:</Text>
              <Text className="text-sm font-medium text-gray-800 flex-1 text-right">
                {selectedDoctor?.user?.name}
              </Text>
            </View>
          )}
          
          {serviceDetails?.type === 'CONSULT' && (
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600">Loại:</Text>
              <Text className="text-sm font-medium text-blue-600 flex-1 text-right">
                Tư vấn trực tuyến
              </Text>
            </View>
          )}
          
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-600">Ngày khám:</Text>
            <Text className="text-sm font-medium text-gray-800 flex-1 text-right">
              {(() => {
                // Parse selectedDate (YYYY-MM-DD) để tránh timezone issues
                const [year, month, day] = selectedDate.split('-').map(Number);
                const date = new Date(year, month - 1, day);
                return date.toLocaleDateString('vi-VN');
              })()}
            </Text>
          </View>
          
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-600">Giờ khám:</Text>
            <Text className="text-sm font-medium text-gray-800 flex-1 text-right">
              {selectedTimeSlot?.display}
            </Text>
          </View>
          
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-600">Giá dịch vụ:</Text>
            <Text className="text-sm font-medium text-green-600 flex-1 text-right">
              {serviceDetails?.price}₫
            </Text>
          </View>
        </View>
      </View>

      {/* Ghi chú */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-800 mb-2">
          Ghi chú (không bắt buộc):
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 text-sm text-gray-800 min-h-[80px]"
          placeholder="Nhập ghi chú về triệu chứng, yêu cầu đặc biệt..."
          value={note}
          onChangeText={setNote}
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* Lưu ý */}
      <View className="bg-blue-50 rounded-lg p-3">
        <View className="flex-row items-center mb-2">
          <Ionicons name="information-circle" size={16} color="#3B82F6" />
          <Text className="text-sm font-medium text-blue-800 ml-2">
            Lưu ý quan trọng:
          </Text>
        </View>
        <Text className="text-xs text-blue-700 leading-4">
          • Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục{'\n'}
          • Mang theo giấy tờ tùy thân và thẻ bảo hiểm y tế (nếu có){'\n'}
          • Liên hệ hotline để thay đổi lịch hẹn trước 24h
        </Text>
      </View>
    </View>
  );

  const renderServiceSelection = () => (
    <View className="bg-white mx-4 mb-4 rounded-xl p-4 shadow-sm">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Ionicons name="medical" size={20} color="#8B5CF6" />
          <Text className="text-lg font-semibold text-gray-800 ml-2">
            Chọn dịch vụ
          </Text>
          <Text className="text-red-500 ml-1">*</Text>
        </View>
      </View>

      <TouchableOpacity 
        className="border border-gray-300 rounded-lg p-3 flex-row items-center justify-between"
        onPress={() => setShowServiceModal(true)}
      >
        {selectedService ? (
          <View className="flex-row items-center flex-1">
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <View className="ml-2 flex-1">
              <Text className="text-sm font-medium text-gray-800">
                {selectedService.name}
              </Text>
              <Text className="text-xs text-green-600">Đang hoạt động</Text>
            </View>
          </View>
        ) : (
          <Text className="text-gray-500">Chọn dịch vụ khám bệnh</Text>
        )}
        <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      {/* Service Details */}
      {serviceDetails && (
        <View className="mt-4 p-3 bg-green-50 rounded-lg">
          <View className="flex-row items-center mb-2">
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text className="text-sm font-bold text-gray-800 ml-2">
              {serviceDetails.name}
            </Text>
          </View>
          
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-xs text-gray-600">Xét nghiệm</Text>
              <Text className="text-xs font-medium">
                Giá: {serviceDetails.price}₫
              </Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-xs text-gray-600">Thời gian:</Text>
              <Text className="text-xs font-medium">
                {serviceDetails.startTime} - {serviceDetails.endTime}
              </Text>
            </View>
          </View>
          
          <Text className="text-xs text-gray-600 mt-2">
            {serviceDetails.description}
          </Text>
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
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-96">
          <View className="p-4 border-b border-gray-200">
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-bold text-gray-800">
                Chọn dịch vụ
              </Text>
              <TouchableOpacity onPress={() => setShowServiceModal(false)}>
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView className="p-4">
            {services.map((service, index) => (
              <TouchableOpacity
                key={service.id}
                className="p-3 border border-gray-200 rounded-lg mb-3 flex-row items-center"
                onPress={() => handleSelectService(service)}
              >
                <Ionicons name="medical" size={20} color="#8B5CF6" />
                <View className="ml-3 flex-1">
                  <Text className="text-sm font-medium text-gray-800">
                    {service.name}
                  </Text>
                  <Text className="text-xs text-gray-600">
                    {service.description}
                  </Text>
                  <Text className="text-xs text-blue-600 font-medium">
                    Giá: {service.price}₫
                  </Text>
                </View>
                {selectedService?.id === service.id && (
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                )}
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
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl max-h-96">
            <View className="p-4 border-b border-gray-200">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-gray-800">
                  Chọn bác sĩ
                </Text>
                <TouchableOpacity onPress={() => setShowDoctorModal(false)}>
                  <Ionicons name="close" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>
            
            <ScrollView className="p-4">
              {doctors.map((doctor, index) => (
                <TouchableOpacity
                  key={doctor.id}
                  className="p-3 border border-gray-200 rounded-lg mb-3 flex-row items-center"
                  onPress={() => handleSelectDoctor(doctor)}
                >
                  <View className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Ionicons name="person" size={24} color="#8B5CF6" />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-sm font-medium text-gray-800">
                      {doctor.user?.name || 'Tên bác sĩ'}
                    </Text>
                    <Text className="text-xs text-gray-600">
                      {doctor.user?.email || 'Email không có'}
                    </Text>
                    <Text className="text-xs text-blue-600 font-medium">
                      Chuyên khoa: {doctor.specialization || 'Đa khoa'}
                    </Text>
                  </View>
                  {selectedDoctor?.id === doctor.id && (
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  )}
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
      <View className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-6 pt-12">
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
        <View className="px-4 pb-6">
          {currentStep > 1 && (
            <TouchableOpacity 
              className="py-4 rounded-lg flex-row items-center justify-center bg-gray-300 mb-3"
              onPress={handleBack}
            >
              <Ionicons name="arrow-back" size={20} color="#374151" />
              <Text className="font-semibold ml-2 text-gray-700">
                Quay lại
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            className={`py-4 rounded-lg flex-row items-center justify-center ${
              (currentStep === 1 && selectedService) || 
              (currentStep === 2 && selectedDate && selectedTimeSlot && (serviceDetails?.type === 'CONSULT' || selectedDoctor)) ||
              currentStep === 3
                ? 'bg-purple-500' : 'bg-gray-300'
            }`}
            onPress={handleNext}
            disabled={
              (currentStep === 1 && !selectedService) ||
              (currentStep === 2 && (!selectedDate || !selectedTimeSlot || (serviceDetails?.type !== 'CONSULT' && !selectedDoctor)))
            }
          >
            <Text className={`font-semibold mr-2 ${
              (currentStep === 1 && selectedService) || 
              (currentStep === 2 && selectedDate && selectedTimeSlot && (serviceDetails?.type === 'CONSULT' || selectedDoctor)) ||
              currentStep === 3
                ? 'text-white' : 'text-gray-500'
            }`}>
              {currentStep === 1 ? 'Tiếp tục' : currentStep === 2 ? 'Xác nhận' : 'Đặt lịch hẹn'}
            </Text>
            <Ionicons 
              name="arrow-forward" 
              size={20} 
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