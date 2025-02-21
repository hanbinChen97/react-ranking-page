import React, { useState, useEffect } from 'react';
import { getUsers } from './services/database';

const RankingList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error('获取用户数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="h-full">
      <h2 className="text-xl font-bold mb-4">用户列表</h2>
      <div className="space-y-2">
        {users.map((user, index) => (
          <div
            key={index}
            className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50"
          >
            <span>{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingList;
