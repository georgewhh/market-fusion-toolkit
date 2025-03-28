
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SentimentCardProps {
  className?: string;
}

const wordCloudItems = [
  { text: '人工智能', value: 85, sentiment: 'positive' },
  { text: '机器人', value: 72, sentiment: 'positive' },
  { text: '估值修复', value: 65, sentiment: 'positive' },
  { text: '高股息', value: 60, sentiment: 'positive' },
  { text: '重组概念', value: 55, sentiment: 'positive' },
  { text: '半导体设备', value: 50, sentiment: 'positive' },
  { text: '清仓避险', value: 48, sentiment: 'negative' },
  { text: '跌不动了', value: 45, sentiment: 'positive' },
  { text: '割肉', value: 42, sentiment: 'negative' },
  { text: '业绩预增', value: 40, sentiment: 'positive' },
  { text: '超跌反弹', value: 38, sentiment: 'positive' },
  { text: '政策预期', value: 35, sentiment: 'neutral' },
  { text: '欧盟关税', value: 30, sentiment: 'negative' },
  { text: '首板', value: 28, sentiment: 'positive' },
  { text: '1进2', value: 25, sentiment: 'positive' },
];

const newsItems = [
  { 
    type: '利好', 
    title: '深化人工智能赋能应用',
    tags: ['人工智能'],
    sentiment: 'positive'
  },
  { 
    type: '利空', 
    title: '欧盟正在为美国宣布的新进口关税准备回应',
    tags: ['宏观'],
    sentiment: 'negative'
  }
];

const SentimentCard: React.FC<SentimentCardProps> = ({ className }) => {
  const getSentimentColor = (sentiment: string) => {
    switch(sentiment) {
      case 'positive': return 'text-market-red';
      case 'negative': return 'text-market-green';
      default: return 'text-market-yellow';
    }
  };
  
  const getSentimentBadgeVariant = (sentiment: string) => {
    switch(sentiment) {
      case 'positive': return 'bg-market-red/20 text-market-red';
      case 'negative': return 'bg-market-green/20 text-market-green';
      default: return 'bg-market-yellow/20 text-market-yellow';
    }
  };

  const getWordSize = (value: number) => {
    const min = 12; // Minimum font size
    const max = 24; // Maximum font size
    const ratio = (value - 25) / (85 - 25); // Normalize to 0-1 range
    return min + ratio * (max - min);
  };

  return (
    <div className={`dashboard-card ${className}`}>
      <h3 className="card-title">舆情监控</h3>
      
      <div className="mb-4">
        <div className="p-4 rounded-md bg-market-background/50 min-h-[120px] flex flex-wrap justify-center items-center">
          {wordCloudItems.map((item, index) => (
            <span 
              key={index}
              className={`inline-block px-2 mx-1 my-1 ${getSentimentColor(item.sentiment)}`}
              style={{ 
                fontSize: `${getWordSize(item.value)}px`,
                fontWeight: item.value > 60 ? 'bold' : 'normal'
              }}
            >
              {item.text}
            </span>
          ))}
        </div>
        
        <div className="mt-3 text-sm text-gray-300">
          <p>多空分歧显著：既有"跌不动了""估值修复"看多言论，也有"清仓避险""割肉"悲观情绪</p>
          <p className="mt-1">缺乏主线共识，热点分散（机器人、高股息、重组概念并行）</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-300">市场资讯</h4>
        
        {newsItems.map((item, index) => (
          <div key={index} className="flex items-start space-x-2 text-sm">
            <Badge className={`${item.sentiment === 'positive' ? 'bg-market-red/20 text-market-red' : 'bg-market-green/20 text-market-green'} self-start mt-0.5`}>
              {item.type}
            </Badge>
            <div>
              <p className="text-white">{item.title}</p>
              <div className="flex space-x-1 mt-1">
                {item.tags.map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="outline" className="text-xs px-1 py-0">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentimentCard;
