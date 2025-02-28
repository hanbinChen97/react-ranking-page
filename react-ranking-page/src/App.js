import React, { useState } from 'react';
import { Layout } from 'antd';
import RankingList from './components/RankingList';
import UserDetails from './UserDetails';
import DataChart from './DataChart';
import Header from './components/Header';

const { Content } = Layout;

function App() {
  const [selectedUserId, setSelectedUserId] = useState(null);

  return (
    <Layout className="min-h-screen">
      <Header />
      <Content className="p-4">
        <div className="flex gap-4">
          {/* 左侧内容区域 */}
          <div className="w-2/3 space-y-4">
            {/* 上方卡片 */}
            <div className="bg-gray-100 p-4 rounded-lg h-[calc(50vh-80px)]">
              <UserDetails userId={selectedUserId} />
            </div>
            {/* 下方图表 */}
            <div className="bg-gray-100 p-4 rounded-lg h-[calc(50vh-80px)]">
              <DataChart />
            </div>
          </div>
          {/* 右侧排行榜 */}
          <div className="w-1/3 bg-gray-100 p-4 rounded-lg">
            <RankingList onUserSelect={setSelectedUserId} />
          </div>
        </div>
      </Content>
    </Layout>
  );
}

export default App;
