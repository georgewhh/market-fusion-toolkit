
import React, { useState } from 'react';
import { Bar, Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import TimelineSlider from './TimelineSlider';

interface InstitutionalFundCardProps {
  className?: string;
}

const generateFundData = () => {
  const dates = [
    '03-01', '03-02', '03-05', '03-06', '03-07', '03-08', '03-09', 
    '03-12', '03-13', '03-14', '03-15', '03-16', '03-19', '03-20', 
    '03-21', '03-22', '03-23', '03-26', '03-27', '03-28', '03-29',
    '04-01', '04-02', '04-03', '04-04', '04-05'
  ];
  
  return dates.map((date) => {
    const netBuy = Math.random() * 200 - 100; // Range from -100 to 100
    return {
      date,
      netBuy,
      tradingRatio: Math.random() * 30 + 10, // Range from 10% to 40%
    };
  });
};

const fundData = generateFundData();

const InstitutionalFundCard: React.FC<InstitutionalFundCardProps> = ({ className }) => {
  const [timeRange, setTimeRange] = useState<[number, number]>([
    Math.max(0, fundData.length - 20), 
    fundData.length - 1
  ]);
  
  const [visibleSeries, setVisibleSeries] = useState({
    tradingRatio: true
  });
  
  const toggleSeries = (series: keyof typeof visibleSeries) => {
    setVisibleSeries(prev => ({
      ...prev,
      [series]: !prev[series]
    }));
  };
  
  const visibleData = fundData.slice(timeRange[0], timeRange[1] + 1);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-market-card p-3 border border-market-border rounded shadow-lg">
          <p className="text-sm font-semibold mb-1">{label}</p>
          <p className="text-xs" style={{ color: payload[0].value >= 0 ? '#D83C3C' : '#0F9948' }}>
            机构净买入: {payload[0].value.toFixed(2)}亿
          </p>
          {payload[1] && visibleSeries.tradingRatio && (
            <p className="text-xs text-market-yellow">
              机构成交占比: {payload[1].value.toFixed(2)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`dashboard-card ${className}`}>
      <h3 className="card-title">龙虎榜资金分析</h3>
      
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={visibleData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2C3C" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              axisLine={{ stroke: '#2A2C3C' }}
              tickLine={{ stroke: '#2A2C3C' }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              axisLine={{ stroke: '#2A2C3C' }}
              tickLine={{ stroke: '#2A2C3C' }}
              domain={[-100, 100]}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              axisLine={{ stroke: '#2A2C3C' }}
              tickLine={{ stroke: '#2A2C3C' }}
              domain={[0, 40]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              onClick={(e) => {
                if (e.dataKey === 'tradingRatio') {
                  toggleSeries(e.dataKey as keyof typeof visibleSeries);
                }
              }}
            />
            <Bar 
              yAxisId="left" 
              dataKey="netBuy" 
              name="机构净买入" 
              fill="#8884d8" // Set a default fill color
              barSize={20} 
            >
              {visibleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.netBuy >= 0 ? "#D83C3C" : "#0F9948"} />
              ))}
            </Bar>
            {visibleSeries.tradingRatio && (
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="tradingRatio" 
                name="机构成交占比" 
                stroke="#F0BE83" 
                strokeWidth={2} 
                dot={{ r: 3 }} 
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2">
        <TimelineSlider 
          min={0}
          max={fundData.length - 1}
          value={timeRange}
          onChange={setTimeRange}
          formatLabel={(value) => fundData[value]?.date || ''}
        />
      </div>
    </div>
  );
};

export default InstitutionalFundCard;
