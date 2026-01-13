import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatPrice';
import Button from '../../common/Button';

const WishlistDrawer = () => {
  const { 
    wishlist, 
    isWishlistOpen, 
    setIsWishlistOpen, 
    removeFromWishlist, 
    moveToCart 
  } = useStore();
  
  const [sortOption, setSortOption] = useState('date-desc');

  // Sort logic for wishlist
  const sortedWishlist = useMemo(() => {
    const items = [...wishlist];
    switch (sortOption) {
      case 'alpha-asc':
        return items.sort((a, b) => a.title.localeCompare(b.title));
      case 'date-desc':
      default:
        // Already date-asc by default push
        return items.sort((a, b) => b.addedAt - a.addedAt); 
    }
  }, [wishlist, sortOption]);

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-slide-in-right">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-[var(--color-paper-border)] flex items-center justify-between bg-[var(--color-paper-soft)]/50">
          <h2 className="text-lg md:text-xl font-bold text-[var(--color-text-main)] flex items-center gap-2">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Your Wishlist ({wishlist.length})
          </h2>
          <button 
             onClick={() => setIsWishlistOpen(false)}
             className="p-2 text-[var(--color-text-faint)] active:text-[var(--color-text-main)] md:hover:text-[var(--color-text-main)] active:bg-[var(--color-paper-soft)] md:hover:bg-[var(--color-paper-soft)] rounded-full transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
             aria-label="Close wishlist"
          >
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
               <div className="w-20 h-20 bg-[var(--color-paper-soft)] rounded-full flex items-center justify-center">
                 <svg className="w-10 h-10 text-[var(--color-text-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                 </svg>
               </div>
               <div>
                 <h3 className="text-lg font-bold text-[var(--color-text-main)]">Your wishlist is empty</h3>
                 <p className="text-[var(--color-text-muted)]">Save items you love for later.</p>
               </div>
               <Button onClick={() => setIsWishlistOpen(false)} variant="outline">
                 Discover Books
               </Button>
            </div>
          ) : (
            <div className="space-y-6">
               {/* Sort Controls */}
               <div className="flex justify-end">
                  <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="text-sm border-none bg-transparent text-[var(--color-text-muted)] font-medium focus:ring-0 cursor-pointer hover:text-primary"
                  >
                    <option value="date-desc">Newest First</option>
                    <option value="alpha-asc">Alphabetical (A-Z)</option>
                  </select>
               </div>

               {/* Items List */}
               <div className="space-y-4">
                 {sortedWishlist.map((item) => (
                   <div key={item.id} className="flex gap-4 p-4 bg-white border border-[var(--color-paper-border)] rounded-xl hover:shadow-sm transition-shadow">
                      <div className="w-20 h-24 bg-[var(--color-paper-soft)] rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-[var(--color-text-main)] line-clamp-1">{item.title}</h4>
                          <button 
                            onClick={() => removeFromWishlist(item.id)}
                            className="text-[var(--color-text-faint)] active:text-red-500 md:hover:text-red-500 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                            title="Remove"
                            aria-label="Remove from wishlist"
                          >
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                             </svg>
                          </button>
                        </div>
                        <p className="text-xs text-[var(--color-text-muted)] mb-2">{item.author}</p>
                        <p className="text-sm font-bold text-[var(--color-text-main)] mb-auto">{formatPrice(item.price)}</p>
                        
                        <Button 
                          size="sm" 
                          variant="secondary"
                          className="mt-2 w-full text-xs touch-manipulation min-h-[44px] md:min-h-0"
                          onClick={() => moveToCart(item)}
                          disabled={!item.inStock}
                        >
                          {item.inStock ? 'Move to Cart' : 'Out of Stock'}
                        </Button>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistDrawer;
