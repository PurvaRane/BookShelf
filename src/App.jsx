import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import CategoryPage from './pages/CategoryPage';
import Home from './pages/Home';
import { StoreProvider } from './context/StoreContext';
import CartDrawer from './components/cart/CartDrawer';
import WishlistDrawer from './components/wishlist/WishlistDrawer';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Navigation Handlers
  const handleBrowse = () => {
    setCurrentView('categories');
    window.scrollTo(0, 0);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentView('catalog');
    window.scrollTo(0, 0);
  };

  const handleNavigate = (view) => {
    // Reset category if navigating back to landing or categories explicitly
    if (view === 'landing' || view === 'categories') {
      setSelectedCategory(null);
    }
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  // View Router
  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onBrowse={handleBrowse} />;
      case 'categories':
        return <CategoryPage onSelectCategory={handleCategorySelect} />;
      case 'catalog':
        return (
          <Home 
            initialCategory={selectedCategory} 
            onNavigate={handleNavigate} 
          />
        );
      default:
        return <LandingPage onBrowse={handleBrowse} />;
    }
  };

  return (
    <StoreProvider>
      {renderView()}
      <CartDrawer />
      <WishlistDrawer />
    </StoreProvider>
  );
}

export default App;
