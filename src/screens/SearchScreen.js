import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDestinations } from '../hooks/useDestinations';
import { useFavorites } from '../hooks/useFavorites';
import CategoryFilter from '../components/CategoryFilter';
import DestinationCard from '../components/DestinationCard';
import EmptyState from '../components/EmptyState';
import { COLORS, CATEGORIES, SORT_OPTIONS } from '../constants/theme';
import { formatCurrency } from '../utils/formatCurrency';

const SearchScreen = ({ navigation }) => {
  const {
    destinations: filteredDestinations,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    clearFilters,
  } = useDestinations();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [showSortModal, setShowSortModal] = useState(false);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const searchInputRef = useRef(null);

  // Tự động focus vào thanh tìm kiếm khi mở màn hình
  useEffect(() => {
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  const handleApplyPrice = () => {
    const min = minPrice ? parseInt(minPrice, 10) : 0;
    const max = maxPrice ? parseInt(maxPrice, 10) : 10000000;
    setPriceRange({ min, max });
    setShowPriceFilter(false);
  };

  const handleClearAll = () => {
    clearFilters();
    setMinPrice('');
    setMaxPrice('');
    setShowPriceFilter(false);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.length > 0 ||
      selectedCategory !== 'all' ||
      sortBy !== 'default' ||
      minPrice.length > 0 ||
      maxPrice.length > 0
    );
  }, [searchQuery, selectedCategory, sortBy, minPrice, maxPrice]);

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.id === sortBy)?.label || 'Sắp xếp';

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]" edges={['top', 'left', 'right']}>
      {/* 1. Header & Thanh tìm kiếm */}
      <View className="px-4 pt-2 pb-2 bg-white border-b border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3"
            accessibilityLabel="Quay lại"
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.text} />
          </TouchableOpacity>

          <View className="flex-1 flex-row items-center bg-gray-100 rounded-2xl px-3.5 py-2.5">
            <Ionicons name="search" size={18} color={COLORS.textSecondary} />
            <TextInput
              ref={searchInputRef}
              className="flex-1 ml-2.5 text-sm text-[#20233A] py-0"
              placeholder="Tìm kiếm điểm đến, thành phố..."
              placeholderTextColor={COLORS.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* 2. Hàng danh mục trải nghiệm (Chips cố định chiều cao, không bị bẹp dẹp) */}
      <View className="bg-white py-1 border-b border-gray-50">
        <CategoryFilter
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => {
            Keyboard.dismiss();
            setSelectedCategory(catId);
          }}
        />
      </View>

      {/* 3. Thanh điều khiển bộ lọc (Sắp xếp + Khoảng giá + Đặt lại) */}
      <View className="px-4 py-2.5 bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            {/* Nút mở sắp xếp */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowSortModal(true)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
                marginRight: 8,
                borderWidth: 1,
                borderColor: sortBy !== 'default' ? COLORS.primary : '#E5E7EB',
                backgroundColor: sortBy !== 'default' ? '#F5F3FF' : '#F9FAFB',
              }}
            >
              <Ionicons
                name="swap-vertical"
                size={14}
                color={sortBy !== 'default' ? COLORS.primary : COLORS.textSecondary}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  marginLeft: 4,
                  color: sortBy !== 'default' ? COLORS.primary : '#374151',
                }}
              >
                {currentSortLabel}
              </Text>
              <Ionicons
                name="chevron-down"
                size={12}
                color={sortBy !== 'default' ? COLORS.primary : COLORS.textLight}
                style={{ marginLeft: 3 }}
              />
            </TouchableOpacity>

            {/* Nút mở bộ lọc giá */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowPriceFilter(!showPriceFilter)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: minPrice || maxPrice || showPriceFilter ? COLORS.primary : '#E5E7EB',
                backgroundColor: minPrice || maxPrice || showPriceFilter ? '#F5F3FF' : '#F9FAFB',
              }}
            >
              <Ionicons
                name="options-outline"
                size={14}
                color={minPrice || maxPrice ? COLORS.primary : COLORS.textSecondary}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  marginLeft: 4,
                  color: minPrice || maxPrice ? COLORS.primary : '#374151',
                }}
              >
                Lọc giá
              </Text>
            </TouchableOpacity>
          </View>

          {/* Nút xóa bộ lọc nếu đang có filter */}
          {hasActiveFilters && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleClearAll}
              className="flex-row items-center bg-red-50 px-2.5 py-1 rounded-lg"
            >
              <Ionicons name="refresh" size={13} color={COLORS.error} />
              <Text className="text-xs text-red-500 font-semibold ml-1">Đặt lại</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Thanh mở rộng nhập khoảng giá (Hiển thị khi người dùng cần lọc) */}
        {showPriceFilter && (
          <View className="mt-3 pt-3 border-t border-gray-100 flex-row items-center">
            <TextInput
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-center text-[#20233A]"
              placeholder="Giá từ (₫)"
              placeholderTextColor={COLORS.textLight}
              keyboardType="numeric"
              value={minPrice}
              onChangeText={setMinPrice}
            />
            <Text className="mx-2 text-gray-400 font-bold">—</Text>
            <TextInput
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-center text-[#20233A]"
              placeholder="Đến (₫)"
              placeholderTextColor={COLORS.textLight}
              keyboardType="numeric"
              value={maxPrice}
              onChangeText={setMaxPrice}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleApplyPrice}
              className="ml-2.5 bg-[#6258E8] rounded-xl px-4 py-2"
            >
              <Text className="text-white text-xs font-bold">Áp dụng</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 4. Thông tin số lượng kết quả */}
      <View className="px-4 py-3 flex-row items-center justify-between">
        <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Tìm thấy {filteredDestinations.length} tour phù hợp
        </Text>
      </View>

      {/* 5. Danh sách địa điểm */}
      <FlatList
        data={filteredDestinations}
        keyExtractor={(item) => `search-item-${item.id}`}
        renderItem={({ item }) => (
          <DestinationCard
            destination={item}
            onPress={() =>
              navigation.navigate('Details', { destinationId: item.id })
            }
            onToggleFavorite={toggleFavorite}
            isFavorite={isFavorite(item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="Không tìm thấy tour phù hợp"
            message="Hãy thử đổi từ khóa tìm kiếm hoặc bấm đặt lại bộ lọc để xem toàn bộ tour"
            actionLabel="Đặt lại bộ lọc"
            onAction={handleClearAll}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
          flexGrow: 1,
        }}
      />

      {/* Bảng lựa chọn Sắp xếp (Dạng Overlay trong cùng cây React để tránh lỗi Navigation Context trên iOS) */}
      {showSortModal && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
        >
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}
            activeOpacity={1}
            onPress={() => setShowSortModal(false)}
          >
            <View className="bg-white rounded-t-3xl pt-3 pb-8 px-5">
              <View className="w-10 h-1 bg-gray-300 rounded-full self-center mb-4" />
              <Text className="text-base font-black text-[#20233A] mb-3">
                Sắp xếp danh sách theo
              </Text>
              {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => {
                    setSortBy(option.id);
                    setShowSortModal(false);
                  }}
                  className={`flex-row items-center justify-between py-3.5 border-b border-gray-100 ${
                    sortBy === option.id ? 'bg-purple-50 -mx-3 px-3 rounded-xl' : ''
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      sortBy === option.id
                        ? 'text-[#6258E8] font-bold'
                        : 'text-[#20233A]'
                    }`}
                  >
                    {option.label}
                  </Text>
                  {sortBy === option.id && (
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;
