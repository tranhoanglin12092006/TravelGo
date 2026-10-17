import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import PrimaryButton from './PrimaryButton';

const EmptyState = ({ icon = 'folder-open-outline', title, message, actionLabel, onAction }) => {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
        <Ionicons name={icon} size={36} color={COLORS.textLight} />
      </View>
      <Text className="text-lg font-bold text-[#20233A] text-center mb-2">
        {title}
      </Text>
      {message && (
        <Text className="text-sm text-gray-500 text-center mb-6">
          {message}
        </Text>
      )}
      {actionLabel && onAction && (
        <PrimaryButton title={actionLabel} onPress={onAction} />
      )}
    </View>
  );
};

export default EmptyState;
