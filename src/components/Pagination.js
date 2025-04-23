import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          onPress={() => onPageChange(i)}
          className={`w-10 h-10 rounded-full justify-center items-center mx-1 ${
            i === currentPage ? 'bg-primary' : 'bg-gray-200'
          }`}
        >
          <Text className={`${i === currentPage ? 'text-white' : 'text-gray-700'}`}>
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    return pages;
  };

  return (
    <View className="flex-row justify-center items-center my-4">
      {currentPage > 1 && (
        <TouchableOpacity
          onPress={() => onPageChange(currentPage - 1)}
          className="w-10 h-10 rounded-full bg-gray-200 justify-center items-center mx-1"
        >
          <Text>‹</Text>
        </TouchableOpacity>
      )}
      
      {renderPageNumbers()}
      
      {currentPage < totalPages && (
        <TouchableOpacity
          onPress={() => onPageChange(currentPage + 1)}
          className="w-10 h-10 rounded-full bg-gray-200 justify-center items-center mx-1"
        >
          <Text>›</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Pagination;