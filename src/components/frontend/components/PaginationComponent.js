import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTailwind } from 'tailwind-rn';

const Pagination = ({ 
  data, 
  limit = 0, 
  keepLength = false, 
  onPageChange,
  prevLabel = 'Previous',
  nextLabel = 'Next',
  renderPrevNav,
  renderNextNav
}) => {
  const tailwind = useTailwind();
  
  if (!data || data.total <= data.per_page) {
    return null;
  }

  const totalPages = Math.ceil(data.total / data.per_page);
  const currentPage = data.current_page;
  
  const getPageRange = () => {
    const range = [];
    const maxVisible = 5; // Number of visible page buttons
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(totalPages, start + maxVisible - 1);
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      if (start > 1) {
        range.push(1);
        if (start > 2) {
          range.push('...');
        }
      }
      
      for (let i = start; i <= end; i++) {
        if (i > 0 && i <= totalPages) {
          range.push(i);
        }
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) {
          range.push('...');
        }
        range.push(totalPages);
      }
    }
    
    return range;
  };

  const handlePageChange = (page) => {
    if (page === '...' || page === currentPage) return;
    onPageChange(page);
  };

  const renderPageButton = (page, index) => {
    if (page === '...') {
      return (
        <Text key={`ellipsis-${index}`} style={tailwind('w-10 h-10 leading-10 text-center')}>
          ...
        </Text>
      );
    }
    
    return (
      <TouchableOpacity
        key={page}
        onPress={() => handlePageChange(page)}
        style={[
          tailwind('w-10 h-10 rounded-full items-center justify-center mx-1'),
          currentPage === page 
            ? tailwind('bg-blue-500') 
            : tailwind('bg-gray-100')
        ]}
      >
        <Text style={[
          tailwind('font-medium'),
          currentPage === page 
            ? tailwind('text-white') 
            : tailwind('text-gray-800')
        ]}>
          {page}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={tailwind('flex-row items-center justify-center py-4 mb-12')}>
      <TouchableOpacity
        onPress={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={[
          tailwind('px-4 py-2 rounded-full mx-1 items-center justify-center'),
          currentPage === 1 
            ? tailwind('bg-gray-300') 
            : tailwind('bg-gray-100')
        ]}
      >
        {renderPrevNav ? renderPrevNav() : (
          <Text style={tailwind('font-medium text-gray-800')}>
            {prevLabel}
          </Text>
        )}
      </TouchableOpacity>

      <View style={tailwind('flex-row mx-2')}>
        {getPageRange().map(renderPageButton)}
      </View>

      <TouchableOpacity
        onPress={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={[
          tailwind('px-4 py-2 rounded-full mx-1 items-center justify-center'),
          currentPage === totalPages 
            ? tailwind('bg-gray-300') 
            : tailwind('bg-gray-100')
        ]}
      >
        {renderNextNav ? renderNextNav() : (
          <Text style={tailwind('font-medium text-gray-800')}>
            {nextLabel}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Pagination;