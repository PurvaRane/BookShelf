import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatPrice';

const ProductCard = ({ book, onCardClick }) => {
  // Guard: Return early if book is invalid
  if (!book || typeof book !== 'object') {
    return null;
  }

  // Destructure with fallback values to prevent undefined errors
  const { 
    title = 'Untitled', 
    author = 'Unknown Author', 
    category = 'Uncategorized', 
    price = 0, 
    rating = 0, 
    image = '', 
    inStock = false 
  } = book;

  const { addToCart, addToWishlist, removeFromWishlist, wishlist, cart } = useStore();
  
  // Guard: Ensure cart and wishlist are arrays before using .some()
  const inCart = Array.isArray(cart) && cart.some(item => item?.id === book.id);
  const inWishlist = Array.isArray(wishlist) && wishlist.some(item => item?.id === book.id);

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };

  return (
    <div 
      onClick={() => onCardClick && onCardClick(book)}
      className="group relative bg-white rounded-sm border border-[#E3DDD6] shadow-sm active:bg-[#FAF7F3] md:hover:shadow-lg transition-all duration-300 flex flex-col h-full cursor-pointer md:hover:-translate-y-1 overflow-hidden touch-manipulation"
    >
      {/* Book Cover Area */}
      <div className="relative aspect-[3/4] bg-[#FAF7F3] p-3 md:p-4 flex items-center justify-center overflow-hidden border-b border-[#E3DDD6]">
        
        {/* The Book Image */}
        {image ? (
          <img
            src={image}
            alt={title}
            className={`
              w-3/4 h-auto shadow-md transform transition-transform duration-500 md:group-hover:scale-[1.03]
              ${!inStock ? 'opacity-50 grayscale' : ''}
            `}
            loading="lazy"
            onError={(e) => {
              // Fallback: Hide broken images gracefully
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-3/4 h-auto flex items-center justify-center text-[#9A9895] text-xs">
            No Image
          </div>
        )}
        
        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#FAF7F3]/60 backdrop-blur-[1px]">
            <span className="font-serif text-[#5B2C2C] text-[10px] md:text-sm font-bold border border-[#5B2C2C] px-3 py-1 tracking-widest uppercase bg-white">
              Sold Out
            </span>
          </div>
        )}

        {/* Wishlist Action */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-2.5 md:p-2 rounded-full bg-white/40 md:bg-transparent active:bg-white/80 md:hover:bg-white/80 transition-colors z-10 touch-manipulation min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg 
            className={`w-5 h-5 transition-colors ${inWishlist ? 'fill-[#5B2C2C] text-[#5B2C2C]' : 'fill-none text-[var(--color-text-faint)] md:hover:text-[#5B2C2C]'}`} 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Details Area */}
      <div className="p-3 md:p-4 flex flex-col flex-grow bg-white">
        
        <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-[#B89B5E] font-bold mb-1 md:mb-2 block leading-none">
          {category}
        </span>

        <h3 className="font-serif text-sm md:text-base text-[var(--color-text-main)] leading-snug mb-1 line-clamp-2 md:group-hover:text-[#5B2C2C] transition-colors">
          {title}
        </h3>
        
        <p className="text-[10px] md:text-xs text-[var(--color-text-muted)] italic mb-3">
          {author}
        </p>

        {/* Bottom Metadata - Always visible */}
        <div className="mt-auto flex items-end justify-between border-t border-[#E3DDD6] pt-3">
          <div className="flex flex-col">
            <span className="text-base md:text-lg font-serif text-[#2F5D50] font-bold leading-none mb-1">
              {formatPrice(price)}
            </span>
             <div className="flex items-center gap-1 opacity-60">
              <svg className="w-3 h-3 text-[#B89B5E] fill-current" viewBox="0 0 20 20">
                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-[10px] text-[var(--color-text-muted)] font-bold">{rating}</span>
            </div>
          </div>
          
          <button 
            disabled={!inStock}
            onClick={(e) => {
              e.stopPropagation();
              if (inStock) addToCart(book);
            }}
            className={`
              px-3 py-2.5 md:px-3 md:py-1.5 rounded-sm text-[10px] font-bold tracking-tight transition-all uppercase border touch-manipulation min-h-[44px] md:min-h-0 flex items-center justify-center
              ${inStock 
                ? 'text-[#5B2C2C] bg-[#FAF7F3] border-[#E3DDD6] active:bg-[#5B2C2C] active:text-white md:hover:bg-[#5B2C2C] md:hover:text-white' 
                : 'text-[#9A9895] bg-transparent border-transparent cursor-not-allowed'}
            `}
            aria-label={inStock ? (inCart ? "Add another to cart" : "Add to cart") : "Out of stock"}
          >
            {inStock ? (inCart ? 'Again' : 'Add') : 'Out'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
