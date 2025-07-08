import { Stack } from "expo-router";

const DoctorLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Doctor Dashboard' }} />
      <Stack.Screen name="appointment" options={{ title: 'Appointments' }} />
      <Stack.Screen name="schedule" options={{ title: 'Schedule' }} />
    </Stack>
  );
};

export default DoctorLayout;
