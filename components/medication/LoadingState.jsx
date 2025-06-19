import { Text, View } from 'react-native';

const LoadingState = () => {
    return (
        <View className="flex-1 justify-center items-center p-5">
            <Text className="text-gray-600">Đang tải dữ liệu...</Text>
        </View>
    );
};

export default LoadingState;
