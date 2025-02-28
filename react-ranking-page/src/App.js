import React, { useState, useEffect } from 'react';
import { Layout, Card } from 'antd';
import RankingList from './components/RankingList';
import UserDetails from './components/UserDetails';
import DataChart from './components/DataChart';
import Header from './components/Header';
import { getUserBalanceHistory } from './services/database';

const { Content } = Layout;

function App() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [balanceHistory, setBalanceHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBalanceHistory = async () => {
      if (!selectedUserId) {
        console.log('没有选中用户ID');
        setBalanceHistory([]);
        return;
      }

      console.log('开始获取用户余额历史，用户ID:', selectedUserId);
      setLoading(true);
      try {
        const history = await getUserBalanceHistory(selectedUserId);
        console.log('获取到的余额历史数据:', history);
        setBalanceHistory(history);
      } catch (error) {
        console.error('获取余额历史失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalanceHistory();
  }, [selectedUserId]);

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
                balanceHistory={balanceHistory}
                loading={loading}
              />
            </div>
          </div>
          {/* 右侧排行榜 */}
          <Card className="w-1/3">
            <RankingList onUserSelect={setSelectedUserId} />
          </Card>
        </div>
      </Content>
    </Layout>
  );
}

export default App;
