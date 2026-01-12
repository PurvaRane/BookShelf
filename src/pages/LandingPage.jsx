import React from "react";
import Button from "../common/Button";

const LandingPage = ({ onBrowse }) => {
  return (
    <div className="min-h-screen bg-[#F6F1EB] flex items-center justify-center px-6">
      <div className="max-w-4xl w-full text-center">
        
        {/* Tagline */}
        <p className="text-sm tracking-widest text-[#6B2E2E] uppercase mb-6">
          A calm place to discover books
        </p>

        {/* Title */}
        <h1 className="font-serif text-5xl md:text-6xl text-[#2E2A27] leading-tight mb-6">
          Find books worth <br />
          <span className="italic text-[#6B2E2E]">spending time with</span>
        </h1>

       

        {/* CTA */}
        <div className="flex justify-center">
          <button
            onClick={onBrowse}
            className="px-8 py-3 border border-[#6B2E2E] text-[#6B2E2E] font-medium 
                       hover:bg-[#6B2E2E] hover:text-[#F6F1EB]
                       transition-colors duration-200"
          >
            Browse Collection
          </button>
        </div>

        {/* Divider */}
        <div className="mt-16 border-t border-[#D6CDC4]" />

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div>
            <h3 className="font-serif text-lg text-[#2E2A27] mb-2">
              Thoughtful Categories
            </h3>
            <p className="text-sm text-[#4A4643] leading-relaxed">
              Books organized clearly by genre so you can focus on what matters.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg text-[#2E2A27] mb-2">
              Advanced Discovery
            </h3>
            <p className="text-sm text-[#4A4643] leading-relaxed">
              Search, filter, and sort books with ease using powerful yet simple tools.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg text-[#2E2A27] mb-2">
              Clean Experience
            </h3>
            <p className="text-sm text-[#4A4643] leading-relaxed">
              No clutter, no distractions — just books and a calm browsing experience.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
