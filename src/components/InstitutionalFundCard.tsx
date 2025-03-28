
import React, { useState } from 'react';
import { ComposedChart, Bar, Cell, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TimelineSlider from './TimelineSlider';
import { ScrollArea } from "@/components/ui/scroll-area";

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
      netBuy
    };
  });
};

const fundData = generateFundData();

const keyInsights = [
  {
    title: "深海经济退潮",
    description: "亚星锚链遭6025万巨额卖出，若振华重工等中船系个股未能企稳，可能引发板块连锁抛售。"
  },
  {
    title: "工业母机资金切换",
    description: "合锻智能单日抛压1.1亿，量化资金撤离工业母机板块，需警惕华中数控等跟跌风险。"
  },
  {
    title: "周期股分歧加剧",
    description: "中毅达3日累计卖出2783万，磷矿石价格回落导致业绩预期下修，化肥板块承压。"
  }
];

const InstitutionalFundCard: React.FC<InstitutionalFundCardProps> = ({ className }) => {
  const [timeRange, setTimeRange] = useState<[number, number]>([
    Math.max(0, fundData.length - 20), 
    fundData.length - 1
  ]);
  
  const visibleData = fundData.slice(timeRange[0], timeRange[1] + 1);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-market-card p-3 border border-market-border rounded shadow-lg">
          <p className="text-sm font-semibold mb-1">{label}</p>
          <p className="text-xs" style={{ color: payload[0].value >= 0 ? '#D83C3C' : '#0F9948' }}>
            机构净买入: {payload[0].value.toFixed(2)}亿
          </p>
        </div>
      );
    }
    return null;
  };
  
  const CustomLegend = ({ payload }: any) => {
    if (!payload) return null;
    
    return (
      <div className="flex items-center justify-center gap-4 mt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-market-red"></div>
          <span className="text-xs text-gray-300">净买入(正值)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-market-green"></div>
          <span className="text-xs text-gray-300">净卖出(负值)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-[#8884d8]"></div>
          <span className="text-xs text-gray-300">趋势线</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`dashboard-card ${className}`}>
      <h3 className="card-title">龙虎榜资金分析</h3>
      
      <ScrollArea className="h-[85px] mb-4 pr-2">
        <div className="space-y-2">
          {keyInsights.map((insight, index) => (
            <div key={index} className="text-sm">
              <div className="text-white font-medium">{insight.title}</div>
              <p className="text-xs text-gray-300">{insight.description}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
      
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
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              axisLine={{ stroke: '#2A2C3C' }}
              tickLine={{ stroke: '#2A2C3C' }}
              domain={[-100, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Bar 
              dataKey="netBuy" 
              name="机构净买入" 
              barSize={20}
            >
              {visibleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.netBuy >= 0 ? '#D83C3C' : '#0F9948'} />
              ))}
            </Bar>
            <Line 
              type="monotone" 
              dataKey="netBuy" 
              name="机构净买入" 
              stroke="#8884d8" 
              dot={{ r: 2 }}
              activeDot={{ r: 5 }}
            />
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
