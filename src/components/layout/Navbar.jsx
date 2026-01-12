import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import Input from '../../common/Input';

const Navbar = ({ 
  onNavigate, 
  searchQuery = '', 
  setSearchQuery = () => {}, 
  searchSuggestions = [], 
  isScrolled: isScrolledProp 
}) => {
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const { cartCount, wishlistCount, setIsCartOpen, setIsWishlistOpen } = useStore();
  const searchContainerRef = useRef(null);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSearchOverlay(false);
      }
    };
    if (showSearchOverlay) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearchOverlay]);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 border-b border-[#B89B5E]/30 ${
      isScrolledProp ? 'bg-[#5B2C2C]/95 backdrop-blur-md shadow-lg py-1 md:py-2' : 'bg-[#5B2C2C] py-2 md:py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center bg-transparent">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 md:gap-3 group bg-transparent border-none p-0 cursor-pointer"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#FAF7F3] rounded-sm flex items-center justify-center shadow-lg group-hover:bg-[#B89B5E] transition-colors duration-500">
              <span className="text-xl md:text-2xl pt-1">📖</span>
            </div>
            <div className="flex flex-col items-start bg-transparent">
              <span className="font-serif text-lg md:text-2xl font-bold text-[#FAF7F3] tracking-tight leading-none group-hover:text-[#B89B5E] transition-colors">
                BookShelf
              </span>
              <span className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-[#B89B5E] font-medium mt-1 group-hover:text-[#FAF7F3] transition-colors">
                Premium Editions
              </span>
            </div>
          </button>

          {/* Icons & Dynamic Search */}
          <div className="flex items-center gap-3 md:gap-6 bg-transparent">
             {/* Search Toggle (Only on Scroll) */}
             <div className={`relative transition-all duration-300 ${isScrolledProp ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`} ref={searchContainerRef}>
               <button 
                 onClick={() => setShowSearchOverlay(!showSearchOverlay)}
                 className={`p-2 rounded-full transition-all cursor-pointer border-none bg-transparent ${showSearchOverlay ? 'bg-[#FAF7F3] text-[#5B2C2C]' : 'text-[#FAF7F3] hover:bg-[#FAF7F3]/10'}`}
               >
                 <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                 </svg>
               </button>

               {/* Integrated Search Overlay */}
               {showSearchOverlay && (
                 <div className="absolute top-full right-0 mt-2 w-[280px] md:w-[400px] bg-white rounded-lg shadow-2xl border border-[#E3DDD6] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                   <div className="p-3">
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-4 w-4 md:h-5 md:w-5 text-[#9A9895]" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <Input
                          autoFocus
                          placeholder="Fuzzy search books..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 py-2 bg-[#FAF7F3] border-[#E3DDD6] focus:border-[#5B2C2C] focus:ring-1 focus:ring-[#5B2C2C] transition-all text-sm w-full"
                        />
                     </div>
                   </div>

                   {searchSuggestions.length > 0 && (
                     <div className="border-t border-[#E3DDD6]">
                        <p className="px-4 py-2 text-[10px] text-[#9A9895] bg-[#FAF7F3] border-b border-[#E3DDD6] font-bold uppercase tracking-widest">
                          Suggestions
                        </p>
                        {searchSuggestions.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSearchQuery(item.value);
                              setShowSearchOverlay(false);
                            }}
                            className="w-full text-left px-4 py-3 text-xs md:text-sm text-[#1F2933] hover:bg-[#FAF7F3] transition-colors border-b border-[#E3DDD6] last:border-b-0"
                          >
                            {item.value}
                          </button>
                        ))}
                     </div>
                   )}
                 </div>
               )}
             </div>

             {/* Wishlist */}
             <button 
               onClick={() => setIsWishlistOpen(true)}
               className="relative group p-2 rounded-full hover:bg-[#FAF7F3]/10 transition-all cursor-pointer border-none bg-transparent"
             >
               <svg className="w-5 h-5 md:w-6 md:h-6 text-[#FAF7F3] group-hover:text-[#B89B5E] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
               </svg>
               {wishlistCount > 0 && (
                 <span className="absolute -top-1 -right-1 bg-[#B89B5E] text-[#5B2C2C] text-[8px] md:text-[10px] font-bold w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-[#5B2C2C]">
                   {wishlistCount}
                 </span>
               )}
             </button>

             {/* Cart */}
             <button 
               onClick={() => setIsCartOpen(true)}
               className="relative group p-2 rounded-full hover:bg-[#FAF7F3]/10 transition-all cursor-pointer border-none bg-transparent"
             >
               <svg className="w-5 h-5 md:w-6 md:h-6 text-[#FAF7F3] group-hover:text-[#B89B5E] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
               </svg>
               {cartCount > 0 && (
                 <span className="absolute -top-1 -right-1 bg-[#B89B5E] text-[#5B2C2C] text-[8px] md:text-[10px] font-bold w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-[#5B2C2C]">
                   {cartCount}
                 </span>
               )}
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
