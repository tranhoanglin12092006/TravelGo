import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../hooks/useFavorites';
import DestinationCard from '../components/DestinationCard';
import EmptyState from '../components/EmptyState';
import { COLORS } from '../constants/theme';

const FavoritesScreen = ({ navigation }) => {
  const { favoriteDestinations, toggleFavorite, isFavorite, count } = useFavorites();

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      {/* Header */}
      <View className="px-4 pt-4 pb-3">
        <Text className="text-2xl font-bold text-[#20233A]">Yêu thích</Text>
        <Text className="text-sm text-gray-500 mt-1">
          {count > 0 ? `${count} địa điểm đã lưu` : 'Chưa có địa điểm yêu thích'}
        </Text>
      </View>

      <FlatList
        data={favoriteDestinations}
        keyExtractor={(item) => `fav-${item.id}`}
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
            icon="heart-outline"
            title="Chưa có yêu thích"
            message="Nhấn vào biểu tượng trái tim để lưu những địa điểm bạn thích"
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

export default FavoritesScreen;
