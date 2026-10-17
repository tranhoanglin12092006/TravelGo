import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDestinations } from '../hooks/useDestinations';
import { useFavorites } from '../hooks/useFavorites';
import SearchBar from '../components/SearchBar';
import FeaturedCarousel from '../components/FeaturedCarousel';
import CategoryCarousel from '../components/CategoryCarousel';
import SectionHeader from '../components/SectionHeader';
import DestinationCard from '../components/DestinationCard';
import EmptyState from '../components/EmptyState';
import { CATEGORIES } from '../constants/theme';

const HomeScreen = ({ navigation }) => {
  const {
    destinations: filteredDestinations,
    featuredDestinations,
    destinationCounts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useDestinations();
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleDestinationPress = useCallback(
    (destination) => {
      navigation.navigate('Details', { destinationId: destination.id });
    },
    [navigation]
  );

  const handleSearchFocus = useCallback(() => {
    navigation.navigate('Search');
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Header ứng dụng */}
        <View className="px-4 pt-3 pb-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-2xl bg-[#6258E8] items-center justify-center shadow-md">
                <Ionicons name="airplane" size={22} color="#FFFFFF" />
              </View>
              <View className="ml-3">
                <Text className="text-xl font-black text-[#20233A] tracking-tight">
                  TravelGo
                </Text>
                <Text className="text-[11px] text-[#6258E8] font-bold uppercase tracking-wider">
                  Explore Vietnam
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('Search')}
              className="w-10 h-10 rounded-full bg-white border border-gray-100 items-center justify-center shadow-sm"
              accessibilityLabel="Mở tìm kiếm"
            >
              <Ionicons name="search" size={18} color="#20233A" />
            </TouchableOpacity>
          </View>

          <Text className="text-2xl font-black text-[#20233A] mt-5">
            Đi đâu tiếp theo?
          </Text>
          <Text className="text-sm text-gray-500 mt-0.5">
            Khám phá vẻ đẹp bất tận trên dải đất hình chữ S
          </Text>
        </View>

        {/* Thanh tìm kiếm nhanh */}
        <View className="mt-3">
          <TouchableOpacity onPress={handleSearchFocus} activeOpacity={0.9}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Tìm kiếm điểm đến, thành phố..."
            />
          </TouchableOpacity>
        </View>

        {/* Carousel 1: ĐỊA ĐIỂM NỔI BẬT (react-native-snap-carousel) */}
        {featuredDestinations.length > 0 && !searchQuery && (
          <View className="mt-4">
            <SectionHeader
              title="Địa điểm nổi bật 🔥"
              onSeeAll={() => navigation.navigate('Search')}
            />
            <FeaturedCarousel
              destinations={featuredDestinations}
              onItemPress={handleDestinationPress}
            />
          </View>
        )}

        {/* Carousel 2: DANH MỤC DU LỊCH (react-native-snap-carousel) */}
        <View className="mt-1">
          <SectionHeader title="Danh mục trải nghiệm" />
          <CategoryCarousel
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            destinationCounts={destinationCounts}
          />
        </View>

        {/* Banner khuyến mãi */}
        <View className="mx-4 mt-5 rounded-2xl overflow-hidden bg-[#6258E8] p-5 shadow-md">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <View className="bg-white/20 self-start px-2 py-0.5 rounded-md mb-2">
                <Text className="text-white text-[10px] font-bold uppercase">Ưu đãi sinh viên</Text>
              </View>
              <Text className="text-white text-lg font-black leading-tight">
                Hành trình thanh xuân
              </Text>
              <Text className="text-white/80 text-xs mt-1">
                Giảm ngay 15% cho nhóm từ 4 người
              </Text>
              <TouchableOpacity
                className="bg-white rounded-xl px-4 py-2 mt-3.5 self-start shadow-sm"
                onPress={() => navigation.navigate('Search')}
                accessibilityLabel="Khám phá ngay"
              >
                <Text className="text-[#6258E8] font-bold text-xs">
                  Khám phá ngay →
                </Text>
              </TouchableOpacity>
            </View>
            <Ionicons name="compass" size={68} color="rgba(255,255,255,0.25)" />
          </View>
        </View>

        {/* Danh sách địa điểm "Dành cho bạn" */}
        <View className="mt-5">
          <SectionHeader
            title="Dành cho bạn"
            onSeeAll={() => navigation.navigate('Search')}
          />
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map((destination) => (
              <DestinationCard
                key={`card-dest-${destination.id}`}
                destination={destination}
                onPress={() => handleDestinationPress(destination)}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite(destination.id)}
              />
            ))
          ) : (
            <EmptyState
              icon="search-outline"
              title="Không tìm thấy kết quả"
              message="Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
