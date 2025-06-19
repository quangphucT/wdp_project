import { Text, TouchableOpacity, View } from 'react-native';

const ActionButtons = ({ onMarkAllTaken, onMarkAllMissed }) => {
    return (
        <View className="flex-row justify-between mb-4">
            <TouchableOpacity
                className="flex-1 p-2.5 rounded-lg mx-1 bg-green-500 items-center"
                onPress={onMarkAllTaken}
            >
                <Text className="text-white font-medium text-sm">Đánh dấu tất cả đã uống</Text>
            </TouchableOpacity>

        </View>
    );
};

export default ActionButtons;
