import React, { useState, useEffect } from 'react';
import { Layout, Card } from 'antd';
import RankingList from './components/RankingList';
import UserDetails from './components/UserDetails';
import DataChart from './components/DataChart';
import Header from './components/Header';
import { useBalanceData } from './hooks/useBalanceData';

const { Content } = Layout;

function App() {
  const {
    currentUsers,
    loading,
    error,
    selectedUser,
    selectUser,
    userHistoryPointers,
    balanceHistory,
    userPositions
  } = useBalanceData();

  // 获取选中用户的历史数据
  const selectedUserHistory = React.useMemo(() => {
    if (!selectedUser || !balanceHistory) return [];
    return balanceHistory.filter(item => item.user_id === selectedUser.user_id);
  }, [selectedUser, balanceHistory]);

  return (
    <Layout className="min-h-screen">
      <Header />
      <Content className="p-4">
        <div className="flex gap-4 h-[calc(100vh-88px)]">
          {/* 左侧内容区域 */}
          <div className="w-2/3 space-y-4 flex flex-col">
            {/* 上方用户详情 */}
            <Card className="flex-1">
              <UserDetails userId={selectedUser?.user_id} />
            </Card>
            {/* 下方图表 */}
            <div className="flex-1">
              <DataChart 
                balanceHistory={selectedUserHistory}
                currentIndex={userHistoryPointers.get(selectedUser?.user_id) || 0}
                loading={loading}
              />
            </div>
          </div>
          {/* 右侧排行榜 */}
          <Card className="w-1/3">
            <RankingList 
              currentUsers={currentUsers}
              loading={loading}
              error={error}
              selectedUser={selectedUser}
              onUserSelect={selectUser}
              userPositions={userPositions}
            />
          </Card>
        </div>
      </Content>
    </Layout>
  );
}

export default App;
