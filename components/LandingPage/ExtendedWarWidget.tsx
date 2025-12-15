'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, Wallet, Wifi, WifiOff } from 'lucide-react';

interface Trade {
  id: string;
  createdTime: number;
  side: 'buy' | 'sell' | 'BUY' | 'SELL';
  price: string;
  qty: string;
  value: string;
  fee: string;
  tradeType: string;
}

interface AccountData {
  account: {
    name: string;
  };
  balance: {
    equity?: string;
    availableForTrade?: string;
  };
  trade: Trade[];
}

interface ApiResponse {
  success: boolean;
  data: {
    accounts: AccountData[];
    startPrice?: number;
  };
}

const getIconForAgent = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('gpt') || lowerName.includes('openai') || lowerName.includes('alpha')) {
    return '/openai_icon.png';
  }
  if (lowerName.includes('claude') || lowerName.includes('anthropic') || lowerName.includes('beta')) {
    return '/claude_icon.png';
  }
  if (lowerName.includes('gemini') || lowerName.includes('google')) {
    return '/gemini_icon.png';
  }
  if (lowerName.includes('grok') || lowerName.includes('xai')) {
    return '/grok_icon.png';
  }
  return '/openai_icon.png';
};

// Custom tooltip to display icons
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-black/90 p-3 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg">
        <p className="text-xs text-gray-500 mb-2">{payload[0]?.payload?.fullDate || label}</p>
        {payload.map((entry: any, index: number) => {
          const name = entry.name;
          return (
            <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
              <div className="relative w-4 h-4">
                <Image 
                  src={getIconForAgent(name)} 
                  alt={name}
                  fill
                  sizes="16px"
                  className="object-contain"
                />
              </div>
              <span className="text-sm font-medium" style={{ color: entry.color }}>
                {entry.value.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

// Custom dot component to display icon at the end of the line
const CustomDot = (props: any) => {
  const { cx, cy, index, data, dataKey, iconName } = props;
  
  // Find the last valid index for this dataKey
  let lastValidIndex = -1;
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i][dataKey] !== null && data[i][dataKey] !== undefined) {
      lastValidIndex = i;
      break;
    }
  }

  if (index === lastValidIndex) {
    // Ensure cx and cy are valid numbers before rendering
    if (typeof cx !== 'number' || isNaN(cx) || typeof cy !== 'number' || isNaN(cy)) {
      return null;
    }
    
    return (
      <foreignObject x={cx - 12} y={cy - 12} width={24} height={24}>
        <div className="relative w-6 h-6">
          <Image 
            src={getIconForAgent(iconName)} 
            alt={iconName}
            fill
            sizes="24px"
            className="object-contain"
          />
        </div>
      </foreignObject>
    );
  }
  return null;
};

const ExtendedWarWidget = () => {
  const [data, setData] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [volumes, setVolumes] = useState<{vol0: number, vol1: number}>({ vol0: 0, vol1: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching Extended War data...');
        const response = await fetch('/api/proxy/war/trade-history', {
          headers: {
            'X-API-Secret': '40bab1e52b08e8bac3063128a849382892016cf48cca9c420f42d9f8a07a73db'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();
        
        if (result.success && result.data.accounts) {
          console.log('Successfully fetched Extended War data:', result.data);
          // Use the startPrice from the API if available, otherwise default to 0
          const initialVolume = result.data.startPrice || 0;
          const vols = processData(result.data.accounts, initialVolume);
          
          setVolumes(vols);
          setAccounts(result.data.accounts);
          setIsLive(true);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        console.warn('Failed to fetch Extended War data:', err);
        setIsLive(false);
        // Do not use mock data if API fails to avoid confusion
        // Just show empty state or error
        setVolumes({ vol0: 0, vol1: 0 });
        setAccounts([]);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const processData = (accountsData: AccountData[], initialVolume: number = 0) => {
    const normalizeTime = (t: string | number) => {
      let ts: number;
      // Handle numeric string or number
      if (typeof t === 'number') {
        ts = t;
      } else if (typeof t === 'string' && !isNaN(Number(t))) {
        ts = Number(t);
      } else {
        ts = new Date(t).getTime();
      }
      
      if (isNaN(ts) || ts === 0) return null;
      // Heuristic: if timestamp < 1e11 (Year 1973), assume it's seconds and convert to ms
      if (ts < 100000000000) ts *= 1000; 
      return ts;
    };

    // Pre-process trades with normalized timestamps
    const agent0Trades = (accountsData[0]?.trade || []).map(t => ({
      val: parseFloat(t.value || '0'),
      time: normalizeTime(t.createdTime)
    })).filter(t => t.time !== null) as { val: number, time: number }[];

    const agent1Trades = (accountsData[1]?.trade || []).map(t => ({
      val: parseFloat(t.value || '0'),
      time: normalizeTime(t.createdTime)
    })).filter(t => t.time !== null) as { val: number, time: number }[];

    // Combine all unique timestamps
    const allTimestamps = new Set<number>();
    agent0Trades.forEach(t => allTimestamps.add(t.time));
    agent1Trades.forEach(t => allTimestamps.add(t.time));
    
    const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);
    
    // Check if date range spans multiple days
    const isMultiDay = sortedTimestamps.length > 1 && 
      (sortedTimestamps[sortedTimestamps.length - 1] - sortedTimestamps[0] > 86400000);

    let vol0 = initialVolume;
    let vol1 = initialVolume;
    
    const chartData = sortedTimestamps.map(ts => {
      // For volume chart, we want to show the cumulative volume over time
      // So at each timestamp, we sum up all trades that happened up to that point
      
      // Filter trades up to current timestamp
      const agent0TradesUntilNow = agent0Trades.filter(t => t.time <= ts);
      const agent1TradesUntilNow = agent1Trades.filter(t => t.time <= ts);
      
      // Calculate volumes
      const currentVol0 = initialVolume + agent0TradesUntilNow.reduce((sum, t) => sum + t.val, 0);
      const currentVol1 = initialVolume + agent1TradesUntilNow.reduce((sum, t) => sum + t.val, 0);

      // Store latest volumes for final display
      vol0 = currentVol0;
      vol1 = currentVol1;

      const date = new Date(ts);
      return {
        time: isMultiDay 
          ? date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
          : date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
        fullDate: date.toLocaleString(),
        agent1: currentVol0,
        agent2: currentVol1
      };
    });

    // Add 10 empty data points for future space
    if (sortedTimestamps.length > 0) {
      const lastTimestamp = sortedTimestamps[sortedTimestamps.length - 1];
      for (let i = 1; i <= 10; i++) {
        const futureTime = new Date(lastTimestamp + i * (isMultiDay ? 86400000 / 24 : 300000)); // Adjust spacing
        chartData.push({
          time: isMultiDay 
             ? futureTime.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
             : futureTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
          fullDate: futureTime.toLocaleString(),
          agent1: null as any,
          agent2: null as any
        });
      }
    }

    setData(chartData);
    return { vol0, vol1 };
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-light-primary dark:bg-dark-primary rounded-lg border border-light-200 dark:border-dark-200 p-6 animate-pulse">
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col bg-light-primary dark:bg-dark-primary border border-light-200 dark:border-dark-200 rounded-lg overflow-hidden col-span-1 md:col-span-2 row-span-2 min-h-[300px]">
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
              Extended War
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              AI Trading Agents Competition
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-end">
              <div className="text-xs text-gray-500 mb-1">
                {(accounts[0]?.account?.name || 'Agent 1').replace(/\s*\(.*?\)\s*/g, '')}
              </div>
              <div className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                ${volumes.vol0.toFixed(2)}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-xs text-gray-500 mb-1">
                {(accounts[1]?.account?.name || 'Agent 2').replace(/\s*\(.*?\)\s*/g, '')}
              </div>
              <div className="font-mono text-sm font-semibold text-gray-500 dark:text-gray-400">
                ${volumes.vol1.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full min-h-[200px] [&_.recharts-wrapper]:!outline-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorAgent1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#9ca3af" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAgent2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4b5563" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4b5563" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.3} />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                hide 
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="agent1" 
                stroke="#9ca3af" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorAgent1)" 
                name={accounts[0]?.account?.name || "Agent 1"}
                dot={<CustomDot data={data} dataKey="agent1" iconName={accounts[0]?.account?.name || "Agent 1"} />}
              />
              <Area 
                type="monotone" 
                dataKey="agent2" 
                stroke="#4b5563" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorAgent2)" 
                name={accounts[1]?.account?.name || "Agent 2"}
                dot={<CustomDot data={data} dataKey="agent2" iconName={accounts[1]?.account?.name || "Agent 2"} />}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ExtendedWarWidget;

