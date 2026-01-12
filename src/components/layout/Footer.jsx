import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[var(--color-paper-border)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-center text-sm text-[var(--color-text-muted)]">
          &copy; {new Date().getFullYear()} BookShelf. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
