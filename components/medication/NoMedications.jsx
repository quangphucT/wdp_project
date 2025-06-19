import { Text, View } from 'react-native';

const NoMedications = () => {
    return (
        <View className="bg-gray-100 p-5 rounded-xl items-center mt-2.5">
            <Text className="text-sm text-gray-500 text-center">Không có thuốc nào cần uống trong ngày này</Text>
        </View>
    );
};

export default NoMedications;
