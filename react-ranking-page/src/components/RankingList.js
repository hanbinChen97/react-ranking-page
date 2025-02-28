import React, { useState, useEffect } from 'react';
import { List, Spin, Typography } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import { getUsers } from '../services/database';

const { Title } = Typography;

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
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

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
                dataSource={users.slice(0, 25)}
                renderItem={(user, index) => (
                    <List.Item
                        key={user.user_id}
                        onClick={() => onUserSelect(user.user_id)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors duration-200 rounded-lg mb-2"
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