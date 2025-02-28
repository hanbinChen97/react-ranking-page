import React, { useState, useEffect, useCallback } from 'react';
import { List, Spin, Typography } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import { getAllBalanceHistory } from '../services/database';

const { Title } = Typography;

const RankingList = ({ onUserSelect, onHistoryUpdate }) => {
    const [balanceHistory, setBalanceHistory] = useState([]); // 所有历史记录
    const [currentUsers, setCurrentUsers] = useState([]); // 当前显示的用户排行
    const [currentIndex, setCurrentIndex] = useState(0); // 当前显示记录的指针
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [usersMap, setUsersMap] = useState(new Map()); // 用户ID到最新余额记录的映射
    const [animationStarted, setAnimationStarted] = useState(false);
    const [userHistoryPointers, setUserHistoryPointers] = useState(new Map()); // 每个用户的历史记录指针

    // 动画函数
    const startAnimation = useCallback((userHistories) => {
        console.log('动画开始，用户历史数据:', userHistories);
        const interval = setInterval(() => {
            setUserHistoryPointers(prevPointers => {
                let allFinished = true;
                const newPointers = new Map(prevPointers);
                const newBalances = new Map();

                userHistories.forEach((records, userId) => {
                    const currentPointer = prevPointers.get(userId);
                    if (currentPointer < records.length - 1) {
                        newPointers.set(userId, currentPointer + 1);
                        newBalances.set(userId, records[currentPointer + 1]);
                        allFinished = false;
                        
                        // 通知父组件更新
                        if (selectedUser && userId === selectedUser.user_id) {
                            onHistoryUpdate(userId, currentPointer + 1);
                        }
                    } else {
                        newBalances.set(userId, records[records.length - 1]);
                    }
                });

                if (allFinished) {
                    console.log('动画结束');
                    clearInterval(interval);
                } else {
                    setUsersMap(newBalances);
                    const updatedUsers = Array.from(newBalances.values())
                        .sort((a, b) => b.balance - a.balance);
                    setCurrentUsers(updatedUsers);
                }

                return newPointers;
            });
        }, 1000);

        return () => {
            console.log('清理动画定时器');
            clearInterval(interval);
        };
    }, [selectedUser, onHistoryUpdate]);

    // 处理余额历史数据
    const processBalanceHistory = useCallback((history) => {
        console.log('收到原始历史数据:', history);
        
        if (!history || history.length === 0) {
            console.log('历史数据为空');
            setLoading(false);
            return;
        }

        // 按时间戳排序
        const sortedHistory = [...history].sort((a, b) => a.timestamp - b.timestamp);
        console.log('排序后的历史数据:', sortedHistory);
        setBalanceHistory(sortedHistory);

        // 按用户ID分组历史记录
        const userHistories = new Map();
        sortedHistory.forEach(record => {
            if (!userHistories.has(record.user_id)) {
                userHistories.set(record.user_id, []);
            }
            userHistories.get(record.user_id).push(record);
        });
        console.log('按用户分组后的数据:', Object.fromEntries(userHistories));

        // 初始化每个用户的历史记录指针（倒数第100条记录）
        const initialPointers = new Map();
        userHistories.forEach((records, userId) => {
            const startIndex = Math.max(0, records.length - 100);
            initialPointers.set(userId, startIndex);
        });
        console.log('初始指针位置:', Object.fromEntries(initialPointers));
        setUserHistoryPointers(initialPointers);

        // 根据初始指针设置用户Map
        const initialBalances = new Map();
        userHistories.forEach((records, userId) => {
            const startIndex = initialPointers.get(userId);
            initialBalances.set(userId, records[startIndex]);
        });
        console.log('初始余额数据:', Object.fromEntries(initialBalances));
        
        setUsersMap(initialBalances);
        
        // 转换为数组并排序
        const users = Array.from(initialBalances.values())
            .sort((a, b) => b.balance - a.balance);
        console.log('排序后的用户列表:', users);
        
        setCurrentUsers(users);

        // 开始动画
        if (!animationStarted) {
            console.log('开始动画');
            setAnimationStarted(true);
            startAnimation(userHistories);
        }
    }, [animationStarted, startAnimation]);

    // 获取数据
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('开始获取数据...');
                const history = await getAllBalanceHistory();
                console.log('获取到的原始数据:', history);
                processBalanceHistory(history);
            } catch (error) {
                setError('获取数据失败');
                console.error('获取数据失败:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        return () => {
            setAnimationStarted(false);
        };
    }, []);

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
                const currentPointer = userHistoryPointers.get(userId) || 0;
                onUserSelect(userId, userHistory, currentPointer);
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
                dataSource={currentUsers}
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