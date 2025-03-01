const API_URL = 'http://localhost:3001';
// const API_URL = 'https://animated-space-carnival-x9grwvpqp4p35r5-3001.app.github.dev';


export async function getUserPositions(userId) {
    try {
        const response = await fetch(`${API_URL}/api/user/${userId}/positions`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user positions:', error);
        return null;
    }
}

export async function getAllBalanceHistory() {
    try {
        console.log('开始获取余额历史数据...');
        const response = await fetch(`${API_URL}/api/balance_history`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API返回的原始数据:', data);

        // 详细的数据验证
        if (!data) {
            throw new Error('API返回的数据为空');
        }

        if (!data.balance_history) {
            throw new Error('API返回的数据中缺少 balance_history 字段');
        }

        if (!Array.isArray(data.balance_history)) {
            throw new Error('API返回的 balance_history 不是数组');
        }

        // 验证数组中的每个记录
        const validRecords = data.balance_history.filter(record => {
            if (!record || typeof record !== 'object') return false;
            if (!record.user_id || !record.balance || !record.timestamp) return false;
            if (typeof record.balance !== 'number') return false;
            if (typeof record.timestamp !== 'number') return false;
            return true;
        });

        if (validRecords.length === 0) {
            console.warn('没有找到有效的余额记录');
        } else if (validRecords.length < data.balance_history.length) {
            console.warn(`部分记录无效: ${data.balance_history.length - validRecords.length} 条记录被过滤`);
        }

        console.log('处理后的有效数据条数:', validRecords.length);
        return validRecords;
    } catch (error) {
        console.error('获取余额历史数据失败:', error.message);
        throw error; // 让上层处理错误
    }
}