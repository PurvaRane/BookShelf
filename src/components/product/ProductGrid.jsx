import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ books, onBookClick }) => {
  // Guard: Early return for invalid or empty books array
  // WHY: Prevents rendering errors and provides friendly empty state
  if (!Array.isArray(books) || books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="bg-[var(--color-paper-soft)] rounded-full p-6 mb-4">
          <svg className="w-12 h-12 text-[var(--color-text-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 19.33 5.754 18 7.5 18s3.332 1.33 4.5 2.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 19.33 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-1">No books found</h3>
        <p className="text-gray-500 max-w-sm">
          We couldn't find any books matching your search. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
      {books
        .filter(book => book && book.id) // Guard: Filter out invalid books
        .map((book) => (
          <ProductCard 
            key={book.id} 
            book={book} 
            onCardClick={onBookClick}
          />
        ))}
    </div>
  );
};

export default ProductGrid;
