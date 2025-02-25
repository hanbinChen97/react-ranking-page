import React, { useState, useEffect } from 'react';
// import { getUsers } from './services/database';

const RankingList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); // 改为 false，因为不需要加载
  const [error, setError] = useState(null);

  // 模拟数据
  const mockUsers = [
    { user_id: 1, username: "用户1", balance: 1000 },
    { user_id: 2, username: "用户2", balance: 850 },
    { user_id: 3, username: "用户3", balance: 750 },
    { user_id: 4, username: "用户4", balance: 500 },
  ];

  useEffect(() => {
    // 注释掉原来的数据库请求代码
    /*
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setError('数据格式错误');
        }
      } catch (error) {
        setError('获取用户数据失败');
        console.error('获取用户数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    */

    // 使用模拟数据
    setUsers(mockUsers);
  }, []);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="h-full">
      <h2 className="text-xl font-bold mb-4">用户列表</h2>
      <div className="space-y-2">
        {users.map((user, index) => (
          <div
            key={user.user_id || index}
            className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50"
          >
            <span>{user.username}</span>
            <span className="ml-4">{user.balance}U</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingList;
