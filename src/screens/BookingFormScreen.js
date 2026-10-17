import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDestinations } from '../hooks/useDestinations';
import { useBookings } from '../hooks/useBookings';
import { COLORS } from '../constants/theme';
import { formatCurrency } from '../utils/formatCurrency';
import {
  validateName,
  validatePhone,
  validateDate,
  validateGuests,
  generateBookingId,
} from '../utils/validation';
import PrimaryButton from '../components/PrimaryButton';

// Định nghĩa FormField ở BÊN NGOÀI để tránh việc unmount/remount TextInput
// gây mất focus và đóng bàn phím sau mỗi ký tự gõ!
const FormField = ({ label, error, children }) => (
  <View className="mb-4">
    <Text className="text-sm font-medium text-[#20233A] mb-1.5">{label}</Text>
    {children}
    {error && (
      <View className="flex-row items-center mt-1">
        <Ionicons name="alert-circle" size={14} color={COLORS.error} />
        <Text className="text-xs text-red-500 ml-1">{error}</Text>
      </View>
    )}
  </View>
);

const BookingFormScreen = ({ route, navigation }) => {
  const { destinationId } = route.params;
  const { getDestinationById } = useDestinations();
  const { addBooking } = useBookings();
  const destination = getDestinationById(destinationId);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    departureDate: '',
    guests: '1',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  if (!destination) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center p-6">
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.textLight} />
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

  const guestsCount = parseInt(form.guests, 10) || 1;
  const totalPrice = destination.price * guestsCount;

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const nameError = validateName(form.fullName);
    if (nameError) newErrors.fullName = nameError;

    const phoneError = validatePhone(form.phone);
    if (phoneError) newErrors.phone = phoneError;

    const dateError = validateDate(form.departureDate);
    if (dateError) newErrors.departureDate = dateError;

    const guestsError = validateGuests(form.guests);
    if (guestsError) newErrors.guests = guestsError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    setShowConfirmModal(true);
  };

  const confirmBooking = async () => {
    setIsSubmitting(true);
    try {
      const booking = {
        id: generateBookingId(),
        destinationId: destination.id,
        destinationName: destination.name,
        destinationImage: (destination.images && destination.images[0]) || destination.image,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        departureDate: form.departureDate.trim(),
        guests: parseInt(form.guests, 10),
        pricePerPerson: destination.price,
        totalPrice,
        notes: form.notes.trim(),
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      await addBooking(booking);
      navigation.navigate('BookingDetails', { booking });
    } catch {
      Alert.alert('Lỗi', 'Không thể lưu đặt tour. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3"
            accessibilityLabel="Quay lại"
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-[#20233A]">Đặt tour</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        >
          {/* Demo Notice */}
          <View className="bg-amber-50 rounded-xl p-3 mb-4 flex-row items-center">
            <Ionicons name="information-circle" size={20} color={COLORS.warning} />
            <Text className="text-xs text-amber-700 ml-2 flex-1">
              Đây là chức năng đặt tour demo, không thực hiện thanh toán thật
            </Text>
          </View>

          {/* Destination Info */}
          <View
            className="bg-white rounded-2xl p-4 mb-4"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text className="text-base font-bold text-[#20233A]">{destination.name}</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
              <Text className="text-sm text-gray-500 ml-1">
                {destination.country || destination.region || 'Việt Nam'}
              </Text>
            </View>
            <View className="flex-row items-center mt-2">
              <Ionicons name="cash-outline" size={14} color={COLORS.primary} />
              <Text className="text-sm text-[#6258E8] font-semibold ml-1">
                {formatCurrency(destination.price)} / người
              </Text>
            </View>
          </View>

          {/* Form */}
          <View
            className="bg-white rounded-2xl p-4"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <FormField label="Họ tên *" error={errors.fullName}>
              <TextInput
                className={`bg-gray-50 rounded-xl px-4 py-3 text-base text-[#20233A] ${
                  errors.fullName ? 'border border-red-400' : ''
                }`}
                placeholder="Nhập họ tên đầy đủ"
                placeholderTextColor={COLORS.textLight}
                value={form.fullName}
                onChangeText={(v) => updateField('fullName', v)}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
              />
            </FormField>

            <FormField label="Số điện thoại *" error={errors.phone}>
              <TextInput
                className={`bg-gray-50 rounded-xl px-4 py-3 text-base text-[#20233A] ${
                  errors.phone ? 'border border-red-400' : ''
                }`}
                placeholder="VD: 0912345678"
                placeholderTextColor={COLORS.textLight}
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(v) => updateField('phone', v)}
                returnKeyType="done"
              />
            </FormField>

            <FormField label="Ngày khởi hành * (DD/MM/YYYY)" error={errors.departureDate}>
              <TextInput
                className={`bg-gray-50 rounded-xl px-4 py-3 text-base text-[#20233A] ${
                  errors.departureDate ? 'border border-red-400' : ''
                }`}
                placeholder="VD: 25/12/2026"
                placeholderTextColor={COLORS.textLight}
                value={form.departureDate}
                onChangeText={(v) => updateField('departureDate', v)}
                keyboardType="numbers-and-punctuation"
                returnKeyType="done"
              />
            </FormField>

            <FormField label="Số người *" error={errors.guests}>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => {
                    const current = parseInt(form.guests, 10) || 1;
                    if (current > 1) updateField('guests', String(current - 1));
                  }}
                  className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center"
                >
                  <Ionicons name="remove" size={20} color={COLORS.text} />
                </TouchableOpacity>
                <TextInput
                  className={`flex-1 bg-gray-50 rounded-xl px-4 py-3 text-base text-center text-[#20233A] mx-2 ${
                    errors.guests ? 'border border-red-400' : ''
                  }`}
                  keyboardType="numeric"
                  value={form.guests}
                  onChangeText={(v) => updateField('guests', v)}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  onPress={() => {
                    const current = parseInt(form.guests, 10) || 0;
                    if (current < 50) updateField('guests', String(current + 1));
                  }}
                  className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center"
                >
                  <Ionicons name="add" size={20} color={COLORS.text} />
                </TouchableOpacity>
              </View>
            </FormField>

            <FormField label="Ghi chú">
              <TextInput
                className="bg-gray-50 rounded-xl px-4 py-3 text-base text-[#20233A]"
                placeholder="Thêm ghi chú (tùy chọn)"
                placeholderTextColor={COLORS.textLight}
                value={form.notes}
                onChangeText={(v) => updateField('notes', v)}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </FormField>
          </View>

          {/* Total */}
          <View
            className="bg-white rounded-2xl p-4 mt-4"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm text-gray-500">Giá mỗi người</Text>
              <Text className="text-sm text-[#20233A]">{formatCurrency(destination.price)}</Text>
            </View>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm text-gray-500">Số người</Text>
              <Text className="text-sm text-[#20233A]">× {guestsCount}</Text>
            </View>
            <View className="border-t border-gray-100 pt-2 mt-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-bold text-[#20233A]">Tổng tiền dự kiến</Text>
                <Text className="text-xl font-bold text-[#6258E8]">{formatCurrency(totalPrice)}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View className="px-4 py-4 bg-white border-t border-gray-100" style={{ paddingBottom: 34 }}>
          <PrimaryButton
            title="Xác nhận đặt tour (Demo)"
            onPress={handleSubmit}
            loading={isSubmitting}
            icon="checkmark-circle-outline"
          />
        </View>
      </KeyboardAvoidingView>

      {/* Modal xác nhận đặt tour đẹp mắt (hoạt động mượt mà 100% cả trên Web và Mobile) */}
      {showConfirmModal && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            zIndex: 9999,
          }}
        >
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 24,
              width: '100%',
              maxWidth: 420,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.15,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: '#EDE9FE',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                <Ionicons name="receipt-outline" size={30} color={COLORS.primary} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#20233A' }}>
                Xác nhận đặt tour
              </Text>
              <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4, textAlign: 'center' }}>
                Vui lòng kiểm tra lại thông tin chuyến đi của bạn
              </Text>
            </View>

            <View style={{ backgroundColor: '#F9FAFB', borderRadius: 16, padding: 14, marginBottom: 18 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 13, color: '#6B7280' }}>Điểm đến:</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#20233A' }}>{destination.name}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 13, color: '#6B7280' }}>Khách hàng:</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#20233A' }}>{form.fullName}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 13, color: '#6B7280' }}>Số điện thoại:</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#20233A' }}>{form.phone}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 13, color: '#6B7280' }}>Ngày khởi hành:</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#20233A' }}>{form.departureDate}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 13, color: '#6B7280' }}>Số người:</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#20233A' }}>{guestsCount} người</Text>
              </View>
              <View style={{ borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 8, marginTop: 4, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#20233A' }}>Tổng tiền:</Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#6258E8' }}>{formatCurrency(totalPrice)}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => setShowConfirmModal(false)}
                style={{
                  flex: 1,
                  backgroundColor: '#F3F4F6',
                  paddingVertical: 14,
                  borderRadius: 14,
                  alignItems: 'center',
                  marginRight: 10,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#4B5563' }}>Quay lại</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setShowConfirmModal(false);
                  confirmBooking();
                }}
                disabled={isSubmitting}
                style={{
                  flex: 1.4,
                  backgroundColor: '#6258E8',
                  paddingVertical: 14,
                  borderRadius: 14,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>
                  {isSubmitting ? 'Đang lưu...' : 'Xác nhận đặt'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default BookingFormScreen;
