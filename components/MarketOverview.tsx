
import React, { useState, useEffect } from 'react';
import { CryptoItem } from '../types';
import { generateMarketAnalysis } from '../services/geminiService';
import { LightBulbIcon } from '@heroicons/react/24/outline';

interface MarketOverviewProps {
  topMovers: CryptoItem[];
  loading: boolean;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({ topMovers, loading }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(false);

  useEffect(() => {
    // Only analyze once when data is loaded and available, to save API calls
    if (!loading && topMovers.length > 0 && !hasAnalyzed) {
      const fetchAnalysis = async () => {
        setIsAnalyzing(true);
        const result = await generateMarketAnalysis(topMovers);
        setAnalysis(result);
        setIsAnalyzing(false);
        setHasAnalyzed(true);
      };
      fetchAnalysis();
    }
  }, [topMovers, loading, hasAnalyzed]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-start gap-4">
        <div className="bg-blue-50 p-3 rounded-full hidden md:block">
          <LightBulbIcon className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">AI Market Briefing</h3>
          <div className="text-gray-600 leading-relaxed min-h-[3rem]">
            {loading ? (
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                데이터 수집 중...
              </span>
            ) : isAnalyzing ? (
              <span className="flex items-center gap-2 text-sm text-blue-600">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                Gemini가 시장 데이터를 분석하고 있습니다...
              </span>
            ) : (
              <p className="text-sm md:text-base font-medium text-gray-700">
                {analysis}
              </p>
            )}
          </div>
          
          {/* Mini chips for top movers */}
          <div className="mt-4 flex flex-wrap gap-2">
            {!loading && topMovers.map((coin) => (
              <span 
                key={coin.symbol} 
                className={`text-xs px-2 py-1 rounded font-medium border ${
                  parseFloat(coin.chgRate) >= 0 
                  ? 'border-red-200 bg-red-50 text-red-600' 
                  : 'border-blue-200 bg-blue-50 text-blue-600'
                }`}
              >
                {coin.symbol} {parseFloat(coin.chgRate) > 0 ? '+' : ''}{coin.chgRate}%
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
