import React, { useState, useEffect } from 'react';
import RankingList from '../components/RankingList';
import DataChart from '../components/DataChart';
import { useBalanceData } from '../hooks/useBalanceData';

const RankingPage = () => {
    const {
        currentUsers,
        loading,
        error,
        selectedUser,
        selectUser,
        userHistoryPointers,
        balanceHistory
    } = useBalanceData();

    const [selectedUserHistory, setSelectedUserHistory] = useState(null);
    const [selectedUserPointer, setSelectedUserPointer] = useState(0);

    // 默认选择第一个用户
    useEffect(() => {
        if (!loading && currentUsers && currentUsers.length > 0 && !selectedUser) {
            handleUserSelect(currentUsers[0].user_id);
        }
    }, [loading, currentUsers]);

    // 监听 userHistoryPointers 的变化，更新选中用户的指针
    useEffect(() => {
        if (selectedUser) {
            const currentPointer = userHistoryPointers.get(selectedUser.user_id);
            if (currentPointer !== undefined) {
                setSelectedUserPointer(currentPointer);
            }
        }
    }, [userHistoryPointers, selectedUser]);

    const handleUserSelect = (userId) => {
        console.log('Selecting user:', userId);
        const userData = selectUser(userId);
        if (userData) {
            console.log('User data:', userData);
            setSelectedUserHistory(userData.history);
            setSelectedUserPointer(userData.currentPointer);
        }
    };

    return (
        <div className="flex h-screen p-4 gap-4">
            <div className="w-1/3">
                <RankingList
                    currentUsers={currentUsers}
                    loading={loading}
                    error={error}
                    selectedUser={selectedUser}
                    onUserSelect={handleUserSelect}
                />
            </div>
            <div className="w-2/3">
                <DataChart
                    balanceHistory={selectedUserHistory}
                    currentIndex={selectedUserPointer}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default RankingPage; 