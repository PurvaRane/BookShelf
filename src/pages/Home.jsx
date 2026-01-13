import React, { useState, useMemo, useEffect, useRef } from 'react';
import { BOOKS } from '../data/books';
import { CATEGORIES } from '../data/categories';
import { filterBooks, sortBooks } from '../utils/filterUtils';
import Footer from '../components/layout/Footer';
import { useDebounce } from '../utils/useDebounce';
import Navbar from '../components/layout/Navbar';
import ProductGrid from '../components/product/ProductGrid';
import BookDetailsModal from '../components/product/BookDetailsModal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import RangeSlider from '../common/RangeSlider';
import { getSimilarity } from '../utils/stringSimilarity';
import RecentlyViewed from '../components/recent/RecentlyViewed';
import { useStore } from '../context/StoreContext';

const Home = ({ initialCategory = null, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // State from Store
  const { addRecentlyViewed } = useStore();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(initialCategory ? [initialCategory] : []);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1500 });
  const [sortOption, setSortOption] = useState('');
  const [selectedBook, setSelectedBook] = useState(null); // Modal State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleBookClick = (book) => {
    // Guard: Only proceed if book is valid
    if (!book || typeof book !== 'object') {
      return;
    }
    setSelectedBook(book);
    addRecentlyViewed(book);
  };

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
  // WHY: Prevents excessive filtering on every keystroke, improving performance
  // Only triggers filter when user stops typing for 300ms
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Derived State (Filtering & Sorting)
  // WHY useMemo: Prevents re-filtering/re-sorting on every render
  // Only recalculates when dependencies (search, categories, price, sort) change
  const filteredBooks = useMemo(() => {
    // Guard: Ensure BOOKS is a valid array
    if (!Array.isArray(BOOKS) || BOOKS.length === 0) {
      return [];
    }

    const filtered = filterBooks(BOOKS, { 
      searchQuery: debouncedSearchQuery, 
      selectedCategories, 
      priceRange 
    });
    return sortBooks(filtered, sortOption);
  }, [debouncedSearchQuery, selectedCategories, priceRange, sortOption]);

  // Autocomplete suggestions with typo tolerance
  // WHY useMemo: Prevents recalculating suggestions on every render
  // Only recalculates when searchQuery changes
  const searchSuggestions = useMemo(() => {
    // Guard: Ensure BOOKS is a valid array
    if (!Array.isArray(BOOKS) || BOOKS.length === 0) {
      return [];
    }

    const query = (searchQuery || '').trim().toLowerCase();
    
    // Early return: Don't show suggestions for very short queries
    if (query.length < 2) {
      return [];
    }

    // Early return: Don't show suggestions if exact match exists
    const hasExactMatch = BOOKS.some(book => 
      book?.title?.toLowerCase() === query
    );
    if (hasExactMatch) {
      return [];
    }

    return BOOKS
      .filter(book => book && book.title) // Guard: Skip invalid books
      .map(book => {
        const title = (book.title || '').toLowerCase();
        const author = (book.author || '').toLowerCase();

        // Direct match: Higher score for exact substring matches
        if (title.includes(query) || author.includes(query)) {
          return { value: book.title, score: 1 };
        }

        // Fuzzy match: Use similarity scoring for typos
        const titleScore = getSimilarity(query, title);
        const authorScore = getSimilarity(query, author);

        return {
          value: book.title,
          score: Math.max(titleScore, authorScore)
        };
      })
      .filter(item => item.score > 0.25) // Only show relevant suggestions
      .sort((a, b) => b.score - a.score) // Sort by relevance
      .slice(0, 5); // Limit to top 5 suggestions
  }, [searchQuery]);

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

  const searchRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState(null);

  // Position autocomplete dropdown relative to search input
  // WHY: Ensures dropdown appears directly below search input
  // Resets position when suggestions change or disappear
  useEffect(() => {
    if (searchRef.current && searchSuggestions.length > 0) {
      const rect = searchRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: rect.bottom + 8 + window.scrollY,
        left: rect.left,
        width: rect.width,
      });
    } else {
      // Reset dropdown position when suggestions are empty
      setDropdownStyle(null);
    }
  }, [searchSuggestions]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F1EB] transition-colors duration-300">
      <Navbar 
        onNavigate={onNavigate} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchSuggestions={searchSuggestions}
        isScrolled={isScrolled}
        onHistoryClick={() => setIsHistoryOpen(true)}
      />

      {isHistoryOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[100] transition-opacity animate-in fade-in"
            onClick={() => setIsHistoryOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl z-[101] max-h-[90vh] overflow-y-auto shadow-[0_-8px_30px_rgb(0,0,0,0.12)] border-t border-[#E3DDD6]">
            {/* Drag Handle */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm flex flex-col items-center pt-3 pb-2 border-b border-[#E3DDD6] z-10">
              <div className="w-12 h-1 bg-[#E3DDD6] rounded-full mb-3"></div>
              <div className="flex justify-between items-center w-full px-4 pb-2">
                <div>
                  <h3 className="text-base md:text-sm font-serif font-bold text-[#1F2933]">Library Insights</h3>
                  <p className="text-[10px] text-[#9A9895] uppercase tracking-widest font-bold">History & Discovery</p>
                </div>
                <button 
                  onClick={() => setIsHistoryOpen(false)}
                  className="p-2 text-[#9A9895] active:text-[#5B2C2C] md:hover:text-[#5B2C2C] transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 md:p-6">
              <RecentlyViewed />
            </div>
          </div>
        </>
      )}

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="flex flex-col space-y-8">
          
          {/* Header Card */}
          <div className={`bg-white px-4 md:px-8 rounded-lg border border-[#E3DDD6] shadow-sm sticky z-40 mb-4 transition-all duration-300 ease-out ${isScrolled ? 'top-14 md:top-16 py-2 opacity-0 pointer-events-none' : 'top-16 md:top-20 py-4 md:py-6 opacity-100'}`}>
            <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6 mb-4 md:mb-6 transition-all duration-500 ${isScrolled ? 'scale-90' : 'scale-100'}`}>
              <div className={`flex-1 transition-all duration-500 ${isScrolled ? 'translate-y-4' : 'translate-y-0'}`}>
                <h2 className="text-xl md:text-3xl font-serif text-[#1F2933] mb-1 tracking-tight">The Library</h2>
                <p className="hidden md:flex text-xs text-[#6B6A67] tracking-widest font-bold uppercase items-center gap-2">
                  <span className="w-6 h-[1px] bg-[#B89B5E]"></span>
                  {filteredBooks.length} Editions Available
                </p>
              </div>

              {/* Desktop Only Search */}
              <div ref={searchRef} className={`hidden md:flex flex-1 max-w-xl w-full relative transition-all duration-500 ${isScrolled ? 'opacity-0 scale-90 translate-y-4 pointer-events-none' : 'opacity-100 scale-100 translate-y-0'}`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <svg className="h-5 w-5 text-[#9A9895]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <Input
                  placeholder="Search by title, author, or ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-2 md:py-3 bg-[#FAF7F3] border-[#E3DDD6] focus:border-[#5B2C2C] focus:ring-1 focus:ring-[#5B2C2C] transition-all placeholder-[#9A9895] text-sm"
                />
              </div>
            </div>

            {/* Category Tabs */}
            <div className={`w-full border-t border-[#E3DDD6]/50 pt-3 transition-all duration-300 ${isScrolled ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
              <div className="flex items-center gap-2 md:gap-3 overflow-x-auto scrollbar-hide px-1 -mx-1 md:mx-0 pb-1 md:pb-0 justify-start md:justify-center max-w-6xl mx-auto md:mx-auto snap-x snap-mandatory">
                <button
                  onClick={() => setSelectedCategories([])}
                  className={`flex-shrink-0 px-4 md:px-5 py-2.5 md:py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-sm transition-all touch-manipulation min-w-[60px] md:min-w-0 snap-start ${selectedCategories.length === 0 ? 'bg-[#5B2C2C] text-white' : 'bg-[#FAF7F3] text-[#6B6A67] border border-[#E3DDD6] active:bg-white md:hover:bg-white'}`}
                >
                  All
                </button>
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategories([category.name])}
                    className={`flex-shrink-0 px-4 md:px-5 py-2.5 md:py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-sm transition-all touch-manipulation min-w-[60px] md:min-w-0 snap-start ${selectedCategories.includes(category.name) ? 'bg-[#5B2C2C] text-white' : 'bg-[#FAF7F3] text-[#6B6A67] border border-[#E3DDD6] active:bg-white md:hover:bg-white'}`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between bg-white py-4 md:py-5 px-4 md:px-6 rounded-lg border border-[#E3DDD6] shadow-sm mb-6">
            <div className="flex-1 max-w-md w-full">
              <div className="flex items-center justify-between mb-3 md:mb-2">
                <h4 className="text-[10px] md:text-[10px] font-bold text-[#9A9895] uppercase tracking-widest">Price Range</h4>
                <div className="flex gap-2 text-[11px] md:text-[10px] font-bold text-[#1F2933] font-serif">
                  <span>₹{priceRange.min}</span>
                  <span className="opacity-30">-</span>
                  <span>₹{priceRange.max}</span>
                </div>
              </div>
              <RangeSlider
                min={0}
                max={1500}
                value={priceRange}
                onChange={handlePriceChange}
              />
            </div>
            <div className="flex gap-3 items-center w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-none border-[#E3DDD6]/50">
              <Select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                placeholder="Sort by..."
                className="flex-1 sm:flex-none bg-white border-[#E3DDD6] py-2.5 md:py-2 text-xs focus:border-[#5B2C2C] focus:ring-[#5B2C2C] min-w-0 sm:min-w-[140px] md:min-w-[200px]"
                options={[
                  { value: '', label: 'Featured Collection' },
                  { value: 'price-asc', label: 'Price: Low to High' },
                  { value: 'price-desc', label: 'Price: High to Low' },
                  { value: 'rating-desc', label: 'Rating: Highest First' },
                  { value: 'title-asc', label: 'Alphabetical: A-Z' },
                  { value: 'title-desc', label: 'Alphabetical: Z-A' },
                ]}
              />
              {/* Show reset button only when filters are active */}
              {/* WHY: Derived state - no need for separate state variable */}
              {(selectedCategories.length > 0 || priceRange.min > 0 || priceRange.max < 1500 || sortOption !== '') && (
                <button
                  onClick={handleClearFilters}
                  className="p-2.5 md:px-4 md:py-2 text-[10px] font-bold uppercase tracking-widest text-[#5B2C2C] border border-[#E3DDD6] active:bg-[#FAF7F3] md:hover:bg-[#FAF7F3] rounded-sm transition-colors touch-manipulation min-w-[44px] md:min-w-0 flex items-center justify-center"
                  title="Reset All"
                >
                  <span className="hidden md:inline">Reset All</span>
                  <span className="md:hidden text-base">✕</span>
                </button>
              )}
            </div>
          </div>

          {/* Grid Layout */}
          <div className="w-full min-h-[400px] md:min-h-[600px]">
            {filteredBooks.length > 0 ? (
              <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 items-start">
                <div className="flex-1 w-full text-center sm:text-left">
                  <ProductGrid books={filteredBooks} onBookClick={handleBookClick} />
                </div>
                <aside className="hidden xl:block w-80 flex-shrink-0 sticky top-28 xl:top-32">
                  <div className="bg-white border border-[#E3DDD6] rounded-sm p-5 md:p-6 shadow-sm">
                    <RecentlyViewed />
                  </div>
                </aside>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-xl border border-[#E3DDD6] shadow-sm">
                <div className="bg-[#FAF7F3] rounded-full p-6 mb-4">
                  <svg className="w-12 h-12 text-[#9A9895]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1F2933] mb-2">No books found</h3>
                <p className="text-[#9A9895] max-w-sm mx-auto">
                  {debouncedSearchQuery 
                    ? `We couldn't find any books matching "${debouncedSearchQuery}". Try adjusting your filters.`
                    : 'No books match your current filters. Try adjusting your search criteria.'}
                </p>
                <Button variant="outline" className="mt-6" onClick={handleClearFilters}>Clear All Filters</Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Desktop Autocomplete */}
      {!isScrolled && searchSuggestions.length > 0 && dropdownStyle && (
        <div className="hidden md:block fixed bg-white border border-[#E3DDD6] rounded-md shadow-xl z-[10000] overflow-hidden max-h-[300px] overflow-y-auto" style={dropdownStyle}>
          <p className="px-4 py-2 text-xs text-[#9A9895] bg-[#FAF7F3] border-b border-[#E3DDD6] font-medium sticky top-0">Suggestions</p>
          {searchSuggestions.map((item, idx) => (
            <button key={idx} onClick={() => setSearchQuery(item.value)} className="w-full text-left px-4 py-2.5 text-sm text-[#1F2933] hover:bg-[#FAF7F3] active:bg-[#FAF7F3] transition-colors border-b border-[#E3DDD6] last:border-b-0 touch-manipulation">
              {item.value}
            </button>
          ))}
        </div>
      )}

      <Footer />
      {selectedBook && <BookDetailsModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
    </div>
  );
};

export default Home;
