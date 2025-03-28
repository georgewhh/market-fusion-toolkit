
import React, { useState } from 'react';
import { Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TimelineSlider from './TimelineSlider';

interface LimitUpDownCardProps {
  className?: string;
}

const generateHistoricalData = () => {
  const dates = [
    '03-01', '03-02', '03-05', '03-06', '03-07', '03-08', '03-09', 
    '03-12', '03-13', '03-14', '03-15', '03-16', '03-19', '03-20', 
    '03-21', '03-22', '03-23', '03-26', '03-27', '03-28', '03-29',
    '04-01', '04-02', '04-03', '04-04', '04-05'
  ];
  
  return dates.map((date, index) => {
    // Create a realistic pattern
    let limitUp, limitDown;
    
    if (index < 15) {
      // Earlier period with more limit ups
      limitUp = Math.floor(Math.random() * 30) + 50;
      limitDown = Math.floor(Math.random() * 15) + 5;
    } else if (index === 17) {
      // Spike day - March 26th
      limitUp = 74; // The 37:1 ratio day
      limitDown = 2;
    } else {
      // Recent period with more balance and increasing limit downs
      limitUp = Math.floor(Math.random() * 20) + 20;
      limitDown = Math.floor(Math.random() * 25) + 10;
    }
    
    // Last data point to match the specific 2.45:1 ratio
    if (index === dates.length - 1) {
      limitUp = 49;
      limitDown = 20;
    }
    
    return {
      date,
      limitUp,
      limitDown
    };
  });
};

const limitUpDownData = generateHistoricalData();

const LimitUpDownCard: React.FC<LimitUpDownCardProps> = ({ className }) => {
  const [timeRange, setTimeRange] = useState<[number, number]>([
    Math.max(0, limitUpDownData.length - 20), 
    limitUpDownData.length - 1
  ]);
  
  const visibleData = limitUpDownData.slice(timeRange[0], timeRange[1] + 1);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-market-card p-3 border border-market-border rounded shadow-lg">
          <p className="text-sm font-semibold mb-1">{label}</p>
          <p className="text-xs text-market-red">涨停: {payload[0].value}</p>
          <p className="text-xs text-market-green">跌停: {payload[1].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`dashboard-card ${className}`}>
      <h3 className="card-title">涨跌停分析</h3>
      
      <div className="space-y-2 mb-4">
        <div className="text-sm text-white">两极分化加剧</div>
        <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
          <li>涨停/跌停比从37:1（3月26日）骤降至2.45:1</li>
          <li>20cm涨停（3家）与10%跌停（20家）共存，显示资金风险偏好割裂</li>
          <li>首板溢价率下降，炸板率上升至32%（23/72）</li>
        </ul>
      </div>
      
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
              domain={[0, 'dataMax']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="limitUp" 
              name="涨停数" 
              stroke="#D83C3C" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="limitDown" 
              name="跌停数" 
              stroke="#0F9948" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2">
        <TimelineSlider 
          min={0}
          max={limitUpDownData.length - 1}
          value={timeRange}
          onChange={setTimeRange}
          formatLabel={(value) => limitUpDownData[value]?.date || ''}
        />
      </div>
    </div>
  );
};

export default LimitUpDownCard;
