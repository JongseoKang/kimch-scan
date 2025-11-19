
import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bithumbConnect: string, bithumbSecret: string, bybitKey: string, bybitSecret: string) => void;
  initialBithumbConnectKey?: string;
  initialBithumbSecretKey?: string;
  initialBybitApiKey?: string;
  initialBybitSecretKey?: string;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialBithumbConnectKey = '',
  initialBithumbSecretKey = '',
  initialBybitApiKey = '',
  initialBybitSecretKey = ''
}) => {
  const [bithumbConnectKey, setBithumbConnectKey] = useState(initialBithumbConnectKey);
  const [bithumbSecretKey, setBithumbSecretKey] = useState(initialBithumbSecretKey);
  const [bybitApiKey, setBybitApiKey] = useState(initialBybitApiKey);
  const [bybitSecretKey, setBybitSecretKey] = useState(initialBybitSecretKey);

  useEffect(() => {
    if (isOpen) {
      setBithumbConnectKey(initialBithumbConnectKey);
      setBithumbSecretKey(initialBithumbSecretKey);
      setBybitApiKey(initialBybitApiKey);
      setBybitSecretKey(initialBybitSecretKey);
    }
  }, [isOpen, initialBithumbConnectKey, initialBithumbSecretKey, initialBybitApiKey, initialBybitSecretKey]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(bithumbConnectKey, bithumbSecretKey, bybitApiKey, bybitSecretKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">거래소 API 설정</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Bithumb Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-500 rounded-sm"></span>
              Bithumb API
            </h3>
            <div className="pl-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Connect Key (Public)</label>
                <input
                  type="text"
                  value={bithumbConnectKey}
                  onChange={(e) => setBithumbConnectKey(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Bithumb Connect Key 입력"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Secret Key (Private)</label>
                <input
                  type="password"
                  value={bithumbSecretKey}
                  onChange={(e) => setBithumbSecretKey(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Bithumb Secret Key 입력"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Bybit Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-8 bg-yellow-500 rounded-sm"></span>
              Bybit API
            </h3>
            <div className="pl-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">API Key</label>
                <input
                  type="text"
                  value={bybitApiKey}
                  onChange={(e) => setBybitApiKey(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                  placeholder="Bybit API Key 입력"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">API Secret</label>
                <input
                  type="password"
                  value={bybitSecretKey}
                  onChange={(e) => setBybitSecretKey(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                  placeholder="Bybit API Secret 입력"
                />
              </div>
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex flex-col gap-3">
            <p className="text-xs text-gray-500 text-center">
              🔒 입력된 키는 브라우저의 로컬 스토리지에만 안전하게 저장됩니다.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors shadow-lg"
              >
                설정 저장
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};
