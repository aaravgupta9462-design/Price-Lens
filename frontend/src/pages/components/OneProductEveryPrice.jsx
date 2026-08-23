import React from 'react';
import { Star, Truck, Zap } from 'lucide-react';

export const OneProductEveryPrice = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            One Product. Every Price.
          </h2>
          <p className="text-lg text-slate-600">
            See prices from multiple stores in one simple comparison.
          </p>
        </div>

        {/* Comparison Interface */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 sm:px-8 py-6 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Apple iPhone 15 (128GB, Black)</h3>
              <div className="flex gap-4">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Current Price</div>
                  <div className="text-2xl font-bold text-slate-900">₹63,490</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Original Price</div>
                  <div className="text-xl font-bold text-slate-500 line-through">₹66,999</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Discount</div>
                  <div className="text-2xl font-bold text-green-600">5%</div>
                </div>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 whitespace-nowrap">
              <div className="text-xs text-green-700 font-bold mb-1">BEST PRICE</div>
              <div className="text-lg font-bold text-green-700">₹63,490</div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 sm:px-8 py-4 text-left text-sm font-bold text-slate-900">Store</th>
                  <th className="px-6 sm:px-8 py-4 text-left text-sm font-bold text-slate-900">Price</th>
                  <th className="px-6 sm:px-8 py-4 text-left text-sm font-bold text-slate-900">Stock</th>
                  <th className="px-6 sm:px-8 py-4 text-left text-sm font-bold text-slate-900">Delivery</th>
                  <th className="px-6 sm:px-8 py-4 text-left text-sm font-bold text-slate-900">Rating</th>
                  <th className="px-6 sm:px-8 py-4 text-left text-sm font-bold text-slate-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { store: 'Flipkart', price: '₹63,490', stock: 'In stock', delivery: 'Free', rating: 4.5, isBest: true },
                  { store: 'Amazon', price: '₹64,999', stock: 'In stock', delivery: 'Free', rating: 4.7, isBest: false },
                  { store: 'Croma', price: '₹65,999', stock: 'Limited', delivery: '₹200', rating: 4.3, isBest: false },
                ].map((item, idx) => (
                  <tr key={idx} className={`border-b border-slate-200 ${item.isBest ? 'bg-green-50' : 'hover:bg-slate-50'} transition`}>
                    <td className="px-6 sm:px-8 py-4 text-sm font-medium text-slate-900">{item.store}</td>
                    <td className="px-6 sm:px-8 py-4 text-lg font-bold text-slate-900">{item.price}</td>
                    <td className="px-6 sm:px-8 py-4 text-sm text-slate-600">{item.stock}</td>
                    <td className="px-6 sm:px-8 py-4 text-sm text-slate-600">{item.delivery}</td>
                    <td className="px-6 sm:px-8 py-4 text-sm">
                      <div className="flex items-center gap-1">
                        {[...Array(Math.floor(item.rating))].map((_, i) => (
                          <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-slate-600">{item.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 sm:px-8 py-4 text-sm">
                      <button className={`px-4 py-2 rounded-lg font-medium transition ${item.isBest ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
                        {item.isBest ? 'Buy Now' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
