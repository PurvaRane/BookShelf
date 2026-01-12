import React from 'react';
import { CATEGORIES } from '../data/categories';

const CategoryPage = ({ onSelectCategory }) => {
  // Category Metadata (Editorial Style)
  const categoryMeta = {
    'Fiction': { accent: 'border-[#6B2E2E]', icon: '🎭' },
    'Non-Fiction': { accent: 'border-[#C2A14D]', icon: '🧠' },
    'Technology': { accent: 'border-[#2F5D50]', icon: '💻' },
    'Self-Help': { accent: 'border-[#8E4040]', icon: '✨' },
    'Business': { accent: 'border-[#1F2937]', icon: '📈' },
  };

  return (
    <div className="min-h-screen bg-[#F6F1EB] flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-20">
          <span className="text-[#C2A14D] uppercase tracking-[0.2em] text-xs font-bold mb-3 block">
            Start Your Journey
          </span>
          <h2 className="text-5xl font-serif font-bold text-[#1F2937] mb-6">
            Curated Collections
          </h2>
          <p className="text-xl text-[#57534E] font-light max-w-2xl mx-auto italic">
            "A room without books is like a body without a soul."
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {CATEGORIES.map((category) => {
            const meta = categoryMeta[category.name] || { accent: 'border-gray-400', icon: '📚' };
            
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.name)}
                className="group relative bg-[#FBF9F7] p-8 text-left shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col border border-[#E8E4DD] hover:border-[#C2A14D]/50"
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C2A14D] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="flex items-center justify-between mb-8">
                   <div className="text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-500">
                     {meta.icon}
                   </div>
                   <span className="w-8 h-[1px] bg-[#D6D3D1] group-hover:w-16 group-hover:bg-[#6B2E2E] transition-all duration-500" />
                </div>
                
                <h3 className="text-2xl font-serif font-bold text-[#1F2937] mb-3 group-hover:text-[#6B2E2E] transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-[#57534E] leading-relaxed mb-8 flex-grow font-light">
                  {category.description}
                </p>

                <div className="mt-auto flex items-center text-[#6B2E2E] font-bold text-xs uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-all">
                  Explore
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default CategoryPage;
