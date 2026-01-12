import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatPrice';
import Button from '../../common/Button';
import Select from '../../common/Select';

const CartDrawer = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    cartTotal,
    clearCart
  } = useStore();
  
  const [sortOption, setSortOption] = useState('date-desc');

  // Sort logic for cart
  const sortedCart = useMemo(() => {
    const items = [...cart];
    switch (sortOption) {
      case 'price-asc':
        return items.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return items.sort((a, b) => b.price - a.price);
      case 'date-desc':
      default:
        // Already date-asc by default push, so reverse for newest first
        return items.sort((a, b) => b.addedAt - a.addedAt); 
    }
  }, [cart, sortOption]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-slide-in-right">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Your Cart ({cart.length})
          </h2>
          <button 
             onClick={() => setIsCartOpen(false)}
             className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                 <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                 </svg>
               </div>
               <div>
                 <h3 className="text-lg font-bold text-gray-900">Your cart is empty</h3>
                 <p className="text-gray-500">Looks like you haven't added anything yet.</p>
               </div>
               <Button onClick={() => setIsCartOpen(false)} variant="outline">
                 Start Browsing
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
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
               </div>

               {/* Items List */}
               <div className="space-y-4">
                 {sortedCart.map((item) => (
                   <div key={item.id} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                      <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                             </svg>
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mb-auto">{item.author}</p>
                        
                        <div className="flex items-center justify-between mt-2">
                           <div className="flex items-center border border-gray-200 rounded-lg">
                             <button 
                               className="px-2 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                               onClick={() => updateQuantity(item.id, -1)}
                               disabled={item.qty <= 1}
                             >
                               -
                             </button>
                             <span className="px-2 text-sm font-semibold text-gray-900 border-l border-r border-gray-200 min-w-[32px] text-center">
                               {item.qty}
                             </span>
                             <button 
                               className="px-2 py-1 text-gray-500 hover:bg-gray-50"
                               onClick={() => updateQuantity(item.id, 1)}
                             >
                               +
                             </button>
                           </div>
                           <span className="font-bold text-primary">
                             {formatPrice(item.price * item.qty)}
                           </span>
                        </div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
           <div className="p-6 border-t border-gray-100 bg-gray-50">
             <div className="flex justify-between items-end mb-4">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-2xl font-bold text-gray-900">{formatPrice(cartTotal)}</span>
             </div>
             <div className="space-y-3">
               <Button size="lg" className="w-full shadow-lg shadow-indigo-200" onClick={() => alert('Proceeding to checkout...')}>
                 Checkout Now
               </Button>
               <button 
                 onClick={clearCart}
                 className="w-full text-sm text-gray-500 hover:text-red-500 transition-colors"
               >
                 Clear Cart
               </button>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
