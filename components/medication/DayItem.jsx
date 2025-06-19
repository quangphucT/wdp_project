import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const DayItem = React.memo(({ day, index, selectedDayIndex, onPress }) => {
    // Calculate status color based on status
    const getBackgroundClass = () => {
        if (day.status === 'taken') return 'bg-green-500'; // Green for taken
        if (day.status === 'missed') return 'bg-red-500'; // Red for missed
        if (day.status === 'today') return index === selectedDayIndex ? 'bg-blue-600' : 'bg-yellow-400'; // Yellow for today, blue if selected
        return index === selectedDayIndex ? 'bg-blue-600' : 'bg-gray-100'; // Blue if selected, gray if not
    };

    const getTextClass = () => {
        if (day.status === 'taken' || day.status === 'missed' || (index === selectedDayIndex)) {
            return 'text-white';
        }
        if (day.status === 'today' && index !== selectedDayIndex) {
            return 'text-gray-800';
        }
        return 'text-gray-800';
    }; return (
        <TouchableOpacity
            className={`rounded-lg py-2.5 px-3.5 items-center mr-2 ${getBackgroundClass()}`}
            onPress={() => onPress(index)}
            style={{
                minWidth: 60,
                height: 70,
                margin: 4,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Text className={`font-semibold text-sm ${getTextClass()}`}>{day.label}</Text>
            <Text className={`text-xs ${getTextClass()}`}>{day.displayDate}</Text>
            {day.status === 'today' && (
                <Text className={`text-xs mt-1 font-bold ${index === selectedDayIndex ? 'text-white' : 'text-gray-800'}`}>Hôm nay</Text>
            )}
        </TouchableOpacity>
    );
});

DayItem.displayName = 'DayItem';

export default DayItem;
