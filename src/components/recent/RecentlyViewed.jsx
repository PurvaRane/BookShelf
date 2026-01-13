import React, { useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatPrice';
import { BOOKS } from '../../data/books';

const RecentlyViewed = () => {
  const { recentlyViewed: items } = useStore();

  // Trending: Top 3 highest rated books
  // WHY useMemo: Prevents recalculating on every render, only when BOOKS changes
  const trending = useMemo(() => {
    // Guard: Ensure BOOKS is a valid array
    if (!Array.isArray(BOOKS) || BOOKS.length === 0) {
      return [];
    }

    return [...BOOKS]
      .filter(book => book && book.rating !== undefined) // Guard: Skip invalid books
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3);
  }, []);

  // Recommendations: Based on the category of the most recently viewed book
  // WHY useMemo: Only recalculates when items (recently viewed) changes
  const recommendations = useMemo(() => {
    // Guard: Ensure BOOKS is a valid array
    if (!Array.isArray(BOOKS) || BOOKS.length === 0) {
      return [];
    }

    // Guard: If no recently viewed items, return fallback recommendations
    if (!Array.isArray(items) || items.length === 0) {
      return BOOKS.slice(5, 8).filter(book => book); // Guard: Filter out undefined
    }

    // Get category from most recently viewed book
    const lastCategory = items[0]?.category;
    
    // Guard: If no category found, return fallback
    if (!lastCategory) {
      return BOOKS.slice(5, 8).filter(book => book);
    }

    return BOOKS
      .filter(book => book && book.category === lastCategory) // Guard: Skip invalid books
      .filter(book => !items.find(i => i?.id === book.id)) // Exclude already viewed
      .slice(0, 3);
  }, [items]);

  const BookItem = ({ book }) => {
    // Guard: Return null if book is invalid
    if (!book || typeof book !== 'object') {
      return null;
    }

    const { title = 'Untitled', author = 'Unknown', price = 0, image = '' } = book;

    return (
      <div className="flex gap-3 group cursor-pointer py-2 md:py-1 touch-manipulation active:opacity-70 transition-opacity">
        <div className="w-12 h-16 md:w-10 md:h-14 flex-shrink-0 shadow-sm border border-[#E3DDD6] overflow-hidden rounded-[1px] bg-[#FAF7F3]">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover md:group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                // Fallback: Hide broken images gracefully
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#9A9895] text-[8px] text-center">
              No Image
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] md:text-[11px] font-serif font-bold text-[#1F2933] line-clamp-2 md:line-clamp-1 md:group-hover:text-[#5B2C2C] transition-colors leading-tight mb-1 md:mb-0.5">
            {title}
          </p>
          <p className="text-[10px] md:text-[9px] text-[#6B6A67] italic mb-1.5 md:mb-1 leading-tight md:leading-none">
            {author}
          </p>
          <p className="text-[11px] md:text-[10px] text-[#2F5D50] font-bold">
            {formatPrice(price)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Recently Viewed */}
      <section>
        <div className="flex items-center justify-between mb-4 md:mb-4 border-b border-[#FAF7F3] pb-2">
            <h3 className="text-[11px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#B89B5E]">
              Recently Viewed
            </h3>
            <span className="text-[10px] md:text-[9px] text-[#9A9895] font-serif italic">{items.length} titles</span>
        </div>

        {items.length === 0 ? (
          <div className="py-6 md:py-6 text-center border border-dashed border-[#E3DDD6] rounded-sm bg-[#FAF7F3]/30">
              <p className="text-[11px] md:text-[10px] text-[#9A9895] font-serif italic">History empty</p>
          </div>
        ) : (
          <div className="space-y-2 md:space-y-3">
            {items.map(book => <BookItem key={book.id} book={book} />)}
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="h-[1px] bg-[#E3DDD6]/50 mx-2 md:mx-4" />

      {/* Trending */}
      <section>
        <h3 className="text-[11px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#B89B5E] mb-4">
          Trending This Week
        </h3>
        <div className="space-y-2 md:space-y-3">
          {trending.map(book => <BookItem key={book.id} book={book} />)}
        </div>
      </section>

      {/* Divider */}
      <div className="h-[1px] bg-[#E3DDD6]/50 mx-2 md:mx-4" />

      {/* You Might Like */}
      {recommendations.length > 0 && (
        <section>
          <h3 className="text-[11px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#B89B5E] mb-4">
            You Might Like
          </h3>
          <div className="space-y-2 md:space-y-3">
            {recommendations.map(book => <BookItem key={book.id} book={book} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default RecentlyViewed;


