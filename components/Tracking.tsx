
import React, { useEffect, useState } from 'react';

const Tracking: React.FC<{ orderId: string }> = ({ orderId }) => {
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(28); // Initial ETA in minutes
  const steps = ['Preparing', 'Quality Check', 'Out for Delivery', 'Arriving Soon'];
  
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 3 ? prev + 1 : prev));
    }, 8000); // Progress updates every 8 seconds for demo purposes

    const etaInterval = setInterval(() => {
      setEta(prev => {
        if (prev <= 1) return 1;
        // Decrease ETA based on current progress speed or randomly
        return prev - 1;
      });
    }, 12000); // ETA drops every 12 seconds

    return () => {
      clearInterval(progressInterval);
      clearInterval(etaInterval);
    };
  }, []);

  // Recalculate or cap ETA based on progress to ensure logical consistency
  const displayEta = Math.max(1, eta - (progress * 5));

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Order ID</p>
          <p className="font-black text-sm text-[#1A1A1A]">#{orderId.toUpperCase()}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Estimated Arrival</p>
          <div className="flex items-center justify-end gap-1.5">
            <span className={`font-black text-lg ${displayEta <= 5 ? 'text-red-500 animate-pulse' : 'text-yellow-600'}`}>
              {displayEta}
            </span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">mins</span>
          </div>
        </div>
      </div>

      <div className="relative h-48 bg-gray-50 rounded-[32px] overflow-hidden mb-8 border border-gray-100 shadow-inner">
        {/* Mock Map View with enhanced styling */}
        <div className="absolute inset-0 opacity-20" 
          style={{ 
            backgroundImage: 'radial-gradient(circle, #EAB308 1px, transparent 1px)', 
            backgroundSize: '24px 24px' 
          }} 
        />
        
        {/* Destination Glow */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-red-500/10 rounded-full blur-xl animate-pulse" />

        <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full p-10">
                {/* Rider Path Mock */}
                <svg className="w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M10,80 Q50,20 90,50" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeDasharray="6,6" />
                </svg>
                
                {/* User Pin */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center">
                   <div className="bg-red-500 p-1.5 rounded-full shadow-lg border-2 border-white z-10">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                     </svg>
                   </div>
                   <span className="text-[8px] font-black uppercase mt-1 text-red-500 bg-white px-1.5 rounded-full shadow-sm">Home</span>
                </div>

                {/* Animated Rider */}
                <div 
                    className="absolute transition-all duration-1000 ease-linear flex flex-col items-center"
                    style={{ 
                        left: `${10 + (progress * 22)}%`, 
                        bottom: `${15 + (progress * 12)}%`
                    }}
                >
                    <div className="bg-yellow-400 p-2.5 rounded-2xl shadow-xl border-2 border-white transform -rotate-6 hover:rotate-0 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="1" y="3" width="15" height="13"></rect>
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                            <circle cx="5.5" cy="18.5" r="2.5"></circle>
                            <circle cx="18.5" cy="18.5" r="2.5"></circle>
                        </svg>
                    </div>
                    <div className="mt-2 bg-[#1A1A1A] text-yellow-400 text-[8px] font-black px-2 py-0.5 rounded-full shadow-md whitespace-nowrap">
                      Rider is {steps[progress].toLowerCase()}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-6 px-2">
        {steps.map((step, idx) => (
          <div key={step} className="flex items-center gap-5 relative">
            {/* Connector Line */}
            {idx < steps.length - 1 && (
              <div className={`absolute left-[7.5px] top-6 w-[2px] h-6 ${idx < progress ? 'bg-yellow-400' : 'bg-gray-100'}`} />
            )}
            
            <div className={`z-10 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-500 ${
              idx < progress ? 'bg-yellow-400' : 
              idx === progress ? 'bg-yellow-400 ring-4 ring-yellow-100 animate-pulse' : 
              'bg-gray-100'
            }`}>
              {idx < progress && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-black" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            
            <div className="flex-1">
              <span className={`text-xs uppercase tracking-widest font-black transition-colors ${idx <= progress ? 'text-[#1A1A1A]' : 'text-gray-300'}`}>
                {step}
              </span>
              {idx === progress && (
                <p className="text-[10px] text-gray-400 font-bold mt-0.5 animate-in slide-in-from-left-2 duration-300">
                  {idx === 0 ? 'Chef is working their magic...' : 
                   idx === 1 ? 'Ensuring everything is perfect...' : 
                   idx === 2 ? 'On the way to your doorstep!' : 
                   'Almost there! Get ready for a feast.'}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 p-5 bg-gray-50 rounded-3xl flex items-center gap-4 border border-gray-100">
        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100 overflow-hidden">
          <img src="https://i.pravatar.cc/150?u=rider" className="w-full h-full object-cover" alt="Rider" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Your Rider</p>
          <p className="font-black text-sm text-gray-800">Sanjeev Kumar</p>
        </div>
        <button className="bg-yellow-400 p-3 rounded-2xl shadow-lg shadow-yellow-200 active:scale-90 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Tracking;
