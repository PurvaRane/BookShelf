import React from 'react';
import { CATEGORIES } from '../../data/categories';
import RangeSlider from '../../common/RangeSlider';
import Select from '../../common/Select';

const FilterSidebar = ({ 
  selectedCategories, 
  onCategoryChange, 
  priceRange, 
  onPriceChange,
  sortOption,
  onSortChange,
  onClearFilters 
}) => {
  const handleCategoryToggle = (categoryName) => {
    const newCategories = selectedCategories.includes(categoryName)
      ? selectedCategories.filter(c => c !== categoryName)
      : [...selectedCategories, categoryName];
    onCategoryChange(newCategories);
  };

  const hasActiveFilters = selectedCategories.length > 0 || priceRange.min > 0 || priceRange.max < 1500 || sortOption !== '';

  return (
    <aside className="sticky top-24 space-y-12 pr-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-2xl text-[#1F2933]">
          Collections
        </h3>
        {hasActiveFilters && (
           <button 
             onClick={onClearFilters}
             className="text-xs font-semibold text-[#8B2E2E] hover:underline"
           >
             Reset
           </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {CATEGORIES.map((category) => (
          <label key={category.id} className="flex items-center group cursor-pointer">
            <input
              type="checkbox"
              className="peer h-4 w-4 rounded-sm border-[#D6D3D1] text-[#5B2C2C] focus:ring-[#5B2C2C]/20 cursor-pointer bg-white transition-all"
              checked={selectedCategories.includes(category.name)}
              onChange={() => handleCategoryToggle(category.name)}
            />
            <span className={`ml-3 text-base transition-colors ${
                selectedCategories.includes(category.name) 
                  ? 'text-[#1F2933] font-serif font-medium italic' 
                  : 'text-[#6B6A67] group-hover:text-[#1F2933]'
              }`}>
              {category.name}
            </span>
          </label>
        ))}
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-4">
           <h4 className="text-xs font-bold text-[#9A9895] uppercase tracking-widest">Price Range</h4>
        </div>
        
        <div className="px-1 py-2">
          <RangeSlider
            min={0}
            max={1500}
            value={priceRange}
            onChange={(val) => {
              onPriceChange('min', val.min);
              onPriceChange('max', val.max); 
            }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs font-medium text-[#1F2933] font-serif">
             <span>₹{priceRange.min}</span>
             <span>₹{priceRange.max}</span>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
