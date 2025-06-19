import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useMedicationTrackingStore = create(
  persist(
    (set, get) => ({
      days: [],
      currentPrescriptionId: null,
      isLoading: false,
      error: null,        initializeDays: (startDate, endDate, prescriptionId, medications) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('Initializing days with:', { startDate, endDate, prescriptionId });
          
          const start = new Date(startDate);
          const end = new Date(endDate);
          const days = [];
          
          // Get current date at midnight for comparison
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          console.log('Today date:', today.toISOString());
          
          const currentDate = new Date(start);
          
          while (currentDate <= end) {
            const dayOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][currentDate.getDay()];
            const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
            
            // Determine status based on current date
            let status = 'pending';
            
            const currentDateMidnight = new Date(currentDate);
            currentDateMidnight.setHours(0, 0, 0, 0);
            
            if (currentDateMidnight < today) {
              status = 'missed'; // Days in the past are considered missed by default
            } else if (currentDateMidnight.getTime() === today.getTime()) {
              status = 'today'; // Mark today specially
              console.log('Today detected:', currentDate.toISOString());
            }
            
            // Process medications for this day
            const morningMeds = [];
            const afternoonMeds = [];
            const eveningMeds = [];
            
            // Add protocol medicines
            if (medications.protocol && medications.protocol.medicines) {
              medications.protocol.medicines.forEach((med) => {
                const medicineInfo = {
                  id: med.id || `med-${Math.random()}`,
                  name: med.medicine.name,
                  dosage: med.dosage,
                  notes: med.notes,
                  taken: false
                };
                
                if (med.duration === "MORNING") {
                  morningMeds.push(medicineInfo);
                } else if (med.duration === "AFTERNOON") {
                  afternoonMeds.push(medicineInfo);
                } else if (med.duration === "EVENING") {
                  eveningMeds.push(medicineInfo);
                }
              });
            }
            
            // Add custom medications
            if (medications.customMedications && medications.customMedications.additionalMeds) {
              medications.customMedications.additionalMeds.forEach((med, index) => {
                morningMeds.push({
                  id: `custom-${index}`,
                  name: med.name,
                  dosage: med.dosage,
                  notes: "Custom medication",
                  taken: false
                });
              });
            }
            
            days.push({
              date: new Date(currentDate).toISOString(),
              label: dayOfWeek,
              displayDate: formattedDate,
              status,
              medications: {
                morning: morningMeds,
                afternoon: afternoonMeds,
                evening: eveningMeds
              }
            });
              currentDate.setDate(currentDate.getDate() + 1);
          }
          
          console.log('Generated days array:', days.length, 'days');
          days.forEach((day, idx) => {
            if (idx < 3 || idx > days.length - 3) {
              console.log(`Day ${idx}:`, day.label, day.displayDate, day.status);
            }
          });
          
          set({ 
            days, 
            currentPrescriptionId: prescriptionId,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error initializing days',
            isLoading: false 
          });
        }
      },
      
      updateMedicationStatus: (date, timeOfDay, medicationId, taken) => {
        set((state) => {
          const newDays = [...state.days];
          const dayIndex = newDays.findIndex(day => day.date === date);
          
          if (dayIndex !== -1) {
            const medications = newDays[dayIndex].medications[timeOfDay];
            const medIndex = medications.findIndex(med => med.id === medicationId);
            
            if (medIndex !== -1) {
              medications[medIndex].taken = taken;
              
              // Check if all medications for the day are taken
              const allTaken = ['morning', 'afternoon', 'evening'].every(time => {
                return newDays[dayIndex].medications[time]
                  .every(med => med.taken);
              });
              
              if (allTaken) {
                newDays[dayIndex].status = 'taken';
              }
            }
          }
          
          return { days: newDays };
        });
      },
      
      updateDayStatus: (date, status) => {
        set((state) => {
          const newDays = [...state.days];
          const dayIndex = newDays.findIndex(day => day.date === date);
          
          if (dayIndex !== -1) {
            newDays[dayIndex].status = status;
          }
          
          return { days: newDays };
        });
      },
      
      markAllMedicationsTaken: (date) => {
        set((state) => {
          const newDays = [...state.days];
          const dayIndex = newDays.findIndex(day => day.date === date);
          
          if (dayIndex !== -1) {
            ['morning', 'afternoon', 'evening'].forEach(time => {
              newDays[dayIndex].medications[time]
                .forEach(med => {
                  med.taken = true;
                });
            });
            
            newDays[dayIndex].status = 'taken';
          }
          
          return { days: newDays };
        });
      },
      
      markAllMedicationsMissed: (date) => {
        set((state) => {
          const newDays = [...state.days];
          const dayIndex = newDays.findIndex(day => day.date === date);
          
          if (dayIndex !== -1) {
            newDays[dayIndex].status = 'missed';
          }
          
          return { days: newDays };
        });
      },
      
      getMedicationsForDate: (date) => {
        return get().days.find(day => day.date === date);
      }
    }),
    {
      name: 'medication-tracking-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
