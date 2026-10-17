import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBookings } from '../hooks/useBookings';
import EmptyState from '../components/EmptyState';
import { COLORS } from '../constants/theme';
import { formatCurrency } from '../utils/formatCurrency';

const BookingsScreen = ({ navigation }) => {
  const { bookings, count } = useBookings();

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('vi-VN');
    } catch {
      return '';
    }
  };

  const renderBookingCard = ({ item }) => {
    const isConfirmed = item.status === 'confirmed';
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('BookingDetails', { booking: item })}
        className="bg-white rounded-2xl mx-4 mb-3 p-4"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}
        accessibilityLabel={`Đơn đặt tour ${item.id}`}
      >
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-xs text-gray-400 font-mono">{item.id}</Text>
          <View className={`px-2.5 py-1 rounded-full ${isConfirmed ? 'bg-green-100' : 'bg-red-100'}`}>
            <Text className={`text-xs font-semibold ${isConfirmed ? 'text-green-700' : 'text-red-700'}`}>
              {isConfirmed ? 'Đã xác nhận' : 'Đã hủy'}
            </Text>
          </View>
        </View>

        <Text className="text-base font-bold text-[#20233A]" numberOfLines={1}>
          {item.destinationName}
        </Text>

        <View className="flex-row items-center mt-2">
          <View className="flex-row items-center flex-1">
            <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
            <Text className="text-sm text-gray-500 ml-1">{item.departureDate}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="people-outline" size={14} color={COLORS.textSecondary} />
            <Text className="text-sm text-gray-500 ml-1">{item.guests} người</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <Text className="text-xs text-gray-400">{formatDate(item.createdAt)}</Text>
          <Text className="text-base font-bold text-[#6258E8]">
            {formatCurrency(item.totalPrice)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      {/* Header */}
      <View className="px-4 pt-4 pb-3">
        <Text className="text-2xl font-bold text-[#20233A]">Đặt tour</Text>
        <Text className="text-sm text-gray-500 mt-1">
          {count > 0 ? `${count} lượt đặt tour` : 'Chưa có đặt tour nào'}
        </Text>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBookingCard}
        ListEmptyComponent={
          <EmptyState
            icon="receipt-outline"
            title="Chưa có đặt tour"
            message="Hãy khám phá và đặt tour du lịch đầu tiên của bạn"
            actionLabel="Khám phá ngay"
            onAction={() => navigation.navigate('ExploreTab')}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
          flexGrow: 1,
        }}
      />
    </SafeAreaView>
  );
};

export default BookingsScreen;
