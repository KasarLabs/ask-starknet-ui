'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, RefreshCw, AlertCircle, TrendingUp, Layers, Coins, ArrowRightLeft, Landmark, ChevronDown } from 'lucide-react';

export type Token = {
  symbol: string;
  address: string;
  decimals: number;
};

export type RouteToken = {
  symbol?: string;
  address: string;
  decimals?: number;
};

export type RouteHop = {
  dex: string;
  pool?: string;
  quote_out?: string;
};

export type Route = {
  from_token: RouteToken;
  to_token: RouteToken;
  amount_in: string;
  min_amount_out?: string;
  slippage_bps?: number;
  hops?: RouteHop[];
  quote_provider?: string;
  quote_valid_until?: string;
};

export type Yield = {
  protocol: string;
  apy_pct: number;
  deposit_token: Token[];
  pool_or_contract_address?: string | null;
  source: string;
  snapshot_at?: string | null;
};

export type APIResponse = {
  sucess: boolean;
  tokenAddress: string;
  amount: string;
  result: {
    yield: Yield;
    routes: Route[];
    errors?: string[];
    [key: string]: unknown;
  }
};

const TOKENS = [
  { symbol: 'ETH', address: '0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7', decimals: 18 },
  { symbol: 'STRK', address: '0x04718f5a0Fc34cC1AF16A1cdee98fFB20C31f5cD61D6Ab07201858f4287c938D', decimals: 18 },
  { symbol: 'USDC', address: '0x053C91253BC9682c04929cA02ED00b3E423f6710D2ee7e0D5EBB06F3eCF368A8', decimals: 6 },
  { symbol: 'USDT', address: '0x068F5c6a61780768455de69077E07e89787839bf8166dEcfBf92B645209c0fB8', decimals: 6 },
  { symbol: 'DAI', address: '0x00dA114221cb83fa859DBdb4C44bEeaa0BB37C7537ad5ae66Fe5e0efD20E6eB3', decimals: 18 },
  { symbol: 'WBTC', address: '0x03Fe2b97C1Fd336E750087D68B9b867997Fd64a2661fF3ca5A7C771641e8e7AC', decimals: 8 },
];

const YieldWidget = () => {
  const [data, setData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]); // Default to ETH
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const amount = (BigInt(10) ** BigInt(selectedToken.decimals)).toString(); // 1 unit of token
      
      const response = await fetch('/api/proxy/yield/get_path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-secret': '40bab1e52b08e8bac3063128a849382892016cf48cca9c420f42d9f8a07a73db',
        },
        body: JSON.stringify({
          address: selectedToken.address,
          amount: amount
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}. Message: ${errorText}`);
      }

      const result: APIResponse = await response.json();
      
      if (result.sucess || result.result) { // Handle typo in API response 'sucess' or just check result
        console.log('API Result:', result);
        setData(result);
      } else {
        throw new Error('API returned unsuccessful status');
      }
    } catch (err) {
      console.error('Failed to fetch Yield data:', err);
      setError('Failed to load yield data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedToken]);

  // Refresh interval
  useEffect(() => {
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [selectedToken]);

  if (loading && !data) {
    return (
      <div className="col-span-1 md:col-span-2 row-span-1 min-h-[300px] w-full h-full flex items-center justify-center bg-light-primary dark:bg-dark-primary rounded-lg border border-light-200 dark:border-dark-200 p-6 animate-pulse">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="col-span-1 md:col-span-2 row-span-1 min-h-[300px] group relative flex flex-col bg-light-primary dark:bg-dark-primary border border-light-200 dark:border-dark-200 rounded-lg overflow-hidden p-6 justify-center items-center text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Error Loading Data</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{error}</p>
        <button 
          onClick={fetchData}
          className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg text-sm transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  const yieldData = data?.result.yield;
  const routes = data?.result.routes || [];
  const primaryRoute = routes[0]; // Assuming we display the first route

  return (
    <div className="col-span-1 md:col-span-2 row-span-1 min-h-[300px] group relative flex flex-col bg-light-primary dark:bg-dark-primary border border-light-200 dark:border-dark-200 rounded-lg overflow-hidden">
      <div className="p-6 flex flex-col h-full relative">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Yield Optimizer</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Starknet yield explorer agent
              </p>
            </div>
          </div>
          <button 
            onClick={fetchData}
            className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-black/40 hover:text-black/60 dark:text-white/40 dark:hover:text-white/60 transition-colors ${loading ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Main Content - APY */}
        <div className="flex-1 flex flex-col justify-center items-center py-6">
          <div className="text-center">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {yieldData?.deposit_token?.[0]?.symbol ? `APY on ${yieldData.deposit_token[0].symbol}` : 'Estimated APY'}
            </span>
            <div className="mt-2 flex items-baseline justify-center gap-1">
              <span className="text-6xl font-black text-gray-900 dark:text-white">
                {yieldData?.apy_pct?.toFixed(2) ?? '0.00'}
              </span>
              <span className="text-3xl font-bold text-gray-500 dark:text-gray-400">%</span>
            </div>
          </div>
        </div>

        {/* Footer - Path/Route */}
        <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Optimization Strategy</span>
            </div>
            
            {/* Token Selector moved here */}
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 px-2 py-1 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors group"
              >
                <span className="text-xs text-gray-900 dark:text-white font-medium">
                  Start with 1 {selectedToken.symbol}
                </span>
                <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-[#1a1a1a] border border-light-200 dark:border-dark-200 rounded-lg shadow-xl z-20 py-1 overflow-hidden">
                    {TOKENS.map((token) => (
                      <button
                        key={token.symbol}
                        onClick={() => {
                          setSelectedToken(token);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center justify-between ${
                          selectedToken.symbol === token.symbol 
                            ? 'text-black dark:text-white bg-gray-50 dark:bg-white/5 font-medium' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        <span>{token.symbol}</span>
                        {selectedToken.symbol === token.symbol && (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-lg p-3 overflow-x-auto">
            <div className="flex items-center min-w-max gap-3 text-sm">
              {primaryRoute || yieldData ? (
                <>
                  {/* Start Token */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-gray-500 mb-1 font-medium uppercase tracking-wide">Start with</span>
                    <div className="flex items-center gap-2 px-3 py-2 bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200 rounded-lg">
                      <Coins className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-bold text-sm text-black dark:text-white">1 {selectedToken.symbol}</span>
                    </div>
                  </div>
                  
                  {/* Route Steps */}
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-black/40 dark:text-white/40" />
                    {primaryRoute && primaryRoute.hops && primaryRoute.hops.length > 0 ? (
                      primaryRoute.hops.map((hop, index) => (
                        <div key={index} className="flex flex-col items-center">
                           <span className="text-[10px] text-gray-500 mb-1 font-medium uppercase tracking-wide">Action</span>
                           <div className="flex items-center gap-2 px-3 py-2 bg-black/5 dark:bg-white/5 border border-light-200 dark:border-dark-200 rounded-lg border-dashed">
                             <ArrowRightLeft className="w-3.5 h-3.5 text-gray-400" />
                             <span className="text-black/70 dark:text-white/70 font-medium text-xs">Swap on {hop.dex}</span>
                           </div>
                        </div>
                      ))
                    ) : (
                      /* Fallback or Direct Deposit */
                      (selectedToken.symbol !== yieldData?.deposit_token?.[0]?.symbol) ? (
                        <div className="flex flex-col items-center">
                           <span className="text-[10px] text-gray-500 mb-1 font-medium uppercase tracking-wide">Action</span>
                           <div className="flex items-center gap-2 px-3 py-2 bg-black/5 dark:bg-white/5 border border-light-200 dark:border-dark-200 rounded-lg border-dashed">
                             <ArrowRightLeft className="w-3.5 h-3.5 text-gray-400" />
                             <span className="text-black/70 dark:text-white/70 font-medium text-xs">Swap to {yieldData?.deposit_token?.[0]?.symbol || 'Target'}</span>
                           </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Direct Deposit</span>
                      )
                    )}
                    <ArrowRight className="w-4 h-4 text-black/40 dark:text-white/40" />
                  </div>

                  {/* End Destination */}
                  <div className="flex flex-col items-center">
                     <span className="text-[10px] text-gray-500 mb-1 font-medium uppercase tracking-wide">Yield Source</span>
                     <div className="flex items-center gap-2 px-3 py-2 bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200 rounded-lg">
                        <div className="flex flex-col items-start">
                          <div className="flex items-center gap-1.5">
                            <Landmark className="w-3.5 h-3.5 text-gray-400" />
                            <span className="font-bold text-sm text-black dark:text-white leading-none">
                              {yieldData?.protocol || 'Protocol'}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 leading-none mt-1 pl-5">
                            {yieldData?.deposit_token?.[0]?.symbol || primaryRoute?.to_token?.symbol} Pool
                          </span>
                        </div>
                     </div>
                  </div>
                </>
              ) : (
                <span className="text-gray-500 dark:text-gray-400 italic">No route details available</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YieldWidget;

