export const sortBooks = (books, sortOption) => {
  const sortedBooks = [...books];
  switch (sortOption) {
    case 'price-asc':
      return sortedBooks.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sortedBooks.sort((a, b) => b.price - a.price);
    case 'rating-desc':
      return sortedBooks.sort((a, b) => b.rating - a.rating);
    case 'title-asc':
      return sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return sortedBooks.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sortedBooks;
  }
};

export const filterBooks = (books, { searchQuery, selectedCategories, priceRange }) => {
  return books.filter((book) => {
    // Search match (Title or Author)
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    // Category match
    const matchesCategory = 
      selectedCategories.length === 0 || 
      selectedCategories.includes(book.category);

    // Price match
    const matchesPrice = 
      book.price >= priceRange.min && 
      book.price <= priceRange.max;

    return matchesSearch && matchesCategory && matchesPrice;
  });
};
