
import React from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface MarketCycleCardProps {
  className?: string;
}

// Updated cycle data to match the correct scale (1=冰点, 6=高潮)
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
    case 1: return '#0F9948'; // 冰点 - 绿色
    case 2: return '#88C786'; // 退潮 - 浅绿色
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

  // Define color bands for the background - from green to red (bottom to top)
  const colorBands = [
    { level: 1, color: '#0F9948', label: '冰点' },  // 冰点 - 绿色
    { level: 2, color: '#88C786', label: '退潮' },  // 退潮 - 浅绿色
    { level: 3, color: '#F0BE83', label: '混沌' },  // 混沌 - 黄色
    { level: 4, color: '#F08C72', label: '启动' },  // 启动 - 橙色
    { level: 5, color: '#E05858', label: '发酵' },  // 发酵 - 红色
    { level: 6, color: '#D83C3C', label: '高潮' },  // 高潮 - 暗红
  ];

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
      
      <div className="h-40 relative">
        {/* Background color bands - from bottom to top */}
        <div className="absolute inset-0 flex flex-col-reverse">
          {colorBands.map((band, index) => (
            <div 
              key={index} 
              className="flex items-center px-2"
              style={{ 
                backgroundColor: `${band.color}20`, 
                height: `${(100 / colorBands.length)}%`,
                borderTop: index > 0 ? '1px dashed rgba(255,255,255,0.2)' : 'none'
              }}
            >
              <span className="text-xs text-white opacity-80">{band.label}</span>
            </div>
          ))}
        </div>
        
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={cycleData} 
            margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
          >
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
              tick={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="level" 
              stroke="#8884d8" 
              fill={`url(#colorLevel3)`}
              fillOpacity={1}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 1 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            >
              {cycleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`url(#colorLevel${entry.level})`} />
              ))}
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketCycleCard;
