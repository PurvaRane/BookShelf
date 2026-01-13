const KEY = 'recently_viewed_books';
const MAX_ITEMS = 6;

export const getRecentlyViewed = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};

export const addRecentlyViewed = (book) => {
  const existing = getRecentlyViewed();
  const filtered = existing.filter(item => item.id !== book.id);

  const updated = [
    {
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      cover: book.cover
    },
    ...filtered
  ].slice(0, MAX_ITEMS);

  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
};
