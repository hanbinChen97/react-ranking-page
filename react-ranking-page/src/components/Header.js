import React, { useState, useEffect } from 'react';
import { Layout, Typography, Button, Space } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header = () => {
  const [countdown, setCountdown] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const endTime = new Date('2025-03-31T00:00:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const diff = endTime - now;

      // 更新当前时间
      setCurrentTime(now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }));

      if (diff <= 0) {
        setCountdown('比赛已结束');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${days}天 ${hours}时 ${minutes}分 ${seconds}秒`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <AntHeader className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center">
          <Title level={4} className="m-0 text-blue-600">
            第十届你来你也爆比赛
          </Title>
        </div>
        
        <div className="flex items-center space-x-8">
          <div className="text-gray-600 font-medium flex items-center space-x-8">
            <span>当前时间：<span className="text-blue-600">{currentTime}</span></span>
            <span>距离比赛结束还有：<span className="text-blue-600">{countdown}</span></span>
          </div>
          
          <Space size="middle">
            <Button type="text">排行榜</Button>
            <Button type="text">数据分析</Button>
            <Button type="text">个人中心</Button>
            <Button type="primary" icon={<MenuOutlined />} className="ml-4" />
          </Space>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header; 