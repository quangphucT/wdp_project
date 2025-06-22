import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const MedicationItem = React.memo(({ medication, timeOfDay, onToggleTaken }) => {
    const getEmojiForTime = () => {
        if (timeOfDay === 'morning') return '🔵';
        if (timeOfDay === 'afternoon') return '🟠';
        return '🟣';
    };

    return (
        <View className="bg-gray-50 p-3 rounded-xl mb-2.5 shadow-sm">
            <View className="flex-row justify-between items-center mb-1">
                <Text className="text-base font-semibold">{getEmojiForTime()} {medication.name}</Text>
                <TouchableOpacity
                    className={`py-1.5 px-3 rounded-full border ${medication.taken ? 'bg-green-500 border-green-500' : 'bg-green-50 border-green-500'}`}
                    onPress={() => onToggleTaken(medication.id, !medication.taken)}
                >
                    <Text className={`font-medium text-sm ${medication.taken ? 'text-white' : 'text-green-500'}`}>
                        {medication.taken ? 'Đã uống' : 'Chưa uống'}
                    </Text>
                </TouchableOpacity>
            </View>
            <Text className="text-sm text-gray-700">Liều lượng: {medication.dosage}</Text>
            <Text className="text-xs text-gray-500 italic">* {medication.notes}</Text>
        </View>
    );
});

MedicationItem.displayName = 'MedicationItem';

export default MedicationItem;
