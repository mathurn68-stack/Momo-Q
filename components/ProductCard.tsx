
import React, { useState } from 'react';
import { MenuItem } from '../types';

interface ProductCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, variant?: string) => void;
  onClick: (item: MenuItem) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, onAddToCart, onClick }) => {
  const [showQuickVariants, setShowQuickVariants] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.variants || item.variants.length <= 1) {
      onAddToCart(item, item.variants?.[0]);
      triggerFeedback();
    } else {
      setShowQuickVariants(true);
    }
  };

  const selectQuickVariant = (e: React.MouseEvent, variant: string) => {
    e.stopPropagation();
    onAddToCart(item, variant);
    setShowQuickVariants(false);
    triggerFeedback();
  };

  const triggerFeedback = () => {
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const avgRating = item.reviews && item.reviews.length > 0
    ? (item.reviews.reduce((acc, r) => acc + r.rating, 0) / item.reviews.length).toFixed(1)
    : null;

  return (
    <div 
      onClick={() => onClick(item)}
      className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all group active:scale-[0.98] cursor-pointer relative"
    >
      <div className="relative h-44 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out" 
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />
        
        {/* Share Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            // Logic for sharing (copied from current app)
            if (navigator.share) {
              navigator.share({ title: item.name, text: item.description, url: window.location.href });
            }
          }}
          className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-gray-900 p-2 rounded-xl shadow-lg hover:bg-yellow-400 hover:text-black transition-colors z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>

        {/* Price and Quick Add */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
          <div className="bg-white/90 backdrop-blur-md text-gray-900 px-3 py-1.5 rounded-xl text-sm font-black shadow-lg">
            ₹{item.price}
          </div>
          <button 
            onClick={handleQuickAdd}
            className={`p-2 rounded-xl shadow-lg transition-all active:scale-90 flex items-center justify-center ${
              addedFeedback ? 'bg-green-500 text-white' : 'bg-yellow-400 text-black hover:bg-yellow-500'
            }`}
          >
            {addedFeedback ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
        </div>

        {/* Quick Variant Selection Overlay */}
        {showQuickVariants && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
            <p className="text-white text-[10px] font-black uppercase tracking-widest mb-3">Pick a Variant</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {item.variants?.map(v => (
                <button
                  key={v}
                  onClick={(e) => selectQuickVariant(e, v)}
                  className="bg-yellow-400 text-black px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-tight hover:scale-105 active:scale-95 transition-all"
                >
                  {v}
                </button>
              ))}
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowQuickVariants(false); }}
              className="mt-6 text-white/50 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {avgRating && (
          <div className="absolute bottom-3 left-3 bg-yellow-400 text-black px-2 py-0.5 rounded-lg text-[10px] font-black flex items-center gap-1 shadow-md">
            <span>{avgRating}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-black text-gray-800 line-clamp-1 text-sm tracking-tight">{item.name}</h3>
        <p className="text-[10px] text-gray-400 mt-1 h-7 line-clamp-2 leading-relaxed font-medium">
          {item.description}
        </p>
        
        <div className="mt-4 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick(item); // Opens detail view
            }}
            className="flex-1 bg-[#1A1A1A] text-yellow-400 font-black py-2.5 rounded-2xl text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-black/10 hover:bg-black group-hover:shadow-yellow-400/10"
          >
            Add to Feast
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
