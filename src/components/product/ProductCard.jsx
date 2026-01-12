import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatPrice';
import Button from '../../common/Button';

const ProductCard = ({ book, onCardClick }) => {
  const { title, author, category, price, rating, image, inStock } = book;
  const { addToCart, addToWishlist, removeFromWishlist, wishlist, cart } = useStore();
  
  const inCart = cart.some(item => item.id === book.id);
  const inWishlist = wishlist.some(item => item.id === book.id);

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
      className="group relative bg-white rounded-md border border-[#E3DDD6] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full cursor-pointer hover:-translate-y-1 overflow-hidden"
    >
      {/* Book Cover Area (Fixed 3:4 aspect ratio, Parchment background) */}
      <div className="relative aspect-[3/4] bg-[#FAF7F3] p-4 flex items-center justify-center overflow-hidden border-b border-[#E3DDD6]">
        
        {/* The Book Image */}
        <img
          src={image}
          alt={title}
          className={`
            w-3/4 h-auto shadow-md transform transition-transform duration-500 group-hover:scale-[1.03]
            ${!inStock ? 'opacity-50 grayscale' : ''}
          `}
          loading="lazy"
        />
        
        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#FAF7F3]/60 backdrop-blur-[1px]">
            <span className="font-serif text-[#5B2C2C] text-sm font-bold border border-[#5B2C2C] px-3 py-1 tracking-widest uppercase bg-white">
              Sold Out
            </span>
          </div>
        )}

        {/* Wishlist Action - Subtle top right */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-2 rounded-full hover:bg-white/80 transition-colors z-10"
        >
          <svg 
            className={`w-5 h-5 transition-colors ${inWishlist ? 'fill-[#5B2C2C] text-[#5B2C2C]' : 'fill-none text-gray-400 hover:text-[#5B2C2C]'}`} 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Details Area - Minimal & Clean */}
      <div className="p-4 flex flex-col flex-grow bg-white">
        
        {/* Category (Text only, no badge) */}
        <span className="text-[10px] uppercase tracking-widest text-[#B89B5E] font-bold mb-2 block">
          {category}
        </span>

        {/* Title */}
        <h3 className="font-serif text-base text-[#1F2933] leading-snug mb-1 line-clamp-2 group-hover:text-[#5B2C2C] transition-colors">
          {title}
        </h3>
        
        {/* Author */}
        <p className="text-xs text-[#6B6A67] italic mb-4">
          by {author}
        </p>

        {/* Bottom Metadata */}
        <div className="mt-auto flex items-end justify-between border-t border-[#F2ECE6] pt-3">
          <div className="flex flex-col">
            <span className="text-lg font-serif text-[#1F6F54] font-medium">
              {formatPrice(price)}
            </span>
             <div className="flex items-center gap-1 mt-0.5 opacity-60">
              <svg className="w-3 h-3 text-[#B89B5E] fill-current" viewBox="0 0 20 20">
                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-[10px] text-gray-500 font-medium">{rating}</span>
            </div>
          </div>
          
          <button 
            disabled={!inStock}
            onClick={(e) => {
              e.stopPropagation();
              if (inStock) addToCart(book);
            }}
            className={`
              px-3 py-1.5 rounded-sm text-xs font-bold tracking-wide transition-all uppercase
              ${inStock 
                ? 'text-[#5B2C2C] hover:bg-[#FAF7F3] border border-transparent hover:border-[#5B2C2C]' 
                : 'text-gray-300 cursor-not-allowed'}
            `}
          >
            {inStock ? (inCart ? 'Add Another' : 'Add to Cart') : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
