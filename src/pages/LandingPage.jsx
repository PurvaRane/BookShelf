import React from "react";
import Button from "../common/Button";

const LandingPage = ({ onBrowse }) => {
  return (
    <div className="min-h-screen bg-[#F6F1EB] flex items-center justify-center px-4 md:px-6 py-12 md:py-0">
      <div className="max-w-4xl w-full text-center">
        
        {/* Tagline */}
        <p className="text-[10px] md:text-sm tracking-[0.2em] md:tracking-widest text-[#6B2E2E] uppercase mb-4 md:mb-6 font-bold">
          A calm place to discover books
        </p>

        {/* Title */}
        <h1 className="font-serif text-3xl md:text-6xl text-[#2E2A27] leading-tight mb-6 md:mb-8 max-w-2xl mx-auto">
          Find books worth <span className="italic text-[#6B2E2E]">spending time with</span>
        </h1>

        {/* CTA */}
        <div className="flex justify-center mb-10 md:mb-0">
          <button
            onClick={onBrowse}
            className="w-full md:w-auto px-10 py-4 md:py-3 border border-[#6B2E2E] text-[#6B2E2E] font-bold uppercase tracking-widest text-[11px] md:text-xs
                       hover:bg-[#6B2E2E] hover:text-[#F6F1EB]
                       transition-colors duration-200"
          >
            Browse Collection
          </button>
        </div>

        {/* Divider - Hidden on mobile for cleaner look */}
        <div className="hidden md:block mt-20 border-t border-[#D6CDC4]" />

        {/* Features */}
        <div className="mt-8 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 text-left px-2 md:px-0">
          <div className="bg-white/50 md:bg-transparent p-6 md:p-0 rounded-sm border border-[#E3DDD6] md:border-none">
            <h3 className="font-serif text-lg md:text-xl text-[#2E2A27] mb-2 md:mb-3">
              Thoughtful Categories
            </h3>
            <p className="text-xs md:text-sm text-[#4A4643] leading-relaxed opacity-80">
              Books organized clearly by genre so you can focus on what matters.
            </p>
          </div>

          <div className="bg-white/50 md:bg-transparent p-6 md:p-0 rounded-sm border border-[#E3DDD6] md:border-none">
            <h3 className="font-serif text-lg md:text-xl text-[#2E2A27] mb-2 md:mb-3">
              Advanced Discovery
            </h3>
            <p className="text-xs md:text-sm text-[#4A4643] leading-relaxed opacity-80">
              Search, filter, and sort books with ease using powerful yet simple tools.
            </p>
          </div>

          <div className="bg-white/50 md:bg-transparent p-6 md:p-0 rounded-sm border border-[#E3DDD6] md:border-none">
            <h3 className="font-serif text-lg md:text-xl text-[#2E2A27] mb-2 md:mb-3">
              Clean Experience
            </h3>
            <p className="text-xs md:text-sm text-[#4A4643] leading-relaxed opacity-80">
              No clutter, no distractions — just books and a calm browsing experience.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
