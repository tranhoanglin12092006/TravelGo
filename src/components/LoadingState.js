import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { COLORS } from '../constants/theme';

const LoadingState = ({ message = 'Đang tải...' }) => {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text className="text-sm text-gray-500 mt-3">{message}</Text>
    </View>
  );
};

export default LoadingState;
