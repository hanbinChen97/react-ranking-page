import React, { useState, useEffect } from 'react';
import { Card, Spin, Empty, Typography } from 'antd';
import { getUserPositions } from '../services/database';

const { Title, Text } = Typography;

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
      <div className="h-[300px] flex items-center justify-center">
        <Empty description="请选择一个用户查看详情" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[300px] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Empty description="暂无数据" />
      </div>
    );
  }

  const positions = JSON.parse(userDetails.positions);

  return (
    <div className="flex flex-col h-[300px]">
      <Title level={4} className="!mb-4">{userDetails.username} 的持仓信息</Title>
      <div className="overflow-y-auto flex-1 pr-2" style={{ scrollbarWidth: 'thin' }}>
        <div className="grid grid-cols-2 gap-4">
          {positions.map((position, index) => (
            <Card 
              key={index} 
              size="small"
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <Text strong>{position.symbol}</Text>
                <Text className={position.side === 'LONG' ? 'text-green-600' : 'text-red-600'}>
                  {position.side}
                </Text>
              </div>
              <div className="space-y-1">
                <Text type="secondary" className="block">数量: {position.pos_amt}</Text>
                <Text type="secondary" className="block">合约数: {position.contracts}</Text>
                <Text type="secondary" className="block">合约大小: {position.contract_size}</Text>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDetails; 