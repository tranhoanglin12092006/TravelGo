import { useState, useMemo } from 'react';
import destinations from '../data/destinations.json';

export const useDestinations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000000 });

  // Danh sách địa điểm nổi bật cho FeaturedCarousel
  const featuredDestinations = useMemo(() => {
    return destinations.filter((d) => d.featured === true || d.rating >= 4.8);
  }, []);

  // Đếm số lượng tour theo danh mục cho CategoryCarousel
  const destinationCounts = useMemo(() => {
    const counts = { all: destinations.length };
    destinations.forEach((d) => {
      counts[d.category] = (counts[d.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Lọc và sắp xếp
  const filteredDestinations = useMemo(() => {
    let result = [...destinations];

    // Lọc theo từ khóa tìm kiếm (tên, mô tả hoặc quốc gia/khu vực)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          (d.country && d.country.toLowerCase().includes(query)) ||
          d.description.toLowerCase().includes(query)
      );
    }

    // Lọc theo danh mục
    if (selectedCategory !== 'all') {
      result = result.filter((d) => d.category === selectedCategory);
    }

    // Lọc theo khoảng giá
    result = result.filter(
      (d) => d.price >= priceRange.min && d.price <= priceRange.max
    );

    // Sắp xếp
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy, priceRange]);

  const getDestinationById = (id) => {
    return destinations.find((d) => d.id === id);
  };

  // Lấy danh sách tour liên quan (cùng danh mục, loại trừ tour hiện tại)
  const getRelatedDestinations = (currentId, category) => {
    const related = destinations.filter(
      (d) => d.id !== currentId && (category ? d.category === category : true)
    );
    return related.length > 0 ? related : destinations.filter((d) => d.id !== currentId);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('default');
    setPriceRange({ min: 0, max: 10000000 });
  };

  return {
    destinations: filteredDestinations,
    allDestinations: destinations,
    featuredDestinations,
    destinationCounts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    clearFilters,
    getDestinationById,
    getRelatedDestinations,
  };
};
