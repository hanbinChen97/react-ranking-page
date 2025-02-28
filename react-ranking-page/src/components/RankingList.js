import React, { useState, useEffect, useCallback } from 'react';
import { List, Spin, Typography } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import { getAllBalanceHistory } from '../services/database';

const { Title } = Typography;

const RankingList = ({ onUserSelect }) => {
    const [balanceHistory, setBalanceHistory] = useState([]); // 所有历史记录
    const [currentUsers, setCurrentUsers] = useState([]); // 当前显示的用户排行
    const [currentIndex, setCurrentIndex] = useState(0); // 当前显示记录的指针
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [usersMap, setUsersMap] = useState(new Map()); // 用户ID到最新余额记录的映射

    // 处理余额历史数据
    const processBalanceHistory = useCallback((history) => {
        // 按时间戳排序
        const sortedHistory = [...history].sort((a, b) => a.timestamp - b.timestamp);
        setBalanceHistory(sortedHistory);
        setCurrentIndex(sortedHistory.length - 1);

        // 更新用户Map和当前用户列表
        const latestBalances = new Map();
        sortedHistory.forEach(record => {
            const currentRecord = latestBalances.get(record.user_id);
            if (!currentRecord || record.timestamp > currentRecord.timestamp) {
                latestBalances.set(record.user_id, record);
            }
        });
        
        setUsersMap(latestBalances);
        
        // 转换为数组并排序
        const users = Array.from(latestBalances.values())
            .sort((a, b) => b.balance - a.balance);
        
        setCurrentUsers(users);
    }, []);

    // 获取数据
    useEffect(() => {
        const fetchData = async () => {
            try {
                const history = await getAllBalanceHistory();
                processBalanceHistory(history);
            } catch (error) {
                setError('获取数据失败');
                console.error('获取数据失败:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [processBalanceHistory]);

    // 获取用户历史记录
    const getUserHistory = useCallback((userId) => {
        return balanceHistory.filter(record => record.user_id === userId);
    }, [balanceHistory]);

    const getRankingStyle = (index) => {
        switch (index) {
            case 0:
                return 'text-yellow-500';
            case 1:
                return 'text-gray-400';
            case 2:
                return 'text-amber-600';
            default:
                return 'text-gray-500';
        }
    };

    const handleUserSelect = async (userId) => {
        try {
            const user = usersMap.get(userId);
            if (user) {
                setSelectedUser(user);
                const userHistory = getUserHistory(userId);
                onUserSelect(userId, userHistory);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Spin size="large" tip="加载中..." />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="h-full flex flex-col">
            <Title level={4} className="mb-4 flex items-center">
                <TrophyOutlined className="mr-2" />
                用户排行榜
            </Title>
            <List
                className="overflow-y-auto custom-scrollbar"
                style={{
                    height: '640px',
                    maxHeight: 'calc(100vh - 200px)'
                }}
                dataSource={currentUsers.slice(0, 25)}
                renderItem={(user, index) => (
                    <List.Item
                        key={user.user_id}
                        onClick={() => handleUserSelect(user.user_id)}
                        className={`hover:bg-gray-50 cursor-pointer transition-colors duration-200 rounded-lg mb-2 ${
                            selectedUser?.user_id === user.user_id ? 'bg-blue-50' : ''
                        }`}
                    >
                        <div className="flex items-center w-full px-4 py-2">
                            <div className={`w-8 font-bold ${getRankingStyle(index)}`}>
                                #{index + 1}
                            </div>
                            <div className="flex-1 ml-4">
                                <div className="font-medium">{user.username}</div>
                            </div>
                            <div className="font-semibold text-blue-600">
                                {user.balance.toFixed(2)}U
                            </div>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default RankingList; 