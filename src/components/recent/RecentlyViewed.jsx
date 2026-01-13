import React, { useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatPrice';
import { BOOKS } from '../../data/books';

const RecentlyViewed = () => {
  const { recentlyViewed: items } = useStore();

  // Trending: Top 3 highest rated books (excluding what's already in history if possible)
  const trending = useMemo(() => {
    return [...BOOKS]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }, []);

  // Recommendations: Based on the category of the most recently viewed book
  const recommendations = useMemo(() => {
    if (items.length === 0) return BOOKS.slice(5, 8); // Fallback
    const lastCategory = items[0].category;
    return BOOKS
      .filter(b => b.category === lastCategory && !items.find(i => i.id === b.id))
      .slice(0, 3);
  }, [items]);

  const BookItem = ({ book }) => (
    <div className="flex gap-3 group cursor-pointer py-1">
      <div className="w-10 h-14 flex-shrink-0 shadow-sm border border-[#E3DDD6] overflow-hidden rounded-[1px]">
          <img
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover md:group-hover:scale-110 transition-transform duration-500"
          />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-serif font-bold text-[#1F2933] line-clamp-1 md:group-hover:text-[#5B2C2C] transition-colors leading-tight mb-0.5">
          {book.title}
        </p>
        <p className="text-[9px] text-[#6B6A67] italic mb-1 leading-none">
          {book.author}
        </p>
        <p className="text-[10px] text-[#2F5D50] font-bold">
          {formatPrice(book.price)}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Recently Viewed */}
      <section>
        <div className="flex items-center justify-between mb-4 border-b border-[#FAF7F3] pb-2">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B89B5E]">
              Recently Viewed
            </h3>
            <span className="text-[9px] text-[#9A9895] font-serif italic">{items.length} titles</span>
        </div>

        {items.length === 0 ? (
          <div className="py-6 text-center border border-dashed border-[#E3DDD6] rounded-sm bg-[#FAF7F3]/30">
              <p className="text-[10px] text-[#9A9895] font-serif italic">History empty</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(book => <BookItem key={book.id} book={book} />)}
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="h-[1px] bg-[#E3DDD6]/50 mx-4" />

      {/* Trending */}
      <section>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B89B5E] mb-4">
          Trending This Week
        </h3>
        <div className="space-y-3">
          {trending.map(book => <BookItem key={book.id} book={book} />)}
        </div>
      </section>

      {/* Divider */}
      <div className="h-[1px] bg-[#E3DDD6]/50 mx-4" />

      {/* You Might Like */}
      {recommendations.length > 0 && (
        <section>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B89B5E] mb-4">
            You Might Like
          </h3>
          <div className="space-y-3">
            {recommendations.map(book => <BookItem key={book.id} book={book} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default RecentlyViewed;


