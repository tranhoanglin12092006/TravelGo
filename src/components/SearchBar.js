import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const SearchBar = ({ value, onChangeText, placeholder = 'Tìm kiếm địa điểm...' }) => {
  return (
    <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-3 mx-4">
      <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} />
      <TextInput
        className="flex-1 ml-3 text-base text-gray-800"
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        accessibilityLabel="Thanh tìm kiếm địa điểm"
      />
      {value?.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          accessibilityLabel="Xóa tìm kiếm"
        >
          <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
