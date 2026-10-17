import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { formatCurrency } from '../utils/formatCurrency';

/**
 * RelatedDestinationsCarousel Component
 * -------------------------------------------------------------
 * Carousel hiển thị danh sách các tour du lịch tương tự / liên quan
 * ngay bên trong màn hình Chi tiết địa điểm (DetailsScreen).
 *
 * Thuộc tính kỹ thuật chính:
 * - `sliderWidth`: Chiều rộng toàn màn hình.
 * - `itemWidth`: Card kích thước vừa (240px) tiện vuốt ngang so sánh.
 * - `activeSlideAlignment="start"`: Canh lề trái mượt mà.
 * - `inactiveSlideScale={0.94}`: Hiệu ứng co nhẹ các item tiếp theo.
 * - Nhấn item chuyển tiếp ngay sang màn hình chi tiết của địa điểm đó.
 */
const RelatedDestinationsCarousel = ({ destinations = [], onItemPress }) => {
  const { width: windowWidth } = useWindowDimensions();
  const carouselRef = useRef(null);
  const [imageErrors, setImageErrors] = useState({});

  const sliderWidth = windowWidth;
  const itemWidth = 240;

  const handleImageError = useCallback((id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  }, []);

  if (!destinations || destinations.length === 0) {
    return null;
  }

  const renderItem = ({ item }) => {
    const hasImageError = imageErrors[item.id];
    const displayImage = item.images && item.images.length > 0 ? item.images[0] : null;

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => onItemPress && onItemPress(item)}
        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 my-2"
        style={{
          width: itemWidth - 14,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
          elevation: 3,
        }}
        accessibilityLabel={`Địa điểm liên quan ${item.name}`}
      >
        {/* Ảnh */}
        <View className="h-32 bg-gray-100 relative">
          {hasImageError || !displayImage ? (
            <View className="w-full h-full items-center justify-center bg-gray-200">
              <Ionicons name="image-outline" size={28} color={COLORS.textLight} />
            </View>
          ) : (
            <Image
              source={{ uri: displayImage }}
              className="w-full h-full"
              resizeMode="cover"
              onError={() => handleImageError(item.id)}
            />
          )}

          <View className="absolute top-2 right-2 bg-black/50 px-2 py-0.5 rounded-full flex-row items-center">
            <Ionicons name="star" size={11} color={COLORS.star} />
            <Text className="text-white text-[11px] font-semibold ml-1">{item.rating}</Text>
          </View>
        </View>

        {/* Thông tin */}
        <View className="p-3">
          <Text className="text-sm font-bold text-[#20233A]" numberOfLines={1}>
            {item.name}
          </Text>

          <View className="flex-row items-center mt-1">
            <Ionicons name="location-outline" size={12} color={COLORS.textSecondary} />
            <Text className="text-xs text-gray-500 ml-0.5" numberOfLines={1}>
              {item.country || 'Việt Nam'}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <Text className="text-xs font-bold text-[#6258E8]">
              {formatCurrency(item.price)}
            </Text>
            <Text className="text-[10px] text-gray-400">{item.duration}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="my-2">
      <Carousel
        ref={carouselRef}
        data={destinations}
        renderItem={renderItem}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        activeSlideAlignment="start"
        inactiveSlideScale={0.94}
        inactiveSlideOpacity={0.8}
        enableSnap={true}
        loop={false}
        autoplay={false}
        contentContainerCustomStyle={{ paddingLeft: 16 }}
        keyExtractor={(item, index) => `related-${item.id || index}-${index}`}
      />
    </View>
  );
};

export default RelatedDestinationsCarousel;
