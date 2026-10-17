import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { formatCurrency } from '../utils/formatCurrency';

const DestinationCard = ({ destination, onPress, onToggleFavorite, isFavorite }) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = (destination.images && destination.images.length > 0)
    ? destination.images[0]
    : destination.image;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="bg-white rounded-2xl mb-4 mx-4 overflow-hidden border border-gray-100"
      style={{
        shadowColor: '#20233A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
      }}
      accessibilityLabel={`Địa điểm ${destination.name}`}
    >
      <View className="relative">
        {imageError || !imageUrl ? (
          <View className="w-full h-48 bg-gray-200 items-center justify-center">
            <Ionicons name="image-outline" size={40} color={COLORS.textLight} />
            <Text className="text-xs text-gray-400 mt-1">Không tải được ảnh</Text>
          </View>
        ) : (
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-48"
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        )}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onToggleFavorite && onToggleFavorite(destination.id)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 items-center justify-center shadow-sm"
          accessibilityLabel={isFavorite ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite ? COLORS.error : COLORS.textSecondary}
          />
        </TouchableOpacity>

        {destination.featured && (
          <View className="absolute top-3 left-3 bg-[#6258E8] px-2.5 py-0.5 rounded-full flex-row items-center">
            <Ionicons name="sparkles" size={12} color="#FFFFFF" />
            <Text className="text-white text-[11px] font-bold ml-1">Nổi bật</Text>
          </View>
        )}
      </View>
      <View className="p-4">
        <Text className="text-base font-bold text-[#20233A]" numberOfLines={1}>
          {destination.name}
        </Text>
        <View className="flex-row items-center mt-1">
          <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
          <Text className="text-xs text-gray-500 ml-1">
            {destination.country || destination.region || 'Việt Nam'}
          </Text>
          <Text className="text-gray-300 mx-1.5">•</Text>
          <Ionicons name="time-outline" size={13} color={COLORS.textSecondary} />
          <Text className="text-xs text-gray-500 ml-1">{destination.duration}</Text>
        </View>
        <View className="flex-row items-center justify-between mt-3 pt-2 border-t border-gray-50">
          <View className="flex-row items-center">
            <Ionicons name="star" size={14} color={COLORS.star} />
            <Text className="text-sm font-semibold text-[#20233A] ml-1">
              {destination.rating}
            </Text>
          </View>
          <Text className="text-sm font-bold text-[#6258E8]">
            {formatCurrency(destination.price)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DestinationCard;
