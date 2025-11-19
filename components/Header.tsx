
import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/solid';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
            <ChartBarIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Arbitrage Scanner
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <nav>
            <a 
              href="https://www.bithumb.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium"
            >
              Go to Bithumb &rarr;
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};
