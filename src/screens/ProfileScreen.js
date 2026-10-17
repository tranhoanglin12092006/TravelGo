import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../hooks/useFavorites';
import { useBookings } from '../hooks/useBookings';
import { COLORS } from '../constants/theme';

const MenuItem = ({ icon, label, value, onPress, showArrow = true }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center py-4 border-b border-gray-100"
    disabled={!onPress}
    accessibilityLabel={label}
  >
    <View className="w-10 h-10 rounded-xl bg-[#6258E8]/10 items-center justify-center">
      <Ionicons name={icon} size={20} color={COLORS.primary} />
    </View>
    <View className="flex-1 ml-3">
      <Text className="text-base text-[#20233A]">{label}</Text>
      {value && <Text className="text-xs text-gray-400 mt-0.5">{value}</Text>}
    </View>
    {showArrow && onPress && (
      <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
    )}
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
  const { count: favCount } = useFavorites();
  const { count: bookingCount, activeCount } = useBookings();
  const [showAbout, setShowAbout] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="px-4 pt-4 pb-6">
          <Text className="text-2xl font-bold text-[#20233A]">Cá nhân</Text>
        </View>

        {/* Profile Card */}
        <View className="mx-4 bg-white rounded-2xl p-5" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
          <View className="flex-row items-center">
            <View className="w-16 h-16 rounded-full bg-[#6258E8] items-center justify-center">
              <Ionicons name="person" size={30} color="#FFFFFF" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold text-[#20233A]">Người dùng TravelGo</Text>
              <Text className="text-sm text-gray-500 mt-0.5">Xin chào! Chào mừng bạn</Text>
            </View>
          </View>

          {/* Stats */}
          <View className="flex-row mt-5 pt-4 border-t border-gray-100">
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-[#6258E8]">{favCount}</Text>
              <Text className="text-xs text-gray-500 mt-1">Yêu thích</Text>
            </View>
            <View className="w-px bg-gray-200" />
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-[#6258E8]">{activeCount}</Text>
              <Text className="text-xs text-gray-500 mt-1">Đã đặt tour</Text>
            </View>
            <View className="w-px bg-gray-200" />
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-[#6258E8]">{bookingCount}</Text>
              <Text className="text-xs text-gray-500 mt-1">Tổng đơn</Text>
            </View>
          </View>
        </View>

        {/* Menu */}
        <View className="mx-4 mt-6 bg-white rounded-2xl px-4" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
          <MenuItem
            icon="receipt-outline"
            label="Lịch sử đặt tour"
            onPress={() => navigation.navigate('BookingsTab')}
          />
          <MenuItem
            icon="heart-outline"
            label="Địa điểm yêu thích"
            value={`${favCount} địa điểm`}
            onPress={() => navigation.navigate('FavoritesTab')}
          />
          <MenuItem
            icon="settings-outline"
            label="Cài đặt"
            onPress={() => Alert.alert('Thông báo', 'Chức năng đang phát triển')}
          />
          <MenuItem
            icon="information-circle-outline"
            label="Thông tin ứng dụng"
            onPress={() => setShowAbout(true)}
          />
          <MenuItem
            icon="chatbubble-ellipses-outline"
            label="Liên hệ hỗ trợ"
            onPress={() => Alert.alert('Liên hệ', 'Email: support@travelgo.vn\nĐiện thoại: 1900 xxxx')}
          />
          <MenuItem
            icon="code-slash-outline"
            label="Phiên bản"
            value="1.0.0 (Demo)"
            showArrow={false}
          />
        </View>

        {/* Footer */}
        <View className="items-center mt-8">
          <Text className="text-xs text-gray-400">
            TravelGo — Explore Vietnam
          </Text>
          <Text className="text-xs text-gray-300 mt-1">
            Đồ án LTDD © 2026
          </Text>
        </View>
      </ScrollView>

      {/* About Modal (Dạng Overlay trong cùng cây React để tránh lỗi Navigation Context) */}
      {showAbout && (
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
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}
            activeOpacity={1}
            onPress={() => setShowAbout(false)}
          >
            <View className="bg-white rounded-3xl p-6 mx-8" style={{ maxWidth: 360 }}>
              <View className="items-center mb-4">
                <View className="w-16 h-16 rounded-2xl bg-[#6258E8] items-center justify-center mb-3">
                  <Ionicons name="airplane" size={32} color="#FFFFFF" />
                </View>
                <Text className="text-xl font-bold text-[#20233A]">TravelGo</Text>
                <Text className="text-sm text-gray-500 mt-1">Explore Vietnam</Text>
              </View>
              <Text className="text-sm text-gray-600 text-center leading-5">
                TravelGo là ứng dụng khám phá du lịch Việt Nam, được phát triển như đồ án môn Lập trình di động.
              </Text>
              <Text className="text-sm text-gray-600 text-center leading-5 mt-2">
                Phiên bản: 1.0.0 (Demo){"\n"}
                Công nghệ: React Native + Expo{"\n"}
                UI Framework: NativeWind (Tailwind CSS)
              </Text>
              <TouchableOpacity
                onPress={() => setShowAbout(false)}
                className="bg-[#6258E8] rounded-xl py-3 mt-5"
              >
                <Text className="text-white font-semibold text-center">Đóng</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;
