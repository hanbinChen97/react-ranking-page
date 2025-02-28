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
        const response = await fetch(`${API_URL}/api/balance_history`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API返回的原始数据:', data);
        if (!data || !data.balance_history || !Array.isArray(data.balance_history)) {
            console.error('API返回的数据格式不正确:', data);
            return [];
        }
        return data.balance_history;
    } catch (error) {
        console.error('Error fetching balance history:', error);
        return [];
    }
}