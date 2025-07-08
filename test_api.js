// Test script để kiểm tra API với date filters
import getAppointmentDoctor from './services/doctor/getAppointmentDoctor';

// Test các scenarios khác nhau
const testAPI = async () => {
  const doctorId = 2; // Thay đổi theo doctor ID thực tế
  
  console.log('=== Testing API Endpoints ===');
  
  try {
    // Test 1: Không có filter
    console.log('\n1. Fetch tất cả appointments:');
    const allAppointments = await getAppointmentDoctor.getAppointmentDoctor(doctorId);
    console.log('Response:', allAppointments.data);
    
    // Test 2: Filter theo date range
    console.log('\n2. Fetch appointments từ 2025-07-10 đến 2025-07-11:');
    const filteredAppointments = await getAppointmentDoctor.getAppointmentDoctor(doctorId, {
      dateFrom: '2025-07-10',
      dateTo: '2025-07-11'
    });
    console.log('Response:', filteredAppointments.data);
    
    // Test 3: Filter chỉ dateFrom
    console.log('\n3. Fetch appointments từ 2025-07-10:');
    const fromDateAppointments = await getAppointmentDoctor.getAppointmentDoctor(doctorId, {
      dateFrom: '2025-07-10'
    });
    console.log('Response:', fromDateAppointments.data);
    
    // Test 4: Filter với status
    console.log('\n4. Fetch appointments với status PENDING:');
    const pendingAppointments = await getAppointmentDoctor.getAppointmentDoctor(doctorId, {
      status: 'PENDING'
    });
    console.log('Response:', pendingAppointments.data);
    
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
  }
};

// Uncomment để test
// testAPI();
