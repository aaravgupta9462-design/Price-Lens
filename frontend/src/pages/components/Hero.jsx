import React from 'react';
import { ArrowRight, Search } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Headline */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 leading-tight">
            Stop Overpaying.
            <br />
            <span className="text-blue-600">Start Shopping Smarter.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Compare prices, track price history, and discover whether a deal is actually worth buying — all in one place.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium inline-flex items-center justify-center gap-2 group">
              Compare Prices <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </button>
            <button className="px-8 py-3 border border-slate-300 text-slate-900 rounded-lg hover:bg-gray-50 transition font-medium">
              See How It Works
            </button>
          </div>
        </div>

        {/* Search Interface */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Search Box */}
            <div className="flex gap-2 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for a product, brand or paste a product link..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                />
              </div>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium inline-flex items-center gap-2 whitespace-nowrap">
                Compare <ArrowRight size={18} />
              </button>
            </div>

            {/* Supported Stores */}
            <div className="flex flex-wrap gap-2 items-center justify-center">
              <span className="text-xs text-slate-500 font-medium">Supported stores:</span>
              <div className="flex flex-wrap gap-3">
                {['Amazon', 'Flipkart', 'Myntra', 'Croma', 'Reliance Digital'].map((store) => (
                  <span key={store} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-600">
                    {store}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Product Comparison Preview */}
          <div className="bg-slate-50 px-6 sm:px-8 py-8 border-t border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="text-xs text-slate-500 font-medium mb-2">Amazon</div>
                <div className="text-2xl font-bold text-slate-900 mb-1">₹64,999</div>
                <div className="text-xs text-slate-500">In stock • Free delivery</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200 ring-2 ring-green-500 relative">
                <div className="absolute -top-2 left-4 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                  BEST PRICE
                </div>
                <div className="text-xs text-slate-500 font-medium mb-2">Flipkart</div>
                <div className="text-2xl font-bold text-slate-900 mb-1">₹63,490</div>
                <div className="text-xs text-slate-500">In stock • Free delivery</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="text-xs text-slate-500 font-medium mb-2">Croma</div>
                <div className="text-2xl font-bold text-slate-900 mb-1">₹65,999</div>
                <div className="text-xs text-slate-500">In stock • Standard delivery</div>
              </div>
            </div>

            {/* Savings Badge */}
            <div className="flex items-center justify-center gap-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-center">
                <div className="text-xs text-green-700 font-medium mb-1">YOU SAVE</div>
                <div className="text-2xl font-bold text-green-700">₹2,509</div>
              </div>
              <div className="w-px h-12 bg-green-200"></div>
              <div className="text-center">
                <div className="text-xs text-green-700 font-medium mb-1">DEAL SCORE</div>
                <div className="text-2xl font-bold text-green-700">Excellent Deal</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
