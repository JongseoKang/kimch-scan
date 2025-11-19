
import React, { useState, useMemo } from 'react';
import { CryptoItem } from '../types';
import { ChevronUpIcon, ChevronDownIcon, ArrowsUpDownIcon } from '@heroicons/react/24/solid';

interface CryptoTableProps {
  data: CryptoItem[];
  loading: boolean;
}

type SortKey = keyof CryptoItem;
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

export const CryptoTable: React.FC<CryptoTableProps> = ({ data, loading }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'tradeValue', direction: 'desc' });

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!data) return [];
    
    const sorted = [...data];
    sorted.sort((a, b) => {
      let aValue: any = a[sortConfig.key];
      let bValue: any = b[sortConfig.key];

      // Handle undefined values for Bybit/Premium/Status
      if (aValue === undefined) aValue = -Infinity;
      if (bValue === undefined) bValue = -Infinity;

      // Handle specific field types
      if (sortConfig.key === 'chgRate') {
        aValue = parseFloat(a.chgRate);
        bValue = parseFloat(b.chgRate);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [data, sortConfig]);

  const formatPrice = (price?: number) => {
    if (price === undefined) return '-';
    if (price === 0) return '0';
    
    // Requirement: Fixed to 6 significant digits for all values
    return new Intl.NumberFormat('ko-KR', {
      minimumSignificantDigits: 6,
      maximumSignificantDigits: 6
    }).format(price);
  };

  const formatVolume = (vol: number) => {
    return new Intl.NumberFormat('ko-KR', {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1
    }).format(vol);
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowsUpDownIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-50 transition-opacity" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUpIcon className="w-4 h-4 text-blue-600" />
      : <ChevronDownIcon className="w-4 h-4 text-blue-600" />;
  };

  const Th = ({ label, sortKey, align = 'right', className = '' }: { label: string, sortKey: SortKey, align?: 'left' | 'right' | 'center', className?: string }) => (
    <th 
      scope="col" 
      className={`px-6 py-3 cursor-pointer group hover:bg-gray-100 transition-colors select-none ${
        align === 'left' ? 'text-left' : align === 'center' ? 'text-center' : 'text-right'
      } ${className}`}
      onClick={() => handleSort(sortKey)}
    >
      <div className={`flex items-center gap-1 ${
        align === 'left' ? 'justify-start' : align === 'center' ? 'justify-center' : 'justify-end'
      }`}>
        {label}
        <SortIcon columnKey={sortKey} />
      </div>
    </th>
  );

  const StatusBadge = ({ status, type }: { status?: number, type: 'IN' | 'OUT' }) => {
    if (status === undefined) return <span className="text-gray-300">-</span>;
    
    const isAvailable = status === 1;
    
    return (
      <div 
        className={`inline-flex flex-col items-center justify-center w-8 h-8 rounded-lg border ${
          isAvailable 
            ? 'bg-green-50 border-green-200 text-green-600' 
            : 'bg-red-50 border-red-200 text-red-600'
        }`}
        title={isAvailable ? `${type === 'IN' ? '입금' : '출금'} 가능` : `${type === 'IN' ? '입금' : '출금'} 중단`}
      >
        <span className="text-[0.6rem] font-bold leading-none mb-0.5">{type}</span>
        <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
      </div>
    );
  };

  // Only show full loader if we have no data (Initial load)
  if (loading && data.length === 0) {
    return (
      <div className="w-full p-10 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!loading && data.length === 0) {
    return (
      <div className="w-full p-10 text-center text-gray-500">
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto transition-opacity duration-200 ${loading ? 'opacity-70' : 'opacity-100'}`}>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
          <tr>
            <Th label="자산" sortKey="symbol" align="left" />
            <Th label="빗썸 (KRW)" sortKey="price" />
            <Th label="바이비트 (KRW)" sortKey="bybitPrice" className="hidden sm:table-cell" />
            <Th label="김프 (%)" sortKey="premium" />
            <Th label="입출금" sortKey="depositStatus" align="center" />
            <Th label="변동률 (24H)" sortKey="chgRate" className="hidden md:table-cell" />
            <Th label="거래금액" sortKey="tradeValue" className="hidden lg:table-cell" />
          </tr>
        </thead>
        <tbody>
          {sortedData.map((coin) => {
            const isUp = parseFloat(coin.chgRate) > 0;
            const isDown = parseFloat(coin.chgRate) < 0;
            const priceColor = isUp ? 'text-red-600' : isDown ? 'text-blue-600' : 'text-gray-900';

            const premium = coin.premium;
            let premiumClass = 'text-gray-500';
            if (premium !== undefined) {
                if (premium > 5) premiumClass = 'text-red-600 font-bold'; // High premium
                else if (premium > 0) premiumClass = 'text-red-500';
                else if (premium < 0) premiumClass = 'text-blue-500';
            }

            return (
              <tr key={coin.symbol} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-200">
                    {coin.symbol.substring(0, 1)}
                  </div>
                  <div>
                    <div>{coin.symbol}</div>
                  </div>
                </td>
                <td className={`px-6 py-4 text-right font-semibold ${priceColor}`}>
                  {formatPrice(coin.price)}
                </td>
                <td className="px-6 py-4 text-right hidden sm:table-cell text-gray-700">
                  {formatPrice(coin.bybitPrice)}
                </td>
                <td className={`px-6 py-4 text-right font-medium ${premiumClass}`}>
                   {premium !== undefined ? `${premium.toFixed(2)}%` : '-'}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-1.5">
                    <StatusBadge status={coin.depositStatus} type="IN" />
                    <StatusBadge status={coin.withdrawalStatus} type="OUT" />
                  </div>
                </td>
                <td className={`px-6 py-4 text-right hidden md:table-cell ${priceColor}`}>
                  <span className={`px-2 py-1 rounded font-medium ${isUp ? 'bg-red-50 text-red-600' : isDown ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                    {parseFloat(coin.chgRate) > 0 ? '+' : ''}{coin.chgRate}%
                  </span>
                </td>
                <td className="px-6 py-4 text-right hidden lg:table-cell text-gray-600">
                  {formatVolume(coin.tradeValue)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
