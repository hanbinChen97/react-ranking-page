import React, { useState, useEffect } from 'react';
import { getUsers } from './services/database';

const RankingList = ({ onUserSelect }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUsers();

        if (Array.isArray(userData)) {
          const sortedUsers = userData.sort((a, b) => b.balance - a.balance);
          setUsers(sortedUsers);
        }
      } catch (error) {
        setError('获取数据失败');
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // 每30秒自动刷新一次数据
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full">加载中...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="h-full">
      <div>
        <h2 className="text-xl font-bold mb-4">用户排行榜</h2>
        <div className="space-y-2">
          {users.map((user, index) => (
            <div
              key={user.user_id}
              className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => onUserSelect(user.user_id)}
            >
              <div className="flex items-center space-x-4">
                <span className="w-8 text-gray-500">#{index + 1}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{user.username}</span>
                </div>
              </div>
              <div className="flex items-end">
                <span className="font-medium">{user.balance.toFixed(2)}U</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RankingList;
