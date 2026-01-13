/**
 * Sorts books array based on sortOption
 * @param {Array} books - Array of book objects
 * @param {string} sortOption - Sort criteria ('price-asc', 'price-desc', etc.)
 * @returns {Array} - Sorted array of books (returns empty array if books is invalid)
 */
export const sortBooks = (books, sortOption) => {
  // Guard: Return empty array if books is not an array
  if (!Array.isArray(books) || books.length === 0) {
    return [];
  }

  const sortedBooks = [...books];
  
  switch (sortOption) {
    case 'price-asc':
      return sortedBooks.sort((a, b) => (a.price || 0) - (b.price || 0));
    case 'price-desc':
      return sortedBooks.sort((a, b) => (b.price || 0) - (a.price || 0));
    case 'rating-desc':
      return sortedBooks.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'title-asc':
      return sortedBooks.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    case 'title-desc':
      return sortedBooks.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    default:
      return sortedBooks;
  }
};

/**
 * Filters books array based on search query, categories, and price range
 * @param {Array} books - Array of book objects
 * @param {Object} filters - Filter criteria { searchQuery, selectedCategories, priceRange }
 * @returns {Array} - Filtered array of books (returns empty array if books is invalid)
 */
export const filterBooks = (books, { searchQuery = '', selectedCategories = [], priceRange = { min: 0, max: Infinity } }) => {
  // Guard: Return empty array if books is not an array
  if (!Array.isArray(books) || books.length === 0) {
    return [];
  }

  // Normalize search query to lowercase for case-insensitive matching
  const normalizedQuery = (searchQuery || '').trim().toLowerCase();
  
  // Guard: Ensure priceRange has valid min/max values
  const minPrice = priceRange?.min ?? 0;
  const maxPrice = priceRange?.max ?? Infinity;
  const categories = Array.isArray(selectedCategories) ? selectedCategories : [];

  return books.filter((book) => {
    // Guard: Skip invalid book objects
    if (!book || typeof book !== 'object') {
      return false;
    }

    // Search match: Check if query matches title or author (case-insensitive)
    const matchesSearch = normalizedQuery.length === 0 || 
      (book.title?.toLowerCase().includes(normalizedQuery) || 
       book.author?.toLowerCase().includes(normalizedQuery));

    // Category match: If no categories selected, show all; otherwise check inclusion
    const matchesCategory = categories.length === 0 || 
      (book.category && categories.includes(book.category));

    // Price match: Ensure book price is within range
    const bookPrice = book.price ?? 0;
    const matchesPrice = bookPrice >= minPrice && bookPrice <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });
};
