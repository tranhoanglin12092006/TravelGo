import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  useWindowDimensions,
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

/**
 * DestinationImageCarousel Component
 * -------------------------------------------------------------
 * Carousel hiển thị album ảnh chất lượng cao của địa điểm trong DetailsScreen.
 *
 * Thuộc tính kỹ thuật chính:
 * - `sliderWidth={windowWidth}` & `itemWidth={windowWidth}`: Chiếm trọn 100% bề ngang.
 * - `inactiveSlideScale={1}` & `inactiveSlideOpacity={1}`: Trải nghiệm full-bleed ảnh.
 * - `onSnapToItem`: Đồng bộ chỉ số ảnh đang hiển thị với Pagination dots.
 * - `Pagination`: Hiển thị số lượng ảnh và dot tương ứng, tích hợp số trang (VD: 1/3).
 */
const DestinationImageCarousel = ({ images = [], height = 320 }) => {
  const { width: windowWidth } = useWindowDimensions();
  const [activeSlide, setActiveSlide] = useState(0);
  const [errorImages, setErrorImages] = useState({});
  const carouselRef = useRef(null);

  const handleImageError = useCallback((index) => {
    setErrorImages((prev) => ({ ...prev, [index]: true }));
  }, []);

  if (!images || images.length === 0) {
    return (
      <View style={{ height }} className="bg-gray-200 items-center justify-center">
        <Ionicons name="image-outline" size={48} color={COLORS.textLight} />
        <Text className="text-gray-400 text-sm mt-2">Chưa có ảnh địa điểm</Text>
      </View>
    );
  }

  const renderItem = ({ item, index }) => {
    const isError = errorImages[index];

    return (
      <View style={{ width: windowWidth, height }} className="relative bg-gray-900">
        {isError ? (
          <View className="w-full h-full bg-gray-200 items-center justify-center">
            <Ionicons name="image-outline" size={48} color={COLORS.textLight} />
            <Text className="text-xs text-gray-400 mt-2">Không tải được ảnh</Text>
          </View>
        ) : (
          <Image
            source={{ uri: item }}
            className="w-full h-full"
            resizeMode="cover"
            onError={() => handleImageError(index)}
          />
        )}
        <View className="absolute inset-0 bg-black/25" />
      </View>
    );
  };

  return (
    <View className="relative" style={{ height }}>
      <Carousel
        ref={carouselRef}
        data={images}
        renderItem={renderItem}
        sliderWidth={windowWidth}
        itemWidth={windowWidth}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        enableMomentum={false}
        decelerationRate="fast"
        onSnapToItem={(index) => setActiveSlide(index)}
        keyExtractor={(_, index) => `dest-img-${index}`}
      />

      {/* Pagination badge & dots */}
      {images.length > 1 && (
        <View className="absolute bottom-4 left-0 right-0 items-center">
          {/* Badge đếm ảnh góc phải */}
          <View className="absolute right-4 bottom-2 bg-black/50 px-2.5 py-1 rounded-full">
            <Text className="text-white text-xs font-semibold">
              {activeSlide + 1}/{images.length}
            </Text>
          </View>

          {/* Dots Indicator */}
          <Pagination
            dotsLength={images.length}
            activeDotIndex={activeSlide}
            containerStyle={{
              paddingVertical: 0,
            }}
            dotStyle={{
              width: 18,
              height: 6,
              borderRadius: 3,
              backgroundColor: '#FFFFFF',
              marginHorizontal: -5,
            }}
            inactiveDotStyle={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.45)',
              marginHorizontal: -5,
            }}
            inactiveDotOpacity={0.5}
            inactiveDotScale={0.8}
            carouselRef={carouselRef}
            tappableDots={true}
          />
        </View>
      )}
    </View>
  );
};

export default DestinationImageCarousel;
