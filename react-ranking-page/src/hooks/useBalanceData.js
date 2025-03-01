import { useState, useEffect, useCallback, useRef } from 'react';
import { getAllBalanceHistory } from '../services/database';

export const useBalanceData = () => {
    const [balanceHistory, setBalanceHistory] = useState([]);
    const [currentUsers, setCurrentUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [usersMap, setUsersMap] = useState(new Map());
    const [userHistoryPointers, setUserHistoryPointers] = useState(new Map());
    const animationRef = useRef(null);
    const initialDataLoaded = useRef(false);
    const userHistoriesRef = useRef(null);

    const processBalanceHistory = useCallback((history) => {
        if (!history || !Array.isArray(history)) {
            setError('数据格式不正确');
            setLoading(false);
            return new Map();
        }

        if (history.length === 0) {
            setError('暂无数据');
            setLoading(false);
            return new Map();
        }

        try {
            const sortedHistory = [...history].sort((a, b) => a.timestamp - b.timestamp);
            setBalanceHistory(sortedHistory);

            const userHistories = new Map();
            sortedHistory.forEach(record => {
                if (!userHistories.has(record.user_id)) {
                    userHistories.set(record.user_id, []);
                }
                userHistories.get(record.user_id).push(record);
            });

            // 初始化指针为每个用户历史记录的最后100条的起始位置
            const initialPointers = new Map();
            const initialBalances = new Map();

            userHistories.forEach((records, userId) => {
                const startIndex = Math.max(0, records.length - 100);
                initialPointers.set(userId, startIndex);
                initialBalances.set(userId, records[startIndex]);
            });

            setUserHistoryPointers(initialPointers);
            setUsersMap(initialBalances);
            
            const users = Array.from(initialBalances.values())
                .sort((a, b) => b.balance - a.balance);
            setCurrentUsers(users);
            setError(null);

            return userHistories;
        } catch (err) {
            console.error('处理数据时出错:', err);
            setError('处理数据时出错');
            setLoading(false);
            return new Map();
        }
    }, []);

    const startAnimation = useCallback((userHistories) => {
        if (!userHistories || userHistories.size === 0) {
            return;
        }

        if (animationRef.current) {
            clearInterval(animationRef.current);
        }

        // 存储用户历史数据的引用，以便在组件更新时保持数据
        userHistoriesRef.current = userHistories;

        animationRef.current = setInterval(() => {
            setUserHistoryPointers(prevPointers => {
                let allFinished = true;
                const newPointers = new Map(prevPointers);
                const newBalances = new Map();

                userHistories.forEach((records, userId) => {
                    const currentPointer = prevPointers.get(userId) || 0;
                    if (currentPointer < records.length - 1) {
                        newPointers.set(userId, currentPointer + 1);
                        newBalances.set(userId, records[currentPointer + 1]);
                        allFinished = false;
                    } else {
                        newBalances.set(userId, records[records.length - 1]);
                    }
                });

                if (allFinished) {
                    clearInterval(animationRef.current);
                    animationRef.current = null;
                } else {
                    setUsersMap(newBalances);
                    const updatedUsers = Array.from(newBalances.values())
                        .sort((a, b) => b.balance - a.balance);
                    setCurrentUsers(updatedUsers);
                }

                return newPointers;
            });
        }, 1000); // 加快动画速度到1秒

        return () => {
            if (animationRef.current) {
                clearInterval(animationRef.current);
            }
        };
    }, []);

    const getUserHistory = useCallback((userId) => {
        return balanceHistory.filter(record => record.user_id === userId);
    }, [balanceHistory]);

    // 只在组件初始化时获取一次数据
    useEffect(() => {
        if (initialDataLoaded.current) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const history = await getAllBalanceHistory();
                const userHistories = processBalanceHistory(history);
                if (userHistories.size > 0) {
                    startAnimation(userHistories);
                    initialDataLoaded.current = true;
                }
            } catch (error) {
                setError('获取数据失败');
                console.error('获取数据失败:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            if (animationRef.current) {
                clearInterval(animationRef.current);
            }
            initialDataLoaded.current = false;
        };
    }, [processBalanceHistory, startAnimation]);

    const selectUser = useCallback((userId) => {
        const user = usersMap.get(userId);
        if (user) {
            setSelectedUser(user);
            return {
                user,
                history: getUserHistory(userId),
                currentPointer: userHistoryPointers.get(userId) || 0
            };
        }
        return null;
    }, [usersMap, getUserHistory, userHistoryPointers]);

    return {
        currentUsers,
        loading,
        error,
        selectedUser,
        selectUser,
        userHistoryPointers,
        balanceHistory
    };
}; 