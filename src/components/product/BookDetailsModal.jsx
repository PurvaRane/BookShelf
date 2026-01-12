import React, { useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatPrice';
import Button from '../../common/Button';

const BookDetailsModal = ({ book, onClose }) => {
  const modalRef = useRef();
  const { addToCart, addToWishlist, removeFromWishlist, wishlist, cart } = useStore();

  const inWishlist = wishlist.some(item => item.id === book.id);
  const inCart = cart.some(item => item.id === book.id);

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent scroll on body when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!book) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#6B2E2E]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        ref={modalRef}
        className="relative bg-[#FAF7F3] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl flex flex-col md:flex-row overflow-hidden animate-fade-in-up border border-[#E3DDD6]"
      >
        {/* Close Button Mobile */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full md:hidden text-[#5B2C2C]"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image Section */}
        <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-[#FAF7F3] flex-shrink-0 p-8 flex items-center justify-center">
          <img 
            src={book.image} 
            alt={book.title}
            className="w-auto h-full max-h-[400px] object-cover shadow-xl rounded-[2px]"
          />
          {!book.inStock && (
            <div className="absolute inset-0 bg-[#FAF7F3]/80 flex items-center justify-center">
              <span className="bg-[#5B2C2C] text-[#FAF7F3] font-serif font-bold px-6 py-2 uppercase tracking-widest shadow-lg border border-[#B89B5E]">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="flex-1 p-6 md:p-10 flex flex-col bg-white">
          <div className="flex justify-between items-start mb-4">
             <div>
               <span className="inline-block px-3 py-1 bg-[#F6F1EB] text-[#6B2E2E] border border-[#E8E4DD] rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                 {book.category}
               </span>
               <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1F2937] leading-tight mb-2">
                 {book.title}
               </h2>
               <p className="text-xl text-[#57534E] font-light italic">by {book.author}</p>
             </div>
             
             {/* Close Button Desktop */}
             <button 
                onClick={onClose}
                className="hidden md:block p-2 text-[#D6D3D1] hover:text-[#6B2E2E] transition-colors"
             >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
             </button>
          </div>

          <div className="flex items-center gap-1 mb-8">
            <div className="flex">
               {[...Array(5)].map((_, i) => (
                 <svg key={i} className={`w-5 h-5 ${i < Math.floor(book.rating) ? 'text-[#C2A14D] fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                 </svg>
               ))}
            </div>
            <span className="text-[#57534E] font-medium ml-2 text-sm">({book.rating})</span>
          </div>

          {/* Scrollable Description */}
          <div className="flex-1 overflow-y-auto pr-2 mb-8 text-[#57534E] leading-loose text-lg border-t border-b border-[#F6F1EB] py-6 font-serif">
            {book.description || "No description available for this book."}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto pt-2">
            <div className="text-3xl font-serif font-bold text-[#2F5D50] mr-auto">
              {formatPrice(book.price)}
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              {/* Wishlist Button (Visual) */}
              <button 
                onClick={handleWishlistToggle}
                className={`p-3 border rounded-sm transition-colors ${
                  inWishlist 
                    ? 'border-[#6B2E2E] text-[#6B2E2E] bg-[#6B2E2E]/5' 
                    : 'border-[#E8E4DD] text-[#A8A29E] hover:text-[#6B2E2E] hover:border-[#6B2E2E]'
                }`}
              >
                <svg className={`w-6 h-6 ${inWishlist ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              <Button 
                size="lg" 
                className={`flex-1 sm:w-48 font-bold tracking-widest uppercase rounded-sm ${book.inStock ? 'bg-[#1F2937] hover:bg-[#6B2E2E] text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}
                disabled={!book.inStock}
                onClick={() => {
                   if (book.inStock) {
                     addToCart(book);
                   }
                }}
              >
                {book.inStock ? (inCart ? 'ADD ANOTHER' : 'ADD TO CART') : 'SOLD OUT'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsModal;
