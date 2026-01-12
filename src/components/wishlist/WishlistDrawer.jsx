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
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Your Wishlist ({wishlist.length})
          </h2>
          <button 
             onClick={() => setIsWishlistOpen(false)}
             className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                 <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                 </svg>
               </div>
               <div>
                 <h3 className="text-lg font-bold text-gray-900">Your wishlist is empty</h3>
                 <p className="text-gray-500">Save items you love for later.</p>
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
                    className="text-sm border-none bg-transparent text-gray-500 font-medium focus:ring-0 cursor-pointer hover:text-primary"
                  >
                    <option value="date-desc">Newest First</option>
                    <option value="alpha-asc">Alphabetical (A-Z)</option>
                  </select>
               </div>

               {/* Items List */}
               <div className="space-y-4">
                 {sortedWishlist.map((item) => (
                   <div key={item.id} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                      <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                          <button 
                            onClick={() => removeFromWishlist(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove"
                          >
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                             </svg>
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{item.author}</p>
                        <p className="text-sm font-bold text-gray-900 mb-auto">{formatPrice(item.price)}</p>
                        
                        <Button 
                          size="sm" 
                          variant="secondary"
                          className="mt-2 w-full text-xs"
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
