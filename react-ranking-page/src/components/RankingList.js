import React from 'react';
import { List, Spin, Typography } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

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
            <div
                className="overflow-y-auto custom-scrollbar"
                style={{
                    height: '640px',
                    maxHeight: 'calc(100vh - 200px)'
                }}
            >
                <AnimatePresence initial={false}>
                    {currentUsers.map((user, index) => (
                        <motion.div
                            key={user.user_id}
                            layoutId={user.user_id.toString()}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ 
                                opacity: 1, 
                                y: 0,
                                transition: { type: "spring", stiffness: 300, damping: 30 }
                            }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            layout
                            onClick={() => onUserSelect(user.user_id)}
                            className={`
                                hover:bg-gray-50 
                                cursor-pointer 
                                transition-colors 
                                duration-200 
                                rounded-lg 
                                mb-2
                                ${selectedUser?.user_id === user.user_id ? 'bg-blue-50' : 'bg-white'}
                                shadow-sm
                                border border-gray-100
                            `}
                            whileHover={{ 
                                scale: 1.02,
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center w-full px-4 py-3">
                                <motion.div 
                                    className={`w-8 font-bold ${getRankingStyle(index)}`}
                                    layoutId={`rank-${user.user_id}`}
                                >
                                    #{index + 1}
                                </motion.div>
                                <motion.div 
                                    className="flex-1 ml-4"
                                    layoutId={`username-${user.user_id}`}
                                >
                                    <div className="font-medium">{user.username}</div>
                                </motion.div>
                                <motion.div 
                                    className="font-semibold text-blue-600"
                                    layoutId={`balance-${user.user_id}`}
                                >
                                    {user.balance.toFixed(2)}U
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default RankingList; 