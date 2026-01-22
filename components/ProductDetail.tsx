
import React, { useState, useMemo } from 'react';
import { MenuItem, Review, DeliverySpeed } from '../types';

interface ProductDetailProps {
  item: MenuItem;
  onClose: () => void;
  onAddReview: (productId: string, rating: number, comment: string) => void;
  onAddToCart: (item: MenuItem, variant?: string, quantity?: number, speed?: DeliverySpeed) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ item, onClose, onAddReview, onAddToCart }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(item.variants?.[0]);
  const [selectedSpeed, setSelectedSpeed] = useState<DeliverySpeed>('Standard');

  const speedCosts = {
    'Standard': 0,
    'Express': 29
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onAddReview(item.id, rating, comment);
      setComment('');
      setRating(5);
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const ratingStats = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0]; // index 1-5
    item.reviews?.forEach(r => counts[r.rating]++);
    const total = item.reviews?.length || 0;
    const avg = total > 0 
      ? (item.reviews!.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1)
      : "0.0";
    return { counts, total, avg };
  }, [item.reviews]);

  const unitPrice = item.price + speedCosts[selectedSpeed];
  const totalPrice = unitPrice * quantity;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 px-4 pb-4">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full duration-500">
        {/* Header Image */}
        <div className="relative h-64">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-xl hover:bg-red-50 hover:text-red-500 transition-all z-20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 -mt-12 relative z-10 max-h-[70vh] overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-3xl font-black text-[#1A1A1A]">{item.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="bg-yellow-400 text-black px-2 py-0.5 rounded-lg text-xs font-black flex items-center gap-1">
                  {ratingStats.avg}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">{ratingStats.total} Reviews</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-yellow-600">₹{item.price}</p>
            </div>
          </div>

          <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">{item.description}</p>

          <div className="flex flex-col gap-6 mb-8">
            {item.variants && (
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3">Choose Variant</p>
                <div className="flex gap-2">
                  {item.variants.map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-tight transition-all ${
                        selectedVariant === v 
                          ? 'bg-[#1A1A1A] text-yellow-400' 
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3">Delivery Speed</p>
              <div className="flex gap-2">
                {(['Standard', 'Express'] as DeliverySpeed[]).map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setSelectedSpeed(speed)}
                    className={`flex-1 px-4 py-3 rounded-2xl border transition-all flex flex-col items-center gap-1 ${
                      selectedSpeed === speed 
                        ? 'bg-[#1A1A1A] border-[#1A1A1A] text-yellow-400 shadow-lg' 
                        : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-tighter">{speed}</span>
                    <span className="text-[10px] font-bold">
                      {speed === 'Standard' ? 'Free' : `+₹${speedCosts[speed]}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3">Quantity</p>
              <div className="flex items-center gap-6 bg-gray-50 w-fit p-1 rounded-2xl border border-gray-100">
                <button 
                  onClick={decrementQuantity}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-red-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-lg font-black text-[#1A1A1A] min-w-[1.5rem] text-center">{quantity}</span>
                <button 
                  onClick={incrementQuantity}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-green-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onAddToCart(item, selectedVariant, quantity, selectedSpeed);
              onClose();
            }}
            className="w-full bg-[#1A1A1A] text-yellow-400 font-black py-4 rounded-3xl mb-12 shadow-xl shadow-yellow-900/10 active:scale-95 transition-all flex justify-between px-6 items-center"
          >
            <span className="text-sm tracking-widest uppercase">Add {quantity} to Feast</span>
            <span className="text-lg">₹{totalPrice}</span>
          </button>

          {/* Ratings Summary */}
          <div className="mb-10 p-6 bg-gray-50 rounded-[32px] border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-gray-800">Ratings</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Summary of {ratingStats.total} reviews</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-yellow-600 leading-none">{ratingStats.avg}</p>
                <div className="flex text-yellow-500 mt-1 justify-end">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-gray-400 w-2">{s}</span>
                  <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full transition-all duration-1000" 
                      style={{ width: `${ratingStats.total > 0 ? (ratingStats.counts[s] / ratingStats.total) * 100 : 0}%` }} 
                    />
                  </div>
                  <span className="text-[10px] font-black text-gray-300 w-4">{ratingStats.counts[s]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-6 bg-yellow-400 rounded-full" />
                Customer Stories
              </h3>
              
              <div className="space-y-4">
                {item.reviews && item.reviews.length > 0 ? (
                  item.reviews.map((rev) => (
                    <div key={rev.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-yellow-50 rounded-full flex items-center justify-center text-[10px] font-black text-yellow-700 uppercase">
                            {rev.userName[0]}
                          </div>
                          <div>
                            <span className="font-black text-gray-800 text-xs block">{rev.userName}</span>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{new Date(rev.timestamp).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`h-2.5 w-2.5 ${i < rev.rating ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-500 text-xs font-medium leading-relaxed italic border-l-2 border-yellow-200 pl-3">"{rev.comment}"</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-6 text-sm italic">Be the first to share your experience!</p>
                )}
              </div>
            </div>

            {/* Leave a Review */}
            <form onSubmit={handleSubmitReview} className="bg-[#1A1A1A] p-6 rounded-[32px] text-white shadow-2xl shadow-black/20">
              <h4 className="font-black mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                </svg>
                Rate this dish
              </h4>
              
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      rating >= s ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'bg-white/10 text-gray-400 hover:bg-white/20'
                    }`}
                  >
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was it? Tell the community..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-yellow-400/50 transition-colors mb-4 resize-none h-24 font-medium"
              />

              <button
                type="submit"
                className="w-full bg-yellow-400 text-black font-black py-3 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-yellow-400/10 active:scale-95 transition-all"
              >
                Post Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
