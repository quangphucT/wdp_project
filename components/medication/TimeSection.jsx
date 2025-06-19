import React from 'react';
import { Text } from 'react-native';
import MedicationItem from './MedicationItem';

const TimeSection = React.memo(({ title, emoji, medications, timeOfDay, onToggleTaken }) => {
    if (!medications || medications.length === 0) return null;

    return (
        <>
            <Text className="text-lg font-semibold mb-2">{emoji} {title}</Text>
            {medications.map((med, index) => (
                <MedicationItem
                    key={`${timeOfDay}-${index}`}
                    medication={med}
                    timeOfDay={timeOfDay}
                    onToggleTaken={onToggleTaken}
                />
            ))}
        </>
    );
});

TimeSection.displayName = 'TimeSection';

export default TimeSection;
