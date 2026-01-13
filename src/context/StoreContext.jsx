import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider = ({ children }) => {
  // --- State Initialization ---
  // Load from local storage or default to empty array
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('bookshelf_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

   const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem('bookshelf_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem('bookshelf_orders');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const stored = localStorage.getItem('recently_viewed_books');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  // --- Persistence ---
  // WHY: Save state to localStorage on every change for persistence across page refreshes
  // Error handling: Wrap in try-catch to prevent crashes if localStorage is unavailable
  useEffect(() => {
    try {
      localStorage.setItem('bookshelf_cart', JSON.stringify(cart));
    } catch (error) {
      // Silently fail if localStorage is unavailable (e.g., private browsing)
      console.warn('Failed to save cart to localStorage:', error);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('bookshelf_wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.warn('Failed to save wishlist to localStorage:', error);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('bookshelf_orders', JSON.stringify(orders));
    } catch (error) {
      console.warn('Failed to save orders to localStorage:', error);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('recently_viewed_books', JSON.stringify(recentlyViewed));
    } catch (error) {
      console.warn('Failed to save recently viewed to localStorage:', error);
    }
  }, [recentlyViewed]);

  // --- Cart Actions ---
  const addToCart = (book) => {
    // Guard: Only proceed if book is valid
    if (!book || typeof book !== 'object' || !book.id) {
      return;
    }

    setCart((prev) => {
      // Guard: Ensure prev is an array
      if (!Array.isArray(prev)) {
        return [{ ...book, qty: 1, addedAt: Date.now() }];
      }

      const existing = prev.find((item) => item?.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.id === book.id 
            ? { ...item, qty: (item.qty || 0) + 1 } 
            : item
        );
      }
      return [...prev, { ...book, qty: 1, addedAt: Date.now() }];
    });
  };

  const removeFromCart = (bookId) => {
    setCart((prev) => prev.filter((item) => item.id !== bookId));
  };

  const updateQuantity = (bookId, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === bookId) {
          const newQty = Math.max(1, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const placeOrder = () => {
    // Guard: Don't place order if cart is empty
    if (!Array.isArray(cart) || cart.length === 0) {
      return;
    }
    
    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      items: [...cart], // Create copy to avoid reference issues
      total: cartTotal,
    };

    setOrders(prev => {
      const prevArray = Array.isArray(prev) ? prev : [];
      return [newOrder, ...prevArray];
    });
    clearCart();
    setIsCartOpen(false);
    setIsOrdersOpen(true);
  };

  // --- Recently Viewed ---
  const addRecentlyViewed = (book) => {
    // Guard: Only proceed if book is valid
    if (!book || typeof book !== 'object' || !book.id) {
      return;
    }

    setRecentlyViewed(prev => {
      // Guard: Ensure prev is an array
      const prevArray = Array.isArray(prev) ? prev : [];
      
      // Remove existing entry if present, then add new one at the front
      const filtered = prevArray.filter(item => item?.id !== book.id);
      return [
        {
          id: book.id,
          title: book.title || 'Untitled',
          author: book.author || 'Unknown',
          price: book.price || 0,
          image: book.image || '',
          category: book.category || 'Uncategorized'
        },
        ...filtered
      ].slice(0, 6); // Keep only last 6 viewed items
    });
  };

  // --- Wishlist Actions ---
  const addToWishlist = (book) => {
    // Guard: Only proceed if book is valid
    if (!book || typeof book !== 'object' || !book.id) {
      return;
    }

    setWishlist((prev) => {
      // Guard: Ensure prev is an array
      const prevArray = Array.isArray(prev) ? prev : [];
      
      // Don't add if already in wishlist
      if (prevArray.find((item) => item?.id === book.id)) {
        return prevArray;
      }
      return [...prevArray, { ...book, addedAt: Date.now() }];
    });
  };

  const removeFromWishlist = (bookId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== bookId));
  };

  const moveToCart = (book) => {
    removeFromWishlist(book.id);
    addToCart(book);
  };

  // --- Derived State ---
  // WHY useMemo: Prevents recalculating totals on every render
  // Only recalculates when cart array changes
  const cartTotal = useMemo(() => {
    if (!Array.isArray(cart) || cart.length === 0) {
      return 0;
    }
    return cart.reduce((total, item) => {
      const price = item?.price || 0;
      const qty = item?.qty || 0;
      return total + (price * qty);
    }, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    if (!Array.isArray(cart) || cart.length === 0) {
      return 0;
    }
    return cart.reduce((count, item) => {
      return count + (item?.qty || 0);
    }, 0);
  }, [cart]);

  const wishlistCount = wishlist.length;

  const value = {
    cart,
    wishlist,
    orders,
    recentlyViewed,
    isCartOpen,
    setIsCartOpen,
    isWishlistOpen,
    setIsWishlistOpen,
    isOrdersOpen,
    setIsOrdersOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    placeOrder,
    addRecentlyViewed,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    cartTotal,
    cartCount,
    wishlistCount,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};
