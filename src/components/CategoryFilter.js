import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ flexGrow: 0, height: 48 }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        alignItems: 'center',
      }}
    >
      {categories.map((cat) => {
        const isActive = selectedCategory === cat.id;
        return (
          <TouchableOpacity
            key={`cat-chip-${cat.id}`}
            onPress={() => onSelectCategory(cat.id)}
            activeOpacity={0.8}
            style={{
              height: 38,
              paddingHorizontal: 16,
              borderRadius: 9999,
              marginRight: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isActive ? COLORS.primary : '#F3F4F6',
            }}
            accessibilityLabel={`Danh mục ${cat.label}`}
            accessibilityState={{ selected: isActive }}
          >
            <Ionicons
              name={cat.icon}
              size={16}
              color={isActive ? '#FFFFFF' : COLORS.textSecondary}
            />
            <Text
              style={{
                marginLeft: 6,
                fontSize: 12,
                fontWeight: '700',
                color: isActive ? '#FFFFFF' : '#374151',
              }}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default CategoryFilter;
