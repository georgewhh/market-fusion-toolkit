
import React, { useState } from 'react';
import MarketCycleCard from '@/components/MarketCycleCard';
import CoreStocksCard from '@/components/CoreStocksCard';
import SentimentCard from '@/components/SentimentCard';
import LimitUpDownCard from '@/components/LimitUpDownCard';
import InstitutionalFundCard from '@/components/InstitutionalFundCard';
import TechnicalAnalysisCard from '@/components/TechnicalAnalysisCard';

const Index = () => {
  const [timeRange, setTimeRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 20)),
    end: new Date()
  });

  return (
    <div className="min-h-screen bg-market-background text-white p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* First row - Primary insights */}
        <MarketCycleCard className="md:col-span-1" />
        <CoreStocksCard className="md:col-span-1" />
        
        {/* Second row - Secondary insights */}
        <SentimentCard className="lg:col-span-1" />
        
        {/* Third row - Tertiary insights */}
        <LimitUpDownCard className="md:col-span-1" />
        <InstitutionalFundCard className="md:col-span-1" />
        <TechnicalAnalysisCard className="md:col-span-1" />
      </div>
    </div>
  );
};

export default Index;
