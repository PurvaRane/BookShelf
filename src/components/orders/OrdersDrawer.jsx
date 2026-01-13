import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatPrice';
import Button from '../../common/Button';

const OrdersDrawer = () => {
  const { 
    orders, 
    isOrdersOpen, 
    setIsOrdersOpen 
  } = useStore();

  if (!isOrdersOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOrdersOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-slide-in-right">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-[#E3DDD6] flex items-center justify-between bg-[#FAF7F3]">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 bg-[#5B2C2C] text-white rounded-md">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            </div>
            <div>
                <h2 className="text-lg md:text-xl font-serif font-bold text-[#1F2933]">Your Orders</h2>
                <p className="text-[10px] uppercase tracking-widest text-[#6B6A67] font-bold">Purchase History</p>
            </div>
          </div>
          <button 
             onClick={() => setIsOrdersOpen(false)}
             className="p-2 text-[#9A9895] active:text-[#1F2933] md:hover:text-[#1F2933] active:bg-[#FAF7F3] md:hover:bg-[#FAF7F3] rounded-full transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
             aria-label="Close orders"
          >
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#FDFBF9] scrollbar-hide">
          {orders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
               <div className="w-24 h-24 bg-[#FAF7F3] rounded-full flex items-center justify-center border border-[#E3DDD6]">
                 <span className="text-4xl opacity-40">📦</span>
               </div>
               <div>
                 <h3 className="text-lg font-serif font-bold text-[#1F2933]">No orders yet</h3>
                 <p className="text-sm text-[#6B6A67] mt-2">When you purchase books, they will appear here as beautiful additions to your collection.</p>
               </div>
               <Button onClick={() => setIsOrdersOpen(false)} variant="primary" className="px-8 bg-[#5B2C2C] touch-manipulation min-h-[48px] md:min-h-0">
                 Explore the Library
               </Button>
            </div>
          ) : (
            <div className="space-y-6">
               {orders.map((order) => (
                 <div key={order.id} className="bg-white border border-[#E3DDD6] rounded-sm shadow-sm overflow-hidden">
                    {/* Order Meta */}
                    <div className="p-3 bg-[#FAF7F3] border-b border-[#E3DDD6] flex justify-between items-center">
                        <span className="text-[10px] font-bold text-[#5B2C2C] uppercase tracking-tighter bg-white px-2 py-0.5 border border-[#E3DDD6]">
                            #{order.id.split('-')[1]}
                        </span>
                        <span className="text-[10px] text-[#9A9895] font-medium">
                            {new Date(order.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>

                    {/* Order Items */}
                    <div className="p-4 space-y-3">
                        {order.items.map((item, idx) => (
                            <div key={`${order.id}-${idx}`} className="flex gap-3 items-center">
                                <img src={item.image} alt={item.title} className="w-10 h-14 object-cover rounded-[1px] shadow-sm" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-serif font-bold text-[#1F2933] line-clamp-1">{item.title}</p>
                                    <p className="text-[10px] text-[#6B6A67]">Qty: {item.qty}</p>
                                </div>
                                <span className="text-xs font-bold text-[#2F5D50]">
                                    {formatPrice(item.price * item.qty)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Order Footer */}
                    <div className="px-4 py-3 bg-white border-t border-[#E3DDD6]/50 flex justify-between items-center">
                        <span className="text-xs text-[#6B6A67] font-medium">Order Total</span>
                        <span className="text-sm font-bold text-[#1F2933]">
                            {formatPrice(order.total)}
                        </span>
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-[#E3DDD6] bg-[#FAF7F3]">
            <p className="text-[10px] text-center text-[#9A9895] uppercase tracking-widest font-bold">
                Thank you for choosing BookShelf
            </p>
        </div>
      </div>
    </div>
  );
};

export default OrdersDrawer;
