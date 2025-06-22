import { Text, View } from 'react-native';

const EmptyState = () => {
    return (
        <View className="flex-1 justify-center items-center p-5">
            <Text className="text-gray-600 text-center">Không có dữ liệu lịch uống thuốc</Text>
        </View>
    );
};

export default EmptyState;
