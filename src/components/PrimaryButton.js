import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PrimaryButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  icon,
  className: extraClass = '',
}) => {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center py-4 rounded-2xl ${
        isPrimary ? 'bg-[#6258E8]' : 'border-2 border-[#6258E8] bg-white'
      } ${disabled || loading ? 'opacity-50' : ''} ${extraClass}`}
      accessibilityLabel={title}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : '#6258E8'} />
      ) : (
        <View className="flex-row items-center">
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={isPrimary ? '#FFFFFF' : '#6258E8'}
              style={{ marginRight: 8 }}
            />
          )}
          <Text
            className={`text-base font-semibold ${
              isPrimary ? 'text-white' : 'text-[#6258E8]'
            }`}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton;
