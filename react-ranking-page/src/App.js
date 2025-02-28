import React, { useState } from 'react';
import { Layout, Card } from 'antd';
import RankingList from './components/RankingList';
import UserDetails from './components/UserDetails';
import DataChart from './components/DataChart';
import Header from './components/Header';

const { Content } = Layout;

function App() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserHistory, setSelectedUserHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // 处理用户选择和历史记录更新
  const handleUserSelect = (userId, userHistory, currentIndex) => {
    setSelectedUserId(userId);
    setSelectedUserHistory(userHistory || []);
    setCurrentHistoryIndex(currentIndex || 0);
  };

  // 处理动画更新
  const handleHistoryUpdate = (userId, currentIndex) => {
    if (userId === selectedUserId) {
      setCurrentHistoryIndex(currentIndex);
    }
  };

  return (
    <Layout className="min-h-screen">
      <Header />
      <Content className="p-4">
        <div className="flex gap-4 h-[calc(100vh-88px)]">
          {/* 左侧内容区域 */}
          <div className="w-2/3 space-y-4 flex flex-col">
            {/* 上方用户详情 */}
            <Card className="flex-1">
              <UserDetails userId={selectedUserId} />
            </Card>
            {/* 下方图表 */}
            <div className="flex-1">
              <DataChart 
                balanceHistory={selectedUserHistory}
                currentIndex={currentHistoryIndex}
                loading={loading}
              />
            </div>
          </div>
          {/* 右侧排行榜 */}
          <Card className="w-1/3">
            <RankingList 
              onUserSelect={handleUserSelect}
              onHistoryUpdate={handleHistoryUpdate}
            />
          </Card>
        </div>
      </Content>
    </Layout>
  );
}

export default App;
