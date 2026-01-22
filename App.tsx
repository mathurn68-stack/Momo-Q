
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Tracking from './components/Tracking';
import { MENU_ITEMS as INITIAL_MENU_ITEMS } from './constants';
import { MenuItem, CartItem, Category, Order, UserProfile, Review, LoyaltyTier, TierType, DeliverySpeed } from './types';

type SortCriteria = 'date' | 'amount' | 'points';

const TIERS: LoyaltyTier[] = [
  { name: 'Bronze', minPoints: 0, benefits: ['Earn 1 Q-Coin per ₹10'], color: '#CD7F32' },
  { name: 'Silver', minPoints: 500, benefits: ['10% Bonus Q-Coins', 'Free Delivery'], color: '#C0C0C0' },
  { name: 'Gold', minPoints: 1500, benefits: ['20% Bonus Q-Coins', 'Early Access', 'Secret Menu'], color: '#EAB308' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'cart' | 'tracking' | 'profile'>('home');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [sortBy, setSortBy] = useState<SortCriteria>('date');
  const [user, setUser] = useState<UserProfile>({
    name: 'Momo Lover',
    points: 450,
    history: []
  });

  const speedCosts = {
    'Standard': 0,
    'Express': 29
  };

  const currentTier = useMemo(() => {
    return [...TIERS].reverse().find(t => user.points >= t.minPoints) || TIERS[0];
  }, [user.points]);

  const nextTier = useMemo(() => {
    return TIERS.find(t => t.minPoints > user.points) || null;
  }, [user.points]);

  const tierProgress = useMemo(() => {
    if (!nextTier) return 100;
    const currentTierMin = currentTier.minPoints;
    const nextTierMin = nextTier.minPoints;
    return ((user.points - currentTierMin) / (nextTierMin - currentTierMin)) * 100;
  }, [user.points, currentTier, nextTier]);

  const featuredItems = useMemo(() => {
    return menuItems.filter(item => item.featured);
  }, [menuItems]);

  const categories: (Category | 'All')[] = ['All', 'Momos', 'Burgers', 'Fries', 'Pizzas', 'Drinks'];

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return menuItems;
    return menuItems.filter(item => item.category === activeCategory);
  }, [activeCategory, menuItems]);

  const allReviews = useMemo(() => {
    const reviews: (Review & { productName: string, productImage: string, productId: string })[] = [];
    menuItems.forEach(item => {
      item.reviews?.forEach(r => {
        reviews.push({ ...r, productName: item.name, productImage: item.image, productId: item.id });
      });
    });
    return reviews.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
  }, [menuItems]);

  const sortedHistory = useMemo(() => {
    const history = [...user.history];
    switch (sortBy) {
      case 'amount':
        return history.sort((a, b) => b.total - a.total);
      case 'points':
        return history.sort((a, b) => b.pointsEarned - a.pointsEarned);
      case 'date':
      default:
        return history.sort((a, b) => b.timestamp - a.timestamp);
    }
  }, [user.history, sortBy]);

  const addToCart = (item: MenuItem, variant?: string, quantity: number = 1, speed: DeliverySpeed = 'Standard') => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.selectedVariant === variant && i.deliverySpeed === speed);
      if (existing) {
        return prev.map(i => 
          i.id === item.id && i.selectedVariant === variant && i.deliverySpeed === speed
            ? { ...i, quantity: i.quantity + quantity } 
            : i
        );
      }
      return [...prev, { ...item, quantity: quantity, selectedVariant: variant, deliverySpeed: speed }];
    });
  };

  const handleAddReview = (productId: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      userName: user.name,
      rating,
      comment,
      timestamp: Date.now()
    };

    setMenuItems(prev => prev.map(item => 
      item.id === productId 
        ? { ...item, reviews: [newReview, ...(item.reviews || [])] } 
        : item
    ));

    if (selectedProduct?.id === productId) {
      setSelectedProduct(prev => prev ? { ...prev, reviews: [newReview, ...(prev.reviews || [])] } : null);
    }
  };

  const removeFromCart = (itemId: string, variant?: string, speed?: DeliverySpeed) => {
    setCart(prev => prev.filter(i => !(i.id === itemId && i.selectedVariant === variant && i.deliverySpeed === speed)));
  };

  const cartTotal = cart.reduce((acc, item) => {
    const itemSpeedCost = speedCosts[item.deliverySpeed || 'Standard'];
    return acc + ((item.price + itemSpeedCost) * item.quantity);
  }, 0);
  
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = () => {
    let multiplier = 1;
    if (currentTier.name === 'Silver') multiplier = 1.1;
    if (currentTier.name === 'Gold') multiplier = 1.2;

    const basePoints = Math.floor(cartTotal / 10);
    const pointsToEarn = Math.floor(basePoints * multiplier);
    
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      items: [...cart],
      total: cartTotal,
      status: 'Delivered',
      timestamp: Date.now(),
      pointsEarned: pointsToEarn
    };
    
    setCurrentOrder(newOrder);
    setCart([]);
    setUser(prev => ({
      ...prev,
      points: prev.points + pointsToEarn,
      history: [newOrder, ...prev.history]
    }));
    setActiveTab('tracking');
  };

  const openReviewModal = (productId: string) => {
    const item = menuItems.find(i => i.id === productId);
    if (item) {
      setSelectedProduct(item);
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-[#FDFBF7]">
      <Header />

      <main className="max-w-md mx-auto px-4 pt-6">
        
        {activeTab === 'home' && (
          <>
            {/* Promo Hero Section */}
            <div className="relative h-48 w-full rounded-3xl overflow-hidden mb-8 shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1626777552726-4a6b52c67ebf?auto=format&fit=crop&q=80&w=1000" 
                className="w-full h-full object-cover" 
                alt="Promo" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <span className="bg-yellow-400 text-black text-[10px] font-black uppercase px-2 py-1 rounded w-fit mb-2">Weekend Special</span>
                <h2 className="text-white text-2xl font-black leading-tight">Get 20% OFF on<br/>all Fusion Momos</h2>
                <p className="text-gray-300 text-xs mt-1">Use code: MOMOPARTY</p>
              </div>
            </div>

            {/* Enhanced Loyalty Banner with Tiers */}
            <div className="bg-[#1A1A1A] rounded-[32px] p-6 mb-8 shadow-2xl text-white relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: currentTier.color }}>
                        {currentTier.name} Member
                      </p>
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: currentTier.color }} />
                    </div>
                    <div className="flex items-end gap-2 mt-1">
                      <span className="text-4xl font-black">{user.points}</span>
                      <span className="text-sm text-gray-400 mb-1">Q-Coins</span>
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md p-2 rounded-2xl border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" style={{ color: currentTier.color }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(234,179,8,0.3)]" 
                      style={{ width: `${tierProgress}%`, backgroundColor: currentTier.color }} 
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
                    <span style={{ color: currentTier.color }}>{currentTier.minPoints}</span>
                    {nextTier ? (
                      <span className="text-gray-500">
                        {nextTier.minPoints - user.points} to {nextTier.name}
                      </span>
                    ) : (
                      <span className="text-yellow-400">Max Tier Reached</span>
                    )}
                    <span className="text-gray-500">{nextTier?.minPoints || '∞'}</span>
                  </div>
                </div>

                <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar py-1">
                  {currentTier.benefits.map((benefit, i) => (
                    <span key={i} className="whitespace-nowrap bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-[9px] font-bold text-gray-300">
                      ✓ {benefit}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Decorative backgrounds */}
              <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full blur-[80px] opacity-20" style={{ backgroundColor: currentTier.color }} />
              <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full blur-[80px] opacity-10" style={{ backgroundColor: currentTier.color }} />
            </div>

            {/* Featured Products Section */}
            <div className="mb-10">
              <div className="flex justify-between items-end mb-4 px-2">
                <div>
                  <h3 className="text-xl font-black text-gray-800 leading-tight">Featured Bites</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Hand-picked by our Chefs</p>
                </div>
              </div>
              <div className="flex overflow-x-auto gap-5 pb-4 no-scrollbar -mx-4 px-4 scroll-smooth">
                {featuredItems.map((item) => (
                  <div 
                    key={`featured-${item.id}`}
                    onClick={() => setSelectedProduct(item)}
                    className="min-w-[280px] relative h-44 rounded-[32px] overflow-hidden shadow-xl active:scale-[0.98] transition-all group cursor-pointer border border-white/20"
                  >
                    <img src={item.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" alt={item.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    
                    <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      Featured
                    </div>

                    <div className="absolute bottom-5 left-5 right-5">
                      <div className="flex justify-between items-end">
                        <div>
                          <h4 className="text-white text-lg font-black leading-tight drop-shadow-md">{item.name}</h4>
                          <p className="text-white/70 text-[10px] font-bold uppercase tracking-wide mt-0.5 line-clamp-1">{item.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-yellow-400 text-lg font-black">₹{item.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Chips */}
            <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar -mx-4 px-4 scroll-smooth">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                    activeCategory === cat 
                      ? 'bg-[#1A1A1A] text-yellow-400 shadow-[0_4px_15px_rgba(0,0,0,0.15)] scale-105' 
                      : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100 shadow-sm'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {filteredItems.map(item => (
                <ProductCard 
                  key={item.id} 
                  item={item} 
                  onAddToCart={addToCart} 
                  onClick={setSelectedProduct} 
                />
              ))}
            </div>

            {/* Recent Reviews section */}
            {allReviews.length > 0 && (
              <div className="mt-12 mb-8">
                <div className="flex justify-between items-end mb-4 px-2">
                   <div>
                      <h3 className="text-xl font-black text-gray-800 leading-tight">Momo Lovers Say</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Recent Community Stories</p>
                   </div>
                </div>
                <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 px-4">
                  {allReviews.map((rev, idx) => (
                    <div 
                      key={`${rev.productId}-${idx}`}
                      onClick={() => openReviewModal(rev.productId)}
                      className="min-w-[240px] bg-white p-4 rounded-[32px] border border-gray-100 shadow-sm flex flex-col gap-3 active:scale-95 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img src={rev.productImage} className="w-10 h-10 rounded-xl object-cover shadow-sm" alt={rev.productName} />
                        <div className="flex-1 overflow-hidden">
                          <p className="text-[10px] font-black text-gray-800 line-clamp-1">{rev.productName}</p>
                          <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`h-2 w-2 ${i < rev.rating ? 'fill-current' : 'text-gray-100'}`} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium line-clamp-2 italic leading-relaxed">"{rev.comment}"</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-[9px] font-black text-yellow-600 uppercase tracking-tighter">@{rev.userName.split(' ')[0]}</span>
                        <span className="text-[8px] text-gray-300 font-bold uppercase">{new Date(rev.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'cart' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-black text-[#1A1A1A] mb-6">Your Order</h2>
            {cart.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">Your cart is feeling light...</p>
                <button onClick={() => setActiveTab('home')} className="mt-4 bg-yellow-400 text-black px-8 py-3 rounded-2xl font-black shadow-lg hover:shadow-yellow-200 transition-all">Start Adding</button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-3">
                  {cart.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="bg-white p-4 rounded-3xl flex items-center gap-4 shadow-sm border border-gray-100">
                      <img src={item.image} className="w-20 h-20 rounded-2xl object-cover shadow-sm" alt={item.name} />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 leading-tight">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">{item.selectedVariant || 'Standard'}</p>
                          <span className="w-1 h-1 bg-gray-200 rounded-full" />
                          <p className={`text-[9px] font-black uppercase tracking-wide ${item.deliverySpeed === 'Express' ? 'text-red-500' : 'text-gray-400'}`}>
                            {item.deliverySpeed}
                          </p>
                        </div>
                        <p className="font-black text-yellow-600 mt-2">₹{(item.price + speedCosts[item.deliverySpeed || 'Standard']) * item.quantity}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id, item.selectedVariant, item.deliverySpeed)}
                        className="bg-gray-50 p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
                   <div className="flex justify-between text-sm">
                     <span className="text-gray-500 font-medium">Subtotal</span>
                     <span className="font-bold">₹{cartTotal}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-gray-500 font-medium">Delivery Fee</span>
                     {currentTier.name !== 'Bronze' ? (
                       <span className="font-bold text-green-600 uppercase text-xs">FREE (TIER BENEFIT)</span>
                     ) : (
                       <span className="font-bold">₹40</span>
                     )}
                   </div>
                   <div className="h-px bg-gray-50 my-2" />
                   <div className="flex justify-between items-baseline">
                     <span className="text-gray-800 font-black">Total Amount</span>
                     <span className="text-2xl font-black text-yellow-600">₹{cartTotal + (currentTier.name === 'Bronze' ? 40 : 0)}</span>
                   </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-[#1A1A1A] text-yellow-400 font-black py-5 rounded-3xl text-lg shadow-2xl shadow-yellow-900/10 hover:scale-[1.01] active:scale-95 transition-all"
                >
                  Confirm & Pay
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-8">
            <div className="flex items-center gap-5 p-2">
               <div 
                 className="relative w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-black shadow-lg rotate-3 border-4 border-white overflow-hidden"
                 style={{ backgroundColor: currentTier.color }}
               >
                 {user.name[0]}
                 <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
               </div>
               <div>
                 <h2 className="text-2xl font-black text-[#1A1A1A]">{user.name}</h2>
                 <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border" style={{ borderColor: currentTier.color, color: currentTier.color, backgroundColor: `${currentTier.color}10` }}>
                      {currentTier.name} Elite
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{user.points} Q-Coins</span>
                 </div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
              <h3 className="text-sm font-black text-gray-800 mb-4 flex items-center gap-2 uppercase tracking-widest">
                <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: currentTier.color }} />
                Your Tier Benefits
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {currentTier.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-white shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" style={{ color: currentTier.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Total Orders</p>
                  <p className="text-3xl font-black mt-1 text-gray-800">{user.history.length}</p>
               </div>
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Rewards Claimed</p>
                  <p className="text-3xl font-black mt-1 text-gray-800">4</p>
               </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <h3 className="font-black text-gray-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Order History
                </h3>
              </div>
              <div className="divide-y divide-gray-50">
                {sortedHistory.map(order => (
                  <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors flex flex-col gap-3 group">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-yellow-100 group-hover:text-yellow-600 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-800">#{order.id.toUpperCase()}</p>
                          <p className="text-[10px] text-gray-400 font-bold">{new Date(order.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="font-black text-gray-800">₹{order.total}</p>
                         <p className="text-[10px] font-black" style={{ color: currentTier.color }}>+{order.pointsEarned} Q-COINS</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tracking' && currentOrder && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-black text-[#1A1A1A] mb-6">Live Tracking</h2>
            <Tracking orderId={currentOrder.id} />
          </div>
        )}

      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-gray-100 p-3 px-8 flex justify-between items-center z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        {[
          { id: 'home', label: 'Feed', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
          { id: 'cart', label: 'Cart', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', count: cartCount },
          { id: 'tracking', label: 'Track', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
          { id: 'profile', label: 'Elite', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === tab.id ? 'text-yellow-600 scale-110' : 'text-gray-300 hover:text-gray-500'}`}
          >
            {tab.count && tab.count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-lg shadow-red-200 z-10">
                {tab.count}
              </span>
            )}
            <div className={`p-2 rounded-xl ${activeTab === tab.id ? 'bg-yellow-50 shadow-sm shadow-yellow-100' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={activeTab === tab.id ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </nav>

      {selectedProduct && (
        <ProductDetail 
          item={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddReview={handleAddReview}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
};

export default App;
