import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { formatCurrency } from '../utils/formatCurrency';

const { width: screenWidth } = Dimensions.get('window');

const DestinationCarousel = ({ destinations, onPress }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = useCallback((id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  }, []);

  const renderItem = useCallback(
    ({ item }) => {
      const hasError = imageErrors[item.id];

      return (
        <TouchableOpacity
          onPress={() => onPress && onPress(item)}
          className="mx-3 rounded-3xl overflow-hidden"
          style={{ height: 200 }}
          activeOpacity={0.9}
          accessibilityLabel={`Điểm đến nổi bật ${item.name}`}
        >
          {hasError ? (
            <View className="absolute w-full h-full bg-gray-300 items-center justify-center">
              <Ionicons name="image-outline" size={40} color={COLORS.textLight} />
              <Text className="text-xs text-gray-400 mt-1">Không tải được ảnh</Text>
            </View>
          ) : (
            <Image
              source={{ uri: item.image }}
              className="absolute w-full h-full"
              resizeMode="cover"
              onError={() => handleImageError(item.id)}
            />
          )}
          <View className="absolute w-full h-full bg-black/30" />
          <View className="flex-1 justify-end p-5">
            <Text className="text-white text-xl font-bold" numberOfLines={1}>
              {item.name}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="location" size={14} color="#FFFFFF" />
              <Text className="text-white/80 text-sm ml-1">{item.region}</Text>
            </View>
            <View className="flex-row items-center justify-between mt-2">
              <View className="flex-row items-center bg-white/20 rounded-full px-3 py-1">
                <Ionicons name="star" size={14} color="#FBBF24" />
                <Text className="text-white text-sm font-semibold ml-1">
                  {item.rating}
                </Text>
              </View>
              <View className="bg-white/20 rounded-full px-3 py-1">
                <Text className="text-white text-sm font-semibold">
                  {formatCurrency(item.price)}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [onPress, imageErrors, handleImageError]
  );

  if (!destinations || destinations.length === 0) return null;

  return (
    <View>
      <Carousel
        width={screenWidth}
        height={220}
        data={destinations}
        renderItem={renderItem}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.88,
          parallaxScrollingOffset: 50,
        }}
        autoPlay={true}
        autoPlayInterval={4000}
        scrollAnimationDuration={800}
        onSnapToItem={(index) => setActiveIndex(index)}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
      />
      {/* Pagination Dots */}
      <View className="flex-row items-center justify-center mt-2">
        {destinations.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full mx-1 ${
              index === activeIndex
                ? 'w-6 bg-[#6258E8]'
                : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </View>
    </View>
  );
};

export default DestinationCarousel;
