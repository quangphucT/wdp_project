import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { samplePrescription } from '../../data/sampleData';

const Schedule = () => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [days, setDays] = useState([]);
  const [medications, setMedications] = useState({
    MORNING: [],
    AFTERNOON: [],
    EVENING: []
  });
  const [selectedDate, setSelectedDate] = useState(null);

  // Function to format the date as DD/MM
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  };

  // Function to get Vietnamese day of week label
  const getVietnameseDayLabel = (dayOfWeek) => {
    const labels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return labels[dayOfWeek];
  };

  // Generate days between start and end date (up to 7 days for display)
  useEffect(() => {
    // Check if prescription exists and has valid dates
    if (!samplePrescription || !samplePrescription.startDate || !samplePrescription.endDate) {
      setDays([]);
      return;
    }

    const startDate = new Date(samplePrescription.startDate);
    const endDate = new Date(samplePrescription.endDate);
    const currentDate = new Date(); // Today's date

    // Use the current date as reference, or start date if it's in the future
    const referenceDate = currentDate > startDate ? currentDate : startDate;

    const daysList = [];
    const maxDays = 7; // Show maximum 7 days

    for (let i = 0; i < maxDays; i++) {
      const date = new Date(referenceDate);
      date.setDate(date.getDate() + i);

      // Stop if we exceed the end date
      if (date > endDate) break;

      daysList.push({
        label: getVietnameseDayLabel(date.getDay()),
        date: formatDate(date),
        fullDate: date
      });
    }

    setDays(daysList);

    // Set the default selected date
    if (daysList.length > 0) {
      setSelectedDate(daysList[0].fullDate);
    }
  }, []);

  // Extract medications from the prescription
  useEffect(() => {
    if (!selectedDate) return;

    // Check if prescription exists
    if (!samplePrescription || !samplePrescription.protocol?.medicines) {
      setMedications({
        MORNING: [],
        AFTERNOON: [],
        EVENING: []
      });
      return;
    }

    const protocolMedicines = samplePrescription.protocol.medicines;
    const customMeds = samplePrescription.customMedications?.additionalMeds || [];

    // Group medicines by time of day
    const groupedMeds = {
      MORNING: [],
      AFTERNOON: [],
      EVENING: []
    };

    // Check if the selected date is within the prescription period
    const prescriptionStartDate = new Date(samplePrescription.startDate);
    const prescriptionEndDate = new Date(samplePrescription.endDate);

    if (selectedDate >= prescriptionStartDate && selectedDate <= prescriptionEndDate) {
      // Process protocol medicines
      protocolMedicines.forEach(med => {
        const { medicine, dosage, duration, notes } = med;
        if (duration && groupedMeds[duration]) {
          groupedMeds[duration].push({
            name: medicine.name,
            dosage,
            notes,
            color: getColorForMedication(medicine.name)
          });
        }
      });

      // Process custom medications (assuming they're for morning)
      customMeds.forEach(med => {
        groupedMeds.MORNING.push({
          name: med.name,
          dosage: med.dosage,
          notes: '',
          color: getColorForMedication(med.name)
        });
      });
    }

    setMedications(groupedMeds);
  }, [selectedDate]);

  // Helper to assign a consistent color based on medication name
  const getColorForMedication = (name) => {
    const colors = ['🔵', '🟢', '🟠', '🟣', '🔴', '⚪'];
    // Simple hash function to get a consistent color for the same medicine
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // Helper to determine if the medication was taken for the selected date
  const isMedicationTaken = (timeOfDay) => {
    // For demonstration purposes, medications for today and past days
    // are considered taken if it's already past their time
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (!selectedDate) return false;

    // If the selected date is in the past, all medications are considered taken
    if (selectedDate < today) return true;

    // If it's today, check the time
    if (selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()) {

      if (timeOfDay === 'MORNING' && now.getHours() >= 7) return true;
      if (timeOfDay === 'AFTERNOON' && now.getHours() >= 12) return true;
      if (timeOfDay === 'EVENING' && now.getHours() >= 20) return true;
    }

    return false;
  };

  // Helper to get time display for a period
  const getTimeForPeriod = (period) => {
    switch (period) {
      case 'MORNING': return '07:00';
      case 'AFTERNOON': return '12:00';
      case 'EVENING': return '20:00';
      default: return '';
    }
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      {/* Header */}
      <View className="mb-3">
        <Text className="text-lg font-semibold">Xin chào, {samplePrescription?.patient?.name || "Bạn"}</Text>
        <Text className="text-sm text-gray-500">Chúc bạn một ngày tốt lành</Text>
      </View>

      {/* Title */}
      <View className="mt-2.5">
        <Text className="text-lg font-semibold text-[#1e1e1e]">Lịch uống thuốc</Text>
        <Text className="text-sm text-gray-500">
          {selectedDate && days.length > 0
            ? `Ngày ${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`
            : "Theo dõi chi tiết lịch dùng thuốc"}
        </Text>
      </View>

      {days.length === 0 ? (
        // No prescription view
        <View className="mt-10 items-center justify-center">
          <View className="bg-gray-100 p-6 rounded-xl w-full items-center">
            <Text className="text-gray-500 text-lg font-medium mb-2">Không có lịch điều trị</Text>
            <Text className="text-gray-400 text-center">Hiện bạn không có lịch điều trị nào. Vui lòng liên hệ bác sĩ để được tư vấn.</Text>
          </View>
        </View>
      ) : (
        // Show prescription if available
        <>
          {/* Date List */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3 flex-row">
            {days.map((day, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedDayIndex(index);
                  setSelectedDate(day.fullDate);
                }}
                className={`rounded-lg py-2.5 px-3.5 items-center mr-2 ${index === selectedDayIndex ? 'bg-[#4B39EF]' : 'bg-[#f1f1f1]'
                  }`}
              >
                <Text className={`text-sm font-semibold ${index === selectedDayIndex ? 'text-white' : 'text-[#333]'}`}>
                  {day.label}
                </Text>
                <Text className={`text-xs ${index === selectedDayIndex ? 'text-white' : 'text-[#666]'}`}>
                  {day.date}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Medication Schedule */}
          <View className="mt-5">
            {/* Morning Medications */}
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-base font-semibold">☀️ Buổi sáng ({getTimeForPeriod('MORNING')})</Text>
              {isMedicationTaken('MORNING') &&
                <View className="bg-green-100 px-2 py-1 rounded-full">
                  <Text className="text-green-700 text-xs font-medium">Đã uống</Text>
                </View>
              }
            </View>

            {medications.MORNING.length > 0 ? (
              medications.MORNING.map((med, index) => (
                <View key={`morning-${index}`}
                  className={`p-3 rounded-lg mb-2.5 ${isMedicationTaken('MORNING') ? 'bg-[#e6f7ed]' : 'bg-[#f6f7fb]'
                    }`}>
                  <Text className="text-[15px] font-semibold">{med.color} {med.name}</Text>
                  <Text className="text-[13px] text-[#444]">Liều lượng: {med.dosage}</Text>
                  {med.notes && <Text className="text-xs text-[#666] italic">* {med.notes}</Text>}
                </View>
              ))
            ) : (
              <View className="bg-[#f6f7fb] p-3 rounded-lg mb-2.5">
                <Text className="text-[15px] text-gray-500 italic">Không có thuốc vào buổi sáng</Text>
              </View>
            )}

            {/* Afternoon Medications */}
            <View className="flex-row items-center justify-between mb-2 mt-4">
              <Text className="text-base font-semibold">🧡 Buổi trưa ({getTimeForPeriod('AFTERNOON')})</Text>
              {isMedicationTaken('AFTERNOON') &&
                <View className="bg-green-100 px-2 py-1 rounded-full">
                  <Text className="text-green-700 text-xs font-medium">Đã uống</Text>
                </View>
              }
            </View>

            {medications.AFTERNOON.length > 0 ? (
              medications.AFTERNOON.map((med, index) => (
                <View key={`afternoon-${index}`}
                  className={`p-3 rounded-lg mb-2.5 ${isMedicationTaken('AFTERNOON') ? 'bg-[#e6f7ed]' : 'bg-[#f6f7fb]'
                    }`}>
                  <Text className="text-[15px] font-semibold">{med.color} {med.name}</Text>
                  <Text className="text-[13px] text-[#444]">Liều lượng: {med.dosage}</Text>
                  {med.notes && <Text className="text-xs text-[#666] italic">* {med.notes}</Text>}
                </View>
              ))
            ) : (
              <View className="bg-[#f6f7fb] p-3 rounded-lg mb-2.5">
                <Text className="text-[15px] text-gray-500 italic">Không có thuốc vào buổi trưa</Text>
              </View>
            )}

            {/* Evening Medications */}
            <View className="flex-row items-center justify-between mb-2 mt-4">
              <Text className="text-base font-semibold">🌙 Buổi tối ({getTimeForPeriod('EVENING')})</Text>
              {isMedicationTaken('EVENING') &&
                <View className="bg-green-100 px-2 py-1 rounded-full">
                  <Text className="text-green-700 text-xs font-medium">Đã uống</Text>
                </View>
              }
            </View>

            {medications.EVENING.length > 0 ? (
              medications.EVENING.map((med, index) => (
                <View key={`evening-${index}`}
                  className={`p-3 rounded-lg mb-2.5 ${isMedicationTaken('EVENING') ? 'bg-[#e6f7ed]' : 'bg-[#f6f7fb]'
                    }`}>
                  <Text className="text-[15px] font-semibold">{med.color} {med.name}</Text>
                  <Text className="text-[13px] text-[#444]">Liều lượng: {med.dosage}</Text>
                  {med.notes && <Text className="text-xs text-[#666] italic">* {med.notes}</Text>}
                </View>
              ))
            ) : (
              <View className="bg-[#f6f7fb] p-3 rounded-lg mb-2.5">
                <Text className="text-[15px] text-gray-500 italic">Không có thuốc vào buổi tối</Text>
              </View>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default Schedule;
