
import React from 'react';
import { Table } from '@/components/ui/table';

interface CoreStocksCardProps {
  className?: string;
}

const coreStocksData = [
  {
    sector: '宇宙',
    change: '+15.64%',
    stocks: [
      {
        name: '字节',
        change: '+15.28%',
        details: [
          {
            company: '光环新网',
            change: '+19.98%',
            description: '字节为公司第一大客户，营收占比64.19% (2021年)'
          },
          {
            company: '润渤科技',
            change: '+20.00%',
            description: '字节为公司第一大客户，营收占比60%，数据中心运营'
          }
        ]
      },
      {
        name: '百度',
        change: '+15.28%',
        details: [
          {
            company: '浪潮信息',
            change: '+6.93%',
            description: '字节为公司第一大客户，营收占比22.31% (2023年)'
          },
          {
            company: '奥飞数据',
            change: '+19.98%',
            description: '百度为公司第一大客户，营收占比22.71% (2023年)'
          },
          {
            company: '亚康股份',
            change: '+10.58%',
            description: '百度为公司第四大客户，营收占比4.50% (2023年数据)'
          }
        ]
      },
      {
        name: '阿里',
        change: '+12.51%',
        details: [
          {
            company: '数据港',
            change: '+10.00%',
            description: '阿里为公司第一大客户，营收占比92.47% (2023年)'
          },
          {
            company: '锐捷网络',
            change: '+20.00%',
            description: '阿里为公司第一大客户，营收占比17.72% (2022年)'
          },
          {
            company: '润建股份',
            change: '+9.99%',
            description: '与阿里合作建设中国-东盟智算云项目'
          },
          {
            company: '杭钢股份',
            change: '+10.03%',
            description: '与阿里合作建设浙江云计算数据中心项目 (总投资50亿)'
          }
        ]
      },
      {
        name: '华为',
        change: '+6.40%',
        details: [
          {
            company: '拓维信息',
            change: '+10.01%',
            description: '公司第一大采购客户为华为，采购占比63.46%'
          },
          {
            company: '常山北明',
            change: '+2.80%',
            description: '公司第一大采购客户为华为，采购占比14.88%'
          }
        ]
      },
      {
        name: '腾讯',
        change: '+10.00%',
        details: [
          {
            company: '科华数据',
            change: '+10.00%',
            description: '腾讯数据中心核心供应商'
          }
        ]
      }
    ]
  }
];

const CoreStocksCard: React.FC<CoreStocksCardProps> = ({ className }) => {
  return (
    <div className={`dashboard-card ${className} overflow-auto max-h-[400px]`}>
      <h3 className="card-title">核心个股</h3>
      
      {coreStocksData.map((sector, sectorIndex) => (
        <div key={sectorIndex} className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-white">{sector.sector}</h4>
            <span className="positive-value font-semibold">{sector.change}</span>
          </div>
          
          <div className="space-y-3">
            {sector.stocks.map((stock, stockIndex) => (
              <div key={stockIndex} className="pl-2 border-l-2 border-gray-700">
                <div className="flex justify-between items-center">
                  <h5 className="text-gray-200">{stock.name}</h5>
                  <span className="positive-value">{stock.change}</span>
                </div>
                
                <div className="mt-1 pl-2 space-y-2">
                  {stock.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="grid grid-cols-12 gap-1 text-xs">
                      <div className="col-span-3 text-gray-300">{detail.company}</div>
                      <div className="col-span-2 positive-value">{detail.change}</div>
                      <div className="col-span-7 text-gray-400 truncate" title={detail.description}>
                        {detail.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoreStocksCard;
