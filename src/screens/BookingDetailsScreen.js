import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBookings } from '../hooks/useBookings';
import { COLORS } from '../constants/theme';
import { formatCurrency } from '../utils/formatCurrency';
import PrimaryButton from '../components/PrimaryButton';

const BookingDetailsScreen = ({ route, navigation }) => {
  const { booking: routeBooking } = route.params;
  const { bookings, cancelBooking } = useBookings();

  // Get latest booking data from context (in case status was updated)
  const booking = bookings.find((b) => b.id === routeBooking.id) || routeBooking;

  const isConfirmed = booking.status === 'confirmed';
  const isCancelled = booking.status === 'cancelled';

  const handleCancel = () => {
    Alert.alert(
      'Hủy đặt tour',
      'Bạn có chắc chắn muốn hủy đặt tour này? (Demo)',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Hủy tour',
          style: 'destructive',
          onPress: () => {
            cancelBooking(booking.id);
            Alert.alert('Đã hủy', 'Đặt tour đã được hủy thành công (Demo)');
          },
        },
      ]
    );
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const InfoRow = ({ label, value, valueColor }) => (
    <View className="flex-row items-center justify-between py-3 border-b border-gray-50">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className={`text-sm font-medium ${valueColor || 'text-[#20233A]'}`}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3"
          accessibilityLabel="Quay lại"
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-[#20233A]">Chi tiết đặt tour</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* Status Card */}
        <View className="bg-white rounded-2xl p-6 items-center" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
          <View className={`w-16 h-16 rounded-full items-center justify-center mb-3 ${isConfirmed ? 'bg-green-100' : 'bg-red-100'}`}>
            <Ionicons
              name={isConfirmed ? 'checkmark-circle' : 'close-circle'}
              size={36}
              color={isConfirmed ? COLORS.success : COLORS.error}
            />
          </View>
          <Text className="text-lg font-bold text-[#20233A]">
            {isConfirmed ? 'Đặt tour thành công' : 'Đã hủy đặt tour'}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">(Demo - Không phải giao dịch thật)</Text>
          <View className={`mt-3 px-4 py-1.5 rounded-full ${isConfirmed ? 'bg-green-100' : 'bg-red-100'}`}>
            <Text className={`text-sm font-semibold ${isConfirmed ? 'text-green-700' : 'text-red-700'}`}>
              {isConfirmed ? 'Đã xác nhận' : 'Đã hủy'}
            </Text>
          </View>
        </View>

        {/* Booking ID */}
        <View className="bg-white rounded-2xl p-4 mt-4" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
          <Text className="text-xs text-gray-400 text-center">Mã đặt tour</Text>
          <Text className="text-lg font-bold text-[#6258E8] text-center mt-1">
            {booking.id}
          </Text>
        </View>

        {/* Details */}
        <View className="bg-white rounded-2xl p-4 mt-4" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
          <Text className="text-base font-bold text-[#20233A] mb-2">Thông tin đặt tour</Text>
          <InfoRow label="Địa điểm" value={booking.destinationName} />
          <InfoRow label="Họ tên" value={booking.fullName} />
          <InfoRow label="Số điện thoại" value={booking.phone} />
          <InfoRow label="Ngày khởi hành" value={booking.departureDate} />
          <InfoRow label="Số người" value={`${booking.guests} người`} />
          <InfoRow label="Giá mỗi người" value={formatCurrency(booking.pricePerPerson)} />
          <InfoRow label="Tổng tiền" value={formatCurrency(booking.totalPrice)} valueColor="text-[#6258E8]" />
          {booking.notes ? <InfoRow label="Ghi chú" value={booking.notes} /> : null}
          <InfoRow label="Thời gian đặt" value={formatDate(booking.createdAt)} />
        </View>

        {/* Actions */}
        <View className="mt-6">
          {isConfirmed && (
            <TouchableOpacity
              onPress={handleCancel}
              className="flex-row items-center justify-center py-4 rounded-2xl border-2 border-red-400 mb-3"
            >
              <Ionicons name="close-circle-outline" size={20} color={COLORS.error} />
              <Text className="text-base font-semibold text-red-500 ml-2">Hủy đặt tour (Demo)</Text>
            </TouchableOpacity>
          )}
          <PrimaryButton
            title="Về trang chủ"
            onPress={() => navigation.navigate('MainTabs', { screen: 'ExploreTab' })}
            icon="home-outline"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingDetailsScreen;
