import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { formatCurrency } from '../utils/formatCurrency';

/**
 * FeaturedCarousel Component
 * -------------------------------------------------------------
 * Carousel hiển thị các địa điểm du lịch nổi bật tại Việt Nam.
 * Sử dụng thư viện `react-native-snap-carousel` làm công nghệ lõi.
 *
 * Thuộc tính kỹ thuật chính:
 * - `sliderWidth`: Chiều rộng tổng thể của slider container.
 * - `itemWidth`: Chiều rộng từng item, tính tỷ lệ ~82% màn hình để lộ 2 bên.
 * - `inactiveSlideScale`: Co nhỏ item bên cạnh (0.88) để làm nổi bật item giữa.
 * - `inactiveSlideOpacity`: Làm mờ item 2 bên (0.65) tạo chiều sâu thị giác.
 * - `autoplay` & `loop`: Tự động cuộn lặp vô tận, tự dừng khi unmount.
 * - `onSnapToItem`: Cập nhật index đồng bộ thời gian thực với Pagination dots.
 */
const FeaturedCarousel = ({ destinations = [], onItemPress }) => {
  const { width: windowWidth } = useWindowDimensions();
  const [activeSlide, setActiveSlide] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const carouselRef = useRef(null);
  const isMountedRef = useRef(true);

  // Tính toán kích thước responsive
  const sliderWidth = windowWidth;
  const itemWidth = Math.round(windowWidth * 0.82);

  // Quản lý vòng đời component: chống rò rỉ bộ nhớ hoặc autoplay sau unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleImageError = useCallback((id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  }, []);

  const handleSnapToItem = useCallback((index) => {
    if (isMountedRef.current) {
      setActiveSlide(index);
    }
  }, []);

  // Xử lý dữ liệu rỗng
  if (!destinations || destinations.length === 0) {
    return null;
  }

  // Render từng card địa điểm
  const renderItem = ({ item }) => {
    const hasImageError = imageErrors[item.id];
    const displayImage = item.images && item.images.length > 0 ? item.images[0] : null;

    return (
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={() => onItemPress && onItemPress(item)}
        className="rounded-3xl overflow-hidden bg-white shadow-lg"
        style={{
          height: 220,
          shadowColor: '#20233A',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
          elevation: 6,
        }}
        accessibilityLabel={`Địa điểm nổi bật ${item.name}`}
        accessibilityRole="button"
      >
        {/* Ảnh nền */}
        {hasImageError || !displayImage ? (
          <View className="absolute inset-0 bg-gray-200 items-center justify-center">
            <Ionicons name="image-outline" size={44} color={COLORS.textLight} />
            <Text className="text-xs text-gray-400 mt-1">Không thể tải ảnh</Text>
          </View>
        ) : (
          <Image
            source={{ uri: displayImage }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
            onError={() => handleImageError(item.id)}
          />
        )}

        {/* Lớp phủ tối gradient overlay */}
        <View className="absolute inset-0 bg-black/35" />

        {/* Huy hiệu Tour Nổi Bật */}
        <View className="absolute top-3 left-3 bg-[#6258E8]/90 px-3 py-1 rounded-full flex-row items-center">
          <Ionicons name="flame" size={13} color="#FFFFFF" />
          <Text className="text-white text-xs font-bold ml-1">Nổi bật</Text>
        </View>

        {/* Đánh giá góc phải */}
        <View className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full flex-row items-center">
          <Ionicons name="star" size={13} color={COLORS.star} />
          <Text className="text-white text-xs font-semibold ml-1">{item.rating}</Text>
        </View>

        {/* Nội dung thông tin phía dưới */}
        <View className="flex-1 justify-end p-4">
          <Text className="text-white text-xl font-bold tracking-tight" numberOfLines={1}>
            {item.name}
          </Text>

          <View className="flex-row items-center mt-1">
            <Ionicons name="location-sharp" size={14} color="#FFFFFF" />
            <Text className="text-white/90 text-xs font-medium ml-1">
              {item.country || 'Việt Nam'}
            </Text>
            <Text className="text-white/60 mx-1.5">•</Text>
            <Ionicons name="time-outline" size={13} color="#FFFFFF" />
            <Text className="text-white/90 text-xs ml-1">{item.duration}</Text>
          </View>

          <View className="flex-row items-center justify-between mt-3 pt-2 border-t border-white/20">
            <View>
              <Text className="text-white/70 text-[10px] uppercase font-semibold">Giá trọn gói từ</Text>
              <Text className="text-white text-base font-extrabold">
                {formatCurrency(item.price)}
              </Text>
            </View>

            <View className="bg-white/25 px-3 py-1.5 rounded-xl flex-row items-center">
              <Text className="text-white text-xs font-bold mr-1">Xem tour</Text>
              <Ionicons name="arrow-forward" size={12} color="#FFFFFF" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const isSingleItem = destinations.length === 1;

  return (
    <View className="my-2">
      <Carousel
        ref={carouselRef}
        data={destinations}
        renderItem={renderItem}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        firstItem={0}
        inactiveSlideScale={0.88}
        inactiveSlideOpacity={0.65}
        inactiveSlideShift={0}
        activeSlideAlignment="center"
        loop={!isSingleItem}
        autoplay={!isSingleItem}
        autoplayDelay={2500}
        autoplayInterval={4000}
        lockScrollWhileSnapping={true}
        enableMomentum={false}
        decelerationRate="fast"
        onSnapToItem={handleSnapToItem}
        keyExtractor={(item, index) => `featured-${item.id || index}-${index}`}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        contentContainerCustomStyle={{ alignItems: 'center' }}
      />

      {/* Pagination dots đồng bộ */}
      {destinations.length > 1 && (
        <Pagination
          dotsLength={destinations.length}
          activeDotIndex={activeSlide}
          containerStyle={{
            paddingVertical: 10,
          }}
          dotStyle={{
            width: 22,
            height: 7,
            borderRadius: 4,
            backgroundColor: COLORS.primary,
            marginHorizontal: -4,
          }}
          inactiveDotStyle={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#CBD5E1',
            marginHorizontal: -4,
          }}
          inactiveDotOpacity={0.6}
          inactiveDotScale={0.85}
          carouselRef={carouselRef}
          tappableDots={true}
        />
      )}
    </View>
  );
};

export default FeaturedCarousel;
