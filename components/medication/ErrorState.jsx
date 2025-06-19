import { Text, View } from 'react-native';

const ErrorState = ({ error }) => {
    return (
        <View className="flex-1 justify-center items-center p-5">
            <Text className="text-red-500 text-base text-center">Lỗi: {error}</Text>
        </View>
    );
};

export default ErrorState;
