// Sample data for development purposes
export const samplePrescription = {
  "id": 10,
  "patientId": 17,
  "protocolId": 3,
  "doctorId": 2,
  "customMedications": {
    "additionalMeds": [
      { "name": "Vitamin D", "dosage": "1000 IU daily" }
    ]
  },
  "notes": "Patient responds well to treatment",
  "startDate": "2025-06-03T00:00:00.000Z",
  "endDate": "2025-06-30T23:59:59.000Z",
  "createdById": 1,
  "total": 1500,
  "createdAt": "2025-06-18T15:51:52.365Z",
  "updatedAt": "2025-06-18T15:51:52.365Z",
  "patient": {
    "id": 17,
    "name": "Quang Huy",
    "email": "cuccucthanki@gmail.com"
  },
  "doctor": {
    "id": 2,
    "userId": 3,
    "specialization": "Internal Medicine",
    "certifications": ["MD", "Internal Medicine Board Certified"],
    "isAvailable": true,
    "createdAt": "2025-06-15T14:34:10.466Z",
    "updatedAt": "2025-06-15T14:34:10.466Z",
    "user": {
      "id": 3,
      "name": "Dr. Michael Brown",
      "email": "doctor3@example.com"
    }
  },
  "protocol": {
    "id": 3,
    "name": "HIV Treatment Protocol A",
    "description": "Standard HIV treatment protocol for newly diagnosed patients",
    "targetDisease": "HIV",
    "createdById": 1,
    "updatedById": 1,
    "createdAt": "2025-06-18T14:14:18.338Z",
    "updatedAt": "2025-06-18T14:14:18.338Z",
    "medicines": [
      {
        "id": 3,
        "protocolId": 3,
        "medicineId": 1,
        "dosage": "600mg once daily",
        "duration": "MORNING",
        "notes": "Take with food",
        "createdAt": "2025-06-18T14:14:18.338Z",
        "updatedAt": "2025-06-18T14:14:18.338Z",
        "medicine": {
          "id": 1,
          "name": "Efavirenz",
          "description": "Antiretroviral medication for HIV treatment",
          "unit": "mg",
          "dose": "600mg",
          "price": "25.5",
          "createdAt": "2025-06-18T14:09:28.967Z",
          "updatedAt": "2025-06-18T14:09:28.967Z"
        }
      },
       {
              "id": 8,
              "protocolId": 5,
              "medicineId": 2,
              "dosage": "300mg once daily",
              "duration": "MORNING",
              "notes": "Take with food",
              "createdAt": "2025-06-18T14:16:48.765Z",
              "updatedAt": "2025-06-18T14:16:48.765Z",
              "medicine": {
                "id": 2,
                "name": "Lamivudine",
                "description": "Ức chế sự nhân lên của virus HIV",
                "unit": "mg",
                "dose": "300mg",
                "price": "10",
                "createdAt": "2025-06-18T14:12:19.479Z",
                "updatedAt": "2025-06-18T14:12:19.479Z"
              }
            }
    ]
  },
  "createdBy": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com"
  }
};
