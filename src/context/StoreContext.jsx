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
  useEffect(() => {
    localStorage.setItem('bookshelf_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bookshelf_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('bookshelf_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('recently_viewed_books', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // --- Cart Actions ---
  const addToCart = (book) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.id === book.id ? { ...item, qty: item.qty + 1 } : item
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
    if (cart.length === 0) return;
    
    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      items: [...cart],
      total: cartTotal,
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setIsCartOpen(false);
    setIsOrdersOpen(true);
  };

  // --- Recently Viewed ---
  const addRecentlyViewed = (book) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(item => item.id !== book.id);
      return [
        {
          id: book.id,
          title: book.title,
          author: book.author,
          price: book.price,
          image: book.image,
          category: book.category
        },
        ...filtered
      ].slice(0, 6);
    });
  };

  // --- Wishlist Actions ---
  const addToWishlist = (book) => {
    setWishlist((prev) => {
      if (prev.find((item) => item.id === book.id)) return prev;
      return [...prev, { ...book, addedAt: Date.now() }];
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
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.qty, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.qty, 0);
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
