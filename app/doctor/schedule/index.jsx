
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import getScheduleDoctorAll from "../../../services/doctor/getScheduleDoctor";
import useAuthStore from "../../../stores/authStore";

const WeeklySchedule = () => {
  const router = useRouter();
  const [currentWeek, setCurrentWeek] = useState(0); // 0 = tuần hiện tại, -1 = tuần trước, 1 = tuần sau
  const [scheduleData, setScheduleData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  // Fetch schedule data from API
  const fetchScheduleData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const response = await getScheduleDoctorAll.getScheduleDoctorAll(user.id);
      setScheduleData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu lịch làm việc");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchScheduleData();
  }, [fetchScheduleData, currentWeek]);

  // Process API data to fit the week view
  const getWeekData = (weekOffset) => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7)));
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      // Find schedule data for this date
      const daySchedules = scheduleData.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate.toDateString() === date.toDateString();
      });
      
      days.push({
        dayName: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'][i],
        date: date.getDate(),
        month: date.getMonth() + 1,
        fullDate: date,
        slots: generateTimeSlotsFromAPI(daySchedules)
      });
    }
    return days;
  };

  const generateTimeSlotsFromAPI = (daySchedules) => {
    const slots = [];
    
    daySchedules.forEach(schedule => {
      if (schedule.isOff) {
        // If doctor is off, show off slot
        slots.push({
          time: "Cả ngày",
          type: "off",
          patient: null,
          reason: "Nghỉ phép",
          scheduleId: schedule.id
        });
      } else {
        // Add shift slots based on API data
        if (schedule.shift === "MORNING") {
          slots.push({
            time: "07:00-11:00",
            type: "working",
            patient: null,
            reason: "Ca sáng",
            scheduleId: schedule.id
          });
        }
        
        if (schedule.shift === "AFTERNOON") {
          slots.push({
            time: "13:00-17:00",
            type: "working",
            patient: null,
            reason: "Ca chiều",
            scheduleId: schedule.id
          });
        }
        
        // if (schedule.shift === "EVENING") {
        //   slots.push({
        //     time: "18:00-22:00",
        //     type: "working",
        //     patient: null,
        //     reason: "Ca tối",
        //     scheduleId: schedule.id
        //   });
        // }
      }
    });
    
    return slots;
  };

  const getSlotColor = (type) => {
    switch (type) {
      case 'working': return 'bg-green-100 border-green-300';
      case 'off': return 'bg-red-100 border-red-300';
      case 'appointment': return 'bg-blue-100 border-blue-300';
      case 'meeting': return 'bg-yellow-100 border-yellow-300';
      case 'surgery': return 'bg-purple-100 border-purple-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getSlotTextColor = (type) => {
    switch (type) {
      case 'working': return 'text-green-700';
      case 'off': return 'text-red-700';
      case 'appointment': return 'text-blue-700';
      case 'meeting': return 'text-yellow-700';
      case 'surgery': return 'text-purple-700';
      default: return 'text-gray-700';
    }
  };

  const weekData = getWeekData(currentWeek);
  const weekStart = weekData[0]?.fullDate;
  const weekEnd = weekData[6]?.fullDate;

  if (isLoading) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Đang tải lịch làm việc...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 pt-12 pb-4">
        <View className="flex-row items-center justify-between px-4 mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-blue-500 text-lg">← Quay lại</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-800">Lịch làm việc</Text>
          <View style={{ width: 80 }} />
        </View>

        {/* Week Navigation */}
        <View className="flex-row items-center justify-between px-4">
          <TouchableOpacity 
            className="p-2 rounded-lg bg-gray-100"
            onPress={() => setCurrentWeek(currentWeek - 1)}
          >
            <Text className="text-gray-600">‹ Tuần trước</Text>
          </TouchableOpacity>
          
          <View className="items-center">
            <Text className="font-bold text-gray-800">
              {weekStart?.getDate()}/{weekStart?.getMonth() + 1} - {weekEnd?.getDate()}/{weekEnd?.getMonth() + 1}
            </Text>
            <Text className="text-sm text-gray-500">
              {currentWeek === 0 ? 'Tuần hiện tại' : currentWeek > 0 ? `+${currentWeek} tuần` : `${currentWeek} tuần`}
            </Text>
          </View>
          
          <TouchableOpacity 
            className="p-2 rounded-lg bg-gray-100"
            onPress={() => setCurrentWeek(currentWeek + 1)}
          >
            <Text className="text-gray-600">Tuần sau ›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Schedule Grid */}
      <ScrollView className="flex-1" horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-1" style={{ minWidth: 900 }}>
          {/* Days Header */}
          <View className="flex-row bg-white border-b border-gray-200">
            <View className="w-20 p-3 border-r border-gray-200">
              <Text className="text-xs font-semibold text-gray-600">Giờ</Text>
            </View>
            {weekData.map((day, index) => (
              <View key={index} className="flex-1 p-3 border-r border-gray-200 min-w-[120px]">
                <Text className="text-sm font-semibold text-gray-800">{day.dayName}</Text>
                <Text className="text-xs text-gray-500">{day.date}/{day.month}</Text>
              </View>
            ))}
          </View>

          {/* Schedule Content */}
          <ScrollView className="flex-1">
            <View className="flex-row">
              {/* Time Column */}
              <View className="w-20 border-r border-gray-200">
                {Array.from({ length: 12 }, (_, i) => (
                  <View key={i} className="h-16 border-b border-gray-100 p-1 justify-center">
                    <Text className="text-xs text-gray-500">
                      {String(7 + i).padStart(2, '0')}:00
                    </Text>
                  </View>
                ))}
              </View>

              {/* Days Columns */}
              {weekData.map((day, dayIndex) => (
                <View key={dayIndex} className="flex-1 border-r border-gray-200 min-w-[120px]">
                  {/* Time slots background */}
                  {Array.from({ length: 12 }, (_, i) => (
                    <View key={i} className="h-16 border-b border-gray-100" />
                  ))}
                  
                  {/* Schedule items overlay */}
                  <View className="absolute top-0 left-0 right-0">
                    {day.slots.map((slot, slotIndex) => {
                      const [startTime] = slot.time.split('-');
                      const [hours, minutes] = startTime.split(':').map(Number);
                      const topPosition = ((hours - 7) * 64) + (minutes / 60 * 64);
                      
                      return (
                        <TouchableOpacity
                          key={slotIndex}
                          className={`mx-1 p-2 rounded border-l-4 ${getSlotColor(slot.type)}`}
                          style={{ 
                            position: 'absolute',
                            top: topPosition,
                            left: 2,
                            right: 2,
                            minHeight: 48
                          }}
                          onPress={() => {
                            if (slot.type === 'appointment') {
                              // Navigate to appointment details
                              router.push(`/doctor/appointment/detail?patient=${slot.patient}`);
                            }
                          }}
                        >
                          <Text className={`text-xs font-semibold ${getSlotTextColor(slot.type)}`}>
                            {slot.time}
                          </Text>
                          <Text className={`text-xs ${getSlotTextColor(slot.type)}`} numberOfLines={2}>
                            {slot.patient || slot.reason}
                          </Text>
                          {slot.patient && (
                            <Text className={`text-xs ${getSlotTextColor(slot.type)}`} numberOfLines={1}>
                              {slot.reason}
                            </Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Legend */}
      <View className="bg-white border-t border-gray-200 p-4">
        <Text className="text-sm font-semibold text-gray-800 mb-2">Chú thích:</Text>
        <View className="flex-row flex-wrap">
          <View className="flex-row items-center mr-4 mb-2">
            <View className="w-3 h-3 bg-green-100 border-l-4 border-green-300 mr-2" />
            <Text className="text-xs text-gray-600">Ca làm việc</Text>
          </View>
          {/* <View className="flex-row items-center mr-4 mb-2">
            <View className="w-3 h-3 bg-red-100 border-l-4 border-red-300 mr-2" />
            <Text className="text-xs text-gray-600">Nghỉ phép</Text>
          </View>
          <View className="flex-row items-center mr-4 mb-2">
            <View className="w-3 h-3 bg-blue-100 border-l-4 border-blue-300 mr-2" />
            <Text className="text-xs text-gray-600">Cuộc hẹn</Text>
          </View>
          <View className="flex-row items-center mr-4 mb-2">
            <View className="w-3 h-3 bg-yellow-100 border-l-4 border-yellow-300 mr-2" />
            <Text className="text-xs text-gray-600">Họp</Text>
          </View> */}
        </View>
      </View>
    </View>
  );
};

export default WeeklySchedule;
