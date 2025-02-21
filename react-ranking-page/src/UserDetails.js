import React from 'react';

const UserDetails = () => {
  const positions = [
    { pair: 'BTC/USDT', leverage: '10X', details: '金额数量，成本，爆仓价' },
    { pair: 'ETH/USDT', leverage: '30X', details: '金额数量，成本，爆仓价' },
    { pair: 'DOGE/USDT', leverage: '10X', details: '金额数量，成本，爆仓价' },
  ];

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">凉今嘿嘿嘿</h2>
        <span className="text-lg">666U</span>
      </div>
      
      <div className="space-y-3">
        <h3 className="font-medium">持仓：</h3>
        {positions.map((position, index) => (
          <div key={index} className="bg-white p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">{position.pair}</span>
              <span className="text-blue-600">{position.leverage}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {position.details}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDetails;
