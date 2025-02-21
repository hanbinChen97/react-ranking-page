import React from 'react';
import RankingList from './RankingList';
import UserDetails from './UserDetails';

function App() {
  return (
    <div className="flex h-screen p-4 gap-4">
      {/* 左侧内容区域 */}
      <div className="w-2/3 space-y-4">
        {/* 上方卡片 */}
        <div className="bg-gray-100 p-4 rounded-lg h-1/2">
          <UserDetails />
        </div>
        {/* 下方图表 */}
        <div className="bg-gray-100 p-4 rounded-lg h-1/2">
          <div className="text-sm text-gray-500">TradingView K线图区域</div>
        </div>
      </div>
      
      {/* 右侧排行榜 */}
      <div className="w-1/3 bg-gray-100 p-4 rounded-lg">
        <RankingList />
      </div>
    </div>
  );
}

export default App;
