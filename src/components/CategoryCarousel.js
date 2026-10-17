import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

/**
 * CategoryCarousel Component
 * -------------------------------------------------------------
 * Carousel danh mục du lịch (Biển đảo, Núi rừng, Nghỉ dưỡng, Văn hóa...).
 * Cho phép vuốt mượt mà dạng slider với snap-to-item và chọn danh mục.
 *
 * Thuộc tính kỹ thuật chính:
 * - `sliderWidth`: Chiều rộng toàn màn hình.
 * - `itemWidth`: Kích thước card danh mục (120px) nhỏ gọn vừa vặn.
 * - `activeSlideAlignment="start"`: Căn trái danh mục để vuốt tự nhiên.
 * - `inactiveSlideScale={1}` & `inactiveSlideOpacity={1}`: Giữ nguyên tỷ lệ các item.
 * - `enableSnap={true}`: Bắt vị trí snap khi người dùng dừng vuốt.
 */
const CategoryCarousel = ({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
  destinationCounts = {},
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const carouselRef = useRef(null);

  const sliderWidth = windowWidth;
  const itemWidth = 125;

  const handleCategoryPress = useCallback(
    (categoryId, index) => {
      if (onSelectCategory) {
        onSelectCategory(categoryId);
      }
      if (carouselRef.current) {
        carouselRef.current.snapToItem(index);
      }
    },
    [onSelectCategory]
  );

  const renderItem = ({ item, index }) => {
    const isSelected = selectedCategory === item.id;
    const count = destinationCounts[item.id] || 0;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => handleCategoryPress(item.id, index)}
        className={`px-3 py-3 rounded-2xl mx-1.5 items-center justify-center border ${
          isSelected
            ? 'bg-[#6258E8] border-[#6258E8] shadow-md'
            : 'bg-white border-gray-100 shadow-sm'
        }`}
        style={{
          width: itemWidth - 10,
          shadowColor: isSelected ? '#6258E8' : '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isSelected ? 0.3 : 0.05,
          shadowRadius: 4,
          elevation: isSelected ? 4 : 1,
        }}
        accessibilityLabel={`Danh mục ${item.label}`}
        accessibilityState={{ selected: isSelected }}
      >
        <View
          className={`w-11 h-11 rounded-full items-center justify-center mb-2 ${
            isSelected ? 'bg-white/20' : 'bg-purple-50'
          }`}
        >
          <Ionicons
            name={item.icon}
            size={22}
            color={isSelected ? '#FFFFFF' : COLORS.primary}
          />
        </View>

        <Text
          className={`text-xs font-bold text-center ${
            isSelected ? 'text-white' : 'text-[#20233A]'
          }`}
          numberOfLines={1}
        >
          {item.label}
        </Text>

        {count > 0 && (
          <Text
            className={`text-[10px] mt-0.5 ${
              isSelected ? 'text-white/80' : 'text-gray-400'
            }`}
          >
            {count} địa điểm
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <View className="py-2">
      <Carousel
        ref={carouselRef}
        data={categories}
        renderItem={renderItem}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        activeSlideAlignment="start"
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        enableSnap={true}
        loop={false}
        autoplay={false}
        contentContainerCustomStyle={{ paddingHorizontal: 12 }}
        keyExtractor={(item, index) => `category-${item.id || index}-${index}`}
      />
    </View>
  );
};

export default CategoryCarousel;
