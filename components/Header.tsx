
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-[#1A1A1A] text-white p-4 sticky top-0 z-50 shadow-lg flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center overflow-hidden border-2 border-yellow-500">
          <img 
            src="https://raw.githubusercontent.com/the-momo-q/logo/main/logo.png" 
            alt="Momo-Q" 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/logo/100/100';
            }}
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-yellow-400 leading-none">MOMO-Q</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">Healthy Diet & Tasty Bite</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
