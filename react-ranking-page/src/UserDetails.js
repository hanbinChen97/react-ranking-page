import React, { useState, useEffect } from 'react';
import { getUserPositions } from './services/database';

const UserDetails = ({ userId }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        const data = await getUserPositions(userId);
        if (data) {
          setUserDetails(data);
          setError(null);
        }
      } catch (err) {
        setError('获取用户数据失败');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (!userId) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        请选择一个用户查看详情
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        加载中...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        暂无数据
      </div>
    );
  }

  const positions = JSON.parse(userDetails.positions);

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{userDetails.username}</h2>
      </div>
      
      <div className="space-y-3">
        <h3 className="font-medium">持仓：</h3>
        <div className="max-h-[calc(100%-4rem)] overflow-y-auto">
          {positions.map((position, index) => (
            <div key={index} className="bg-white p-3 rounded-lg mb-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{position.symbol}</span>
                <span className={`text-${position.side === 'LONG' ? 'green' : 'red'}-600`}>
                  {position.side}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                <div>数量: {position.pos_amt}</div>
                <div>合约数: {position.contracts}</div>
                <div>合约大小: {position.contract_size}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
