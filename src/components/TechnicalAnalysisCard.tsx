import React, { useState } from 'react';
import { Line, Area, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TechnicalAnalysisCardProps {
  className?: string;
}

const generateIndexData = () => {
  const basePrice = 3250;
  const dates = Array.from({ length: 60 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (60 - i));
    return date.toISOString().slice(5, 10);
  });
  
  const dataPoints: any[] = [];
  
  for (let i = 0; i < dates.length; i++) {
    let price = basePrice;
    
    if (i < 20) {
      price = basePrice - (20 - i) * 3 + Math.random() * 30 - 15;
    } else if (i < 40) {
      price = basePrice - 60 + (i - 20) * 4 + Math.random() * 40 - 20;
    } else {
      price = basePrice - 20 + Math.sin(i * 0.3) * 50 + Math.random() * 30 - 15;
    }
    
    dataPoints.push({
      date: dates[i],
      price,
      volume: Math.random() * 1000 + 500
    });
  }
  
  for (let i = 0; i < dataPoints.length; i++) {
    const ma5 = i >= 4 
      ? (dataPoints[i].price + dataPoints[i-1].price + dataPoints[i-2].price + 
         dataPoints[i-3].price + dataPoints[i-4].price) / 5 
      : dataPoints[i].price;
      
    let ma20 = dataPoints[i].price;
    if (i >= 19) {
      let sum = 0;
      for (let j = 0; j < 20; j++) {
        sum += dataPoints[i-j].price;
      }
      ma20 = sum / 20;
    }
    
    const ma60 = basePrice; // Simplified for demo
    
    const ema12 = i > 0 
      ? dataPoints[i].price * 0.15 + dataPoints[i-1].ema12 * 0.85 
      : dataPoints[i].price;
      
    const ema26 = i > 0 
      ? dataPoints[i].price * 0.08 + dataPoints[i-1].ema26 * 0.92 
      : dataPoints[i].price;
      
    const macdLine = ema12 - ema26;
    const signalLine = i > 0 
      ? dataPoints[i-1].signalLine * 0.8 + macdLine * 0.2 
      : 0;
    const histogram = macdLine - signalLine;
    
    const rsi = 40 + Math.sin(i * 0.2) * 20 + Math.random() * 10;
    
    const stdDev = 25 + Math.sin(i * 0.1) * 10;
    const upperBand = ma20 + stdDev * 2;
    const lowerBand = ma20 - stdDev * 2;
    
    dataPoints[i] = {
      ...dataPoints[i],
      ma5,
      ma20,
      ma60,
      ema12,
      ema26,
      macdLine,
      signalLine,
      histogram,
      rsi,
      upperBand,
      lowerBand
    };
  }
  
  return dataPoints;
};

const technicalData = generateIndexData();

const TechnicalAnalysisCard: React.FC<TechnicalAnalysisCardProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('trend');
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-market-card p-3 border border-market-border rounded shadow-lg">
          <p className="text-sm font-semibold mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`dashboard-card ${className}`}>
      <h3 className="card-title">技术面分析</h3>
      
      <Tabs defaultValue="trend" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="trend">趋势分析</TabsTrigger>
          <TabsTrigger value="levels">支撑与压力</TabsTrigger>
          <TabsTrigger value="indicators">技术指标</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trend" className="space-y-4">
          <div className="text-sm">
            <div className="font-medium text-white mb-1">结论：箱体震荡</div>
            <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
              <li>指数近期在3150-3350点区间反复波动，未形成明确突破方向</li>
              <li>成交量持续萎缩，市场观望情绪浓厚</li>
              <li>60日均线（当前约3250点）走平，短期均线（5日、20日）缠绕，缺乏趋势性动能</li>
            </ul>
          </div>
          
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={technicalData.slice(-30)} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2C3C" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis domain={['dataMin - 50', 'dataMax + 50']} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="price" name="上证指数" stroke="#F0BE83" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="ma60" name="60日均线" stroke="#3F7DFC" strokeDasharray="5 5" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="levels" className="space-y-4">
          <div className="text-sm space-y-3">
            <div>
              <div className="font-medium text-white mb-1">支撑位：</div>
              <ul className="list-disc list-inside text-xs text-gray-300 space-y-0.5">
                <li><span className="text-market-green font-medium">3150点</span>（近期低点 + 布林带下轨支撑）</li>
                <li><span className="text-market-green font-medium">3200点</span>（20日均线 + 心理整数关口）</li>
              </ul>
            </div>
            
            <div>
              <div className="font-medium text-white mb-1">压力位：</div>
              <ul className="list-disc list-inside text-xs text-gray-300 space-y-0.5">
                <li><span className="text-market-red font-medium">3300点</span>（震荡区间中轨 + 60日均线重合位）</li>
                <li><span className="text-market-red font-medium">3350点</span>（箱体上沿 + 前高密集成交区）</li>
              </ul>
            </div>
          </div>
          
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={technicalData.slice(-30)} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2C3C" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis domain={[3100, 3400]} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="price" name="上证指数" stroke="#F0BE83" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="ma20" name="20日均线" stroke="#8884d8" dot={false} strokeDasharray="3 3" />
                <Line name="支撑线3150" strokeWidth={1} stroke="#0F9948" dot={false} dataKey={() => 3150} strokeDasharray="2 2" />
                <Line name="支撑线3200" strokeWidth={1} stroke="#0F9948" dot={false} dataKey={() => 3200} strokeDasharray="2 2" />
                <Line name="压力线3300" strokeWidth={1} stroke="#D83C3C" dot={false} dataKey={() => 3300} strokeDasharray="2 2" />
                <Line name="压力线3350" strokeWidth={1} stroke="#D83C3C" dot={false} dataKey={() => 3350} strokeDasharray="2 2" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="indicators" className="space-y-4">
          <div className="text-sm grid grid-cols-3 gap-2">
            <div className="bg-market-background/50 p-2 rounded">
              <div className="font-medium text-white text-xs">均线系统</div>
              <div className="text-xs text-gray-300 mt-1">
                <div>5日: <span className="text-market-yellow">3220点</span></div>
                <div>20日: <span className="text-purple-400">3235点</span></div>
                <div>60日: <span className="text-blue-400">3250点</span></div>
              </div>
            </div>
            
            <div className="bg-market-background/50 p-2 rounded">
              <div className="font-medium text-white text-xs">MACD</div>
              <div className="text-xs text-gray-300 mt-1">
                <div>多空力量均衡</div>
                <div>未出现明显金叉/死叉信号</div>
              </div>
            </div>
            
            <div className="bg-market-background/50 p-2 rounded">
              <div className="font-medium text-white text-xs">RSI</div>
              <div className="text-xs text-gray-300 mt-1">
                <div>RSI(14): <span className="text-neutral-value">52</span></div>
                <div>处于中性区域</div>
              </div>
            </div>
          </div>
          
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={technicalData.slice(-30)} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2C3C" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis domain={['dataMin - 20', 'dataMax + 20']} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="price" name="上证指数" stroke="#F0BE83" dot={false} />
                <Line type="monotone" dataKey="ma5" name="MA5" stroke="#D83C3C" dot={false} />
                <Line type="monotone" dataKey="ma20" name="MA20" stroke="#8884d8" dot={false} />
                <Area 
                  type="monotone" 
                  dataKey="upperBand" 
                  name="布林上轨" 
                  stroke="#3F7DFC" 
                  fill="#3F7DFC" 
                  fillOpacity={0.1} 
                  dot={false} 
                />
                <Area 
                  type="monotone" 
                  dataKey="lowerBand" 
                  name="布林下轨" 
                  stroke="#3F7DFC" 
                  fill="#3F7DFC" 
                  fillOpacity={0.1} 
                  dot={false} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechnicalAnalysisCard;
