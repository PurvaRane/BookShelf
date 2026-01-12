import React, { useState, useMemo, useEffect } from 'react';
import { BOOKS } from '../data/books';
import { filterBooks, sortBooks } from '../utils/filterUtils';
import Footer from '../components/layout/Footer';
import { useDebounce } from '../utils/useDebounce';
import Navbar from '../components/layout/Navbar';
import ProductGrid from '../components/product/ProductGrid';
import FilterSidebar from '../components/filter/FilterSidebar';
import BookDetailsModal from '../components/product/BookDetailsModal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const Home = ({ initialCategory = null, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(initialCategory ? [initialCategory] : []);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1500 });
  const [sortOption, setSortOption] = useState('');
  const [selectedBook, setSelectedBook] = useState(null); // Modal State

  // Track scroll for dynamic positioning
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect to sync initialCategory if it changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
    }
  }, [initialCategory]);

  // Debounce Search Query (300ms delay)
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Derived State (Filtering & Sorting)
  const filteredBooks = useMemo(() => {
    const filtered = filterBooks(BOOKS, { 
      searchQuery: debouncedSearchQuery, 
      selectedCategories, 
      priceRange 
    });
    return sortBooks(filtered, sortOption);
  }, [debouncedSearchQuery, selectedCategories, priceRange, sortOption]);

  const handlePriceChange = (type, value) => {
    if (typeof type === 'object') {
       setPriceRange(type);
    } else {
       setPriceRange(prev => ({ ...prev, [type]: value }));
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 1500 });
    setSortOption('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F1EB] transition-colors duration-300">
      <Navbar onNavigate={onNavigate} />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col space-y-8">
        {/* Header Section (Step 1: Visual Anchor) */}
        <div className={`bg-white py-6 px-8 rounded-lg border border-[#E3DDD6] shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-6 sticky z-40 mb-8 transition-all duration-300 ${
          isScrolled ? 'top-14' : 'top-20'
        }`}>
           {/* Left: Title & Count */}
           <div className="flex-1">
            <h2 className="text-3xl font-serif text-[#1F2933] mb-2 tracking-tight">The Library</h2>
            <p className="text-sm text-[#6B6A67] tracking-wide font-medium flex items-center gap-2">
              <span className="w-8 h-[1px] bg-[#B89B5E]"></span>
              Displaying {filteredBooks.length} edition{filteredBooks.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Right: Search & Actions */}
          <div className="flex-1 max-w-2xl w-full flex gap-4 items-center ml-auto">
             <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-[#9A9895] group-focus-within:text-[#5B2C2C] transition-colors" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <Input
                  placeholder="Search by title, author, or ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-3 bg-[#FAF7F3] border-[#E3DDD6] focus:border-[#5B2C2C] focus:ring-1 focus:ring-[#5B2C2C] transition-all placeholder-[#9A9895] text-sm"
                />
             </div>
             
             {/* Mobile Filter Toggle */}
             <Button 
               className="lg:hidden" 
               variant="secondary" 
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             >
               Filters
             </Button>

             {/* Desktop Sort */}
             <div className="hidden lg:block w-56">
                <Select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  placeholder="Sort by..."
                  className="bg-white border-[#E3DDD6] py-3 text-sm focus:border-[#5B2C2C] focus:ring-[#5B2C2C]"
                  options={[
                    { value: '', label: 'Featured Collection' },
                    { value: 'price-asc', label: 'Price: Low to High' },
                    { value: 'price-desc', label: 'Price: High to Low' },
                    { value: 'rating-desc', label: 'Rating: Highest First' },
                    { value: 'title-asc', label: 'Alphabetical: A-Z' },
                    { value: 'title-desc', label: 'Alphabetical: Z-A' },
                  ]}
                />
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          {/* Sidebar Filters */}
          <div className={`
             lg:w-72 flex-shrink-0 lg:sticky transition-all duration-300
             ${isScrolled ? 'lg:top-32' : 'lg:top-40'}
             ${isMobileMenuOpen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden'} 
             lg:block
          `}>
            {/* Mobile Close Button */}
            {isMobileMenuOpen && (
              <div className="flex justify-end mb-4 lg:hidden">
                <Button variant="ghost" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="sr-only">Close menu</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            )}

            <FilterSidebar
              selectedCategories={selectedCategories}
              onCategoryChange={setSelectedCategories}
              priceRange={priceRange}
              onPriceChange={handlePriceChange}
              sortOption={sortOption}
              onSortChange={setSortOption}
              onClearFilters={handleClearFilters}
            />
          </div>
          
          {/* Overlay for mobile when menu is open */}
          {isMobileMenuOpen && (
             <div 
               className="fixed inset-0 bg-black/50 z-40 lg:hidden"
               onClick={() => setIsMobileMenuOpen(false)}
             />
          )}

          {/* Product Grid */}
          <div className="flex-1 w-full min-h-[600px]">
             {filteredBooks.length > 0 ? (
                 <ProductGrid 
                   books={filteredBooks} 
                   onBookClick={setSelectedBook}
                 />
             ) : (
                 <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-xl border border-[var(--color-paper-border)] shadow-sm">
                    <div className="bg-[var(--color-paper-soft)] rounded-full p-6 mb-4">
                      <svg className="w-12 h-12 text-[var(--color-text-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">No books found</h3>
                    <p className="text-[var(--color-text-muted)] max-w-sm mx-auto">
                      We couldn't find any books matching "{debouncedSearchQuery}". 
                      <br/>Try searching for something else or adjusting your filters.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-6"
                      onClick={handleClearFilters}
                    >
                      Clear All Filters
                    </Button>
                 </div>
             )}
          </div>
        </div>
        </div>
      </main>
      <Footer />
      
      {/* Product Details Modal */}
      {selectedBook && (
        <BookDetailsModal 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
        />
      )}
    </div>
  );
};

export default Home;
