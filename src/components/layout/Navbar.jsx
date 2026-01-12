import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';

const Navbar = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount, wishlistCount, setIsCartOpen, setIsWishlistOpen } = useStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 border-b border-[#B89B5E]/30 ${
      isScrolled ? 'bg-[#5B2C2C]/95 backdrop-blur-md shadow-lg py-2' : 'bg-[#5B2C2C] py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center bg-transparent">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 group bg-transparent border-none p-0 cursor-pointer"
          >
            <div className="w-10 h-10 bg-[#FAF7F3] rounded-sm flex items-center justify-center shadow-lg group-hover:bg-[#B89B5E] transition-colors duration-500">
              <span className="text-2xl pt-1">📖</span>
            </div>
            <div className="flex flex-col items-start bg-transparent">
              <span className="font-serif text-2xl font-bold text-[#FAF7F3] tracking-tight leading-none group-hover:text-[#B89B5E] transition-colors">
                BookShelf
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#B89B5E] font-medium mt-1 group-hover:text-[#FAF7F3] transition-colors">
                Premium Editions
              </span>
            </div>
          </button>

          {/* Icons */}
          <div className="flex items-center gap-6 bg-transparent">
             {/* Wishlist */}
             <button 
               onClick={() => setIsWishlistOpen(true)}
               className="relative group p-2 rounded-full hover:bg-[#FAF7F3]/10 transition-all cursor-pointer border-none bg-transparent"
             >
               <svg className="w-6 h-6 text-[#FAF7F3] group-hover:text-[#B89B5E] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
               </svg>
               {wishlistCount > 0 && (
                 <span className="absolute -top-1 -right-1 bg-[#B89B5E] text-[#5B2C2C] text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-[#5B2C2C]">
                   {wishlistCount}
                 </span>
               )}
             </button>

             {/* Cart */}
             <button 
               onClick={() => setIsCartOpen(true)}
               className="relative group p-2 rounded-full hover:bg-[#FAF7F3]/10 transition-all cursor-pointer border-none bg-transparent"
             >
               <svg className="w-6 h-6 text-[#FAF7F3] group-hover:text-[#B89B5E] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
               </svg>
               {cartCount > 0 && (
                 <span className="absolute -top-1 -right-1 bg-[#B89B5E] text-[#5B2C2C] text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-[#5B2C2C]">
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
