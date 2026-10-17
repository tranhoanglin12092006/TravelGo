import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Share,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDestinations } from '../hooks/useDestinations';
import { useFavorites } from '../hooks/useFavorites';
import { COLORS } from '../constants/theme';
import { formatCurrency } from '../utils/formatCurrency';
import PrimaryButton from '../components/PrimaryButton';
import DestinationImageCarousel from '../components/DestinationImageCarousel';
import RelatedDestinationsCarousel from '../components/RelatedDestinationsCarousel';

const DetailsScreen = ({ route, navigation }) => {
  const { destinationId } = route.params;
  const { getDestinationById, getRelatedDestinations } = useDestinations();
  const { toggleFavorite, isFavorite } = useFavorites();

  const destination = getDestinationById(destinationId);
  const relatedDestinations = useMemo(() => {
    return destination ? getRelatedDestinations(destination.id, destination.category) : [];
  }, [destination, getRelatedDestinations]);

  if (!destination) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center p-6">
        <Ionicons name="alert-circle-outline" size={54} color={COLORS.textLight} />
        <Text className="text-lg font-bold text-[#20233A] mt-4">Không tìm thấy địa điểm</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-4 bg-[#6258E8] px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const favorite = isFavorite(destination.id);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Khám phá tour ${destination.name} (${destination.country || 'Việt Nam'}) cùng TravelGo với giá chỉ từ ${formatCurrency(destination.price)}!`,
      });
    } catch {
      // bỏ qua khi người dùng đóng dialog chia sẻ
    }
  };

  const handleBooking = () => {
    navigation.navigate('BookingForm', { destinationId: destination.id });
  };

  const handleRelatedPress = (item) => {
    navigation.push('Details', { destinationId: item.id });
  };

  const imagesList = destination.images && destination.images.length > 0
    ? destination.images
    : (destination.image ? [destination.image] : []);

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Carousel 3: ALBUM ẢNH CHI TIẾT (react-native-snap-carousel) */}
        <View className="relative">
          <DestinationImageCarousel images={imagesList} height={330} />

          {/* Thanh nút điều hướng trên đỉnh ảnh */}
          <SafeAreaView className="absolute top-0 left-0 right-0">
            <View className="flex-row items-center justify-between px-4 pt-2">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.goBack()}
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md items-center justify-center"
                accessibilityLabel="Quay lại"
              >
                <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
              </TouchableOpacity>

              <View className="flex-row">
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleShare}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md items-center justify-center mr-2"
                  accessibilityLabel="Chia sẻ địa điểm"
                >
                  <Ionicons name="share-outline" size={20} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => toggleFavorite(destination.id)}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md items-center justify-center"
                  accessibilityLabel={favorite ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
                >
                  <Ionicons
                    name={favorite ? 'heart' : 'heart-outline'}
                    size={20}
                    color={favorite ? COLORS.error : '#FFFFFF'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>

        {/* Thân trang nội dung */}
        <View className="bg-white rounded-t-3xl -mt-6 pt-6 px-4 pb-36">
          {/* Tên & Quốc gia / Vị trí */}
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-2xl font-black text-[#20233A] tracking-tight">
                {destination.name}
              </Text>
              <View className="flex-row items-center mt-1.5">
                <Ionicons name="location-sharp" size={15} color={COLORS.primary} />
                <Text className="text-sm text-gray-500 font-medium ml-1">
                  {destination.country || 'Việt Nam'}
                </Text>
              </View>
            </View>

            <View className="bg-purple-50 px-3 py-1.5 rounded-xl items-end">
              <View className="flex-row items-center">
                <Ionicons name="star" size={15} color={COLORS.star} />
                <Text className="text-sm font-black text-[#20233A] ml-1">
                  {destination.rating}
                </Text>
              </View>
              <Text className="text-[10px] text-gray-400 mt-0.5">
                {destination.reviews || 200}+ lượt đánh giá
              </Text>
            </View>
          </View>

          {/* Thẻ tóm tắt tiện ích */}
          <View className="flex-row mt-5">
            <View className="flex-1 flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl p-3 mr-2.5">
              <View className="w-9 h-9 rounded-xl bg-purple-100 items-center justify-center">
                <Ionicons name="time-outline" size={18} color={COLORS.primary} />
              </View>
              <View className="ml-2.5">
                <Text className="text-[10px] text-gray-400 font-semibold uppercase">Thời lượng</Text>
                <Text className="text-xs font-bold text-[#20233A] mt-0.5">{destination.duration}</Text>
              </View>
            </View>

            <View className="flex-1 flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl p-3">
              <View className="w-9 h-9 rounded-xl bg-purple-100 items-center justify-center">
                <Ionicons name="wallet-outline" size={18} color={COLORS.primary} />
              </View>
              <View className="ml-2.5">
                <Text className="text-[10px] text-gray-400 font-semibold uppercase">Giá tham khảo</Text>
                <Text className="text-xs font-bold text-[#6258E8] mt-0.5">
                  {formatCurrency(destination.price)}
                </Text>
              </View>
            </View>
          </View>

          {/* Mô tả chi tiết */}
          <View className="mt-6">
            <Text className="text-base font-black text-[#20233A] mb-2">
              Giới thiệu điểm đến
            </Text>
            <Text className="text-sm text-gray-600 leading-6">
              {destination.description}
            </Text>
          </View>

          {/* Điểm nổi bật */}
          {destination.highlights && destination.highlights.length > 0 && (
            <View className="mt-6">
              <Text className="text-base font-black text-[#20233A] mb-3">
                Trải nghiệm nổi bật
              </Text>
              {destination.highlights.map((highlight, index) => (
                <View key={index} className="flex-row items-start mb-2.5">
                  <View className="w-5 h-5 rounded-full bg-green-100 items-center justify-center mt-0.5 mr-2.5">
                    <Ionicons name="checkmark" size={12} color={COLORS.success} />
                  </View>
                  <Text className="text-sm text-gray-700 flex-1 leading-5">
                    {highlight}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Thông tin cần biết */}
          <View className="mt-6 bg-amber-50/70 border border-amber-200/50 rounded-2xl p-4">
            <View className="flex-row items-center mb-1.5">
              <Ionicons name="information-circle" size={18} color={COLORS.warning} />
              <Text className="text-sm font-bold text-[#20233A] ml-2">
                Lưu ý đặt tour (Demo)
              </Text>
            </View>
            <Text className="text-xs text-gray-600 leading-5">
              • Giá tour mang tính chất tham khảo minh họa cho đồ án môn học.{"\n"}
              • Đặt tour trước ít nhất 3 ngày để nhận lịch trình chi tiết.{"\n"}
              • Không phát sinh thanh toán thật trên hệ thống demo.
            </Text>
          </View>

          {/* Carousel 4: ĐỊA ĐIỂM TƯƠNG TỰ LIÊN QUAN (react-native-snap-carousel) */}
          {relatedDestinations.length > 0 && (
            <View className="mt-7">
              <Text className="text-base font-black text-[#20233A] mb-1">
                Điểm đến tương tự bạn có thể thích
              </Text>
              <Text className="text-xs text-gray-400 mb-2">
                Vuốt ngang để khám phá các hành trình cùng danh mục
              </Text>
              <RelatedDestinationsCarousel
                destinations={relatedDestinations}
                onItemPress={handleRelatedPress}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Thanh cố định bên dưới để Đặt tour */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 pt-3 pb-8 flex-row items-center"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
          elevation: 10,
        }}
      >
        <View className="mr-5">
          <Text className="text-[10px] uppercase font-bold text-gray-400">Giá trọn gói</Text>
          <Text className="text-xl font-black text-[#6258E8]">
            {formatCurrency(destination.price)}
          </Text>
        </View>

        <View className="flex-1">
          <PrimaryButton
            title="Đặt tour ngay"
            onPress={handleBooking}
            icon="calendar"
          />
        </View>
      </View>
    </View>
  );
};

export default DetailsScreen;
