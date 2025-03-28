
import React from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface MarketCycleCardProps {
  className?: string;
}

const cycleData = [
  { date: '2023-03-01', level: 1, status: '冰点' },
  { date: '2023-03-15', level: 2, status: '退潮' },
  { date: '2023-04-01', level: 3, status: '混沌' },
  { date: '2023-04-15', level: 2, status: '退潮' },
  { date: '2023-05-01', level: 3, status: '混沌' },
  { date: '2023-05-15', level: 4, status: '启动' },
  { date: '2023-06-01', level: 5, status: '发酵' },
  { date: '2023-06-15', level: 6, status: '高潮' },
  { date: '2023-07-01', level: 5, status: '发酵' },
  { date: '2023-07-15', level: 4, status: '启动' },
  { date: '2023-08-01', level: 3, status: '混沌' },
  { date: '2023-08-15', level: 3, status: '混沌' },
  { date: '2023-09-01', level: 3, status: '混沌' },
  { date: '2023-09-15', level: 2, status: '退潮' },
  { date: '2023-10-01', level: 3, status: '混沌' },
];

const levelColor = (level: number) => {
  switch(level) {
    case 1: return '#3A5E8C'; // 冰点 - 深蓝
    case 2: return '#3F7DFC'; // 退潮 - 蓝色
    case 3: return '#F0BE83'; // 混沌 - 黄色
    case 4: return '#F08C72'; // 启动 - 橙色
    case 5: return '#E05858'; // 发酵 - 红色
    case 6: return '#D83C3C'; // 高潮 - 暗红
    default: return '#F0BE83';
  }
};

const MarketCycleCard: React.FC<MarketCycleCardProps> = ({ className }) => {
  const currentCycle = {
    level: 3,
    status: '混沌期',
    advice: '试错新题材：关注首板/1进2个股（如舆情提及的工业机器人、半导体设备）',
    warnings: [
      '回避中位股：警惕4板以上标的（如尤夫股份）的补跌风险',
      '低吸超跌：挖掘业绩预增+估值低位品种（如14家Q1预增股）'
    ]
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-market-card p-2 border border-market-border rounded shadow-lg">
          <p className="text-sm font-semibold">{payload[0].payload.status}</p>
          <p className="text-xs text-gray-400">{payload[0].payload.date}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`dashboard-card ${className}`}>
      <h3 className="card-title">情绪周期</h3>
      <div className="mb-4">
        <div className="text-lg font-semibold text-market-yellow">{currentCycle.status}</div>
        <p className="text-sm mt-1">{currentCycle.advice}</p>
        <ul className="list-disc list-inside text-xs mt-2 text-gray-300">
          {currentCycle.warnings.map((warning, index) => (
            <li key={index}>{warning}</li>
          ))}
        </ul>
      </div>
      
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={cycleData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              {[1, 2, 3, 4, 5, 6].map((level) => (
                <linearGradient key={level} id={`colorLevel${level}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={levelColor(level)} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={levelColor(level)} stopOpacity={0.2}/>
                </linearGradient>
              ))}
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              tickFormatter={(value) => value.slice(5)}
            />
            <YAxis 
              domain={[1, 6]} 
              ticks={[1, 2, 3, 4, 5, 6]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              tickFormatter={(value) => {
                const labels = ['冰点', '退潮', '混沌', '启动', '发酵', '高潮'];
                return labels[value - 1];
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="level" 
              stroke="#8884d8" 
              fill={`url(#colorLevel3)`}
              fillOpacity={1}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 1, fill: (entry) => levelColor(entry.level) }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketCycleCard;
