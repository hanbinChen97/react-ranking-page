import React from 'react';
import { List, Spin, Typography } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';

const { Title } = Typography;

const RankingList = ({ 
    currentUsers, 
    loading, 
    error, 
    selectedUser, 
    onUserSelect 
}) => {
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
                dataSource={currentUsers}
                renderItem={(user, index) => (
                    <List.Item
                        key={user.user_id}
                        onClick={() => onUserSelect(user.user_id)}
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