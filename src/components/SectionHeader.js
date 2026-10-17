import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';

const SectionHeader = ({ title, onSeeAll }) => {
  return (
    <View className="flex-row items-center justify-between px-4 mb-3 mt-5">
      <Text className="text-lg font-bold text-[#20233A]">{title}</Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} accessibilityLabel={`Xem tất cả ${title}`}>
          <Text className="text-sm font-medium text-[#6258E8]">Xem tất cả</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader;
