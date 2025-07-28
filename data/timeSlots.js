export const slots = [
  { start: "07:00", end: "07:30" },
  { start: "07:35", end: "08:05" },
  { start: "08:10", end: "08:40" },
  { start: "08:45", end: "09:15" },
  { start: "09:20", end: "09:50" },
  { start: "09:55", end: "10:25" },
  { start: "10:30", end: "11:00" },
  { start: "13:00", end: "13:30" },
  { start: "13:35", end: "14:05" },
  { start: "14:10", end: "14:40" },
  { start: "14:45", end: "15:15" },
  { start: "15:20", end: "15:50" },
  { start: "15:55", end: "16:25" },
  { start: "16:30", end: "17:00" },
];

// Phân loại slots theo ca
export const getMorningSlots = () => {
  return slots.filter(slot => {
    const hour = parseInt(slot.start.split(':')[0]);
    return hour >= 7 && hour < 12;
  });
};

export const getAfternoonSlots = () => {
  return slots.filter(slot => {
    const hour = parseInt(slot.start.split(':')[0]);
    return hour >= 13 && hour < 18;
  });
};

export const getSlotsByShift = (shift) => {
  if (shift === 'MORNING') {
    return getMorningSlots();
  } else if (shift === 'AFTERNOON') {
    return getAfternoonSlots();
  }
  return slots;
};
