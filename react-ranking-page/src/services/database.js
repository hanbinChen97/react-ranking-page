const API_URL = 'http://localhost:3001';
// const API_URL = 'https://animated-space-carnival-x9grwvpqp4p35r5-3001.app.github.dev';

export async function getUsers() {
    try {
        const response = await fetch(`${API_URL}/api/users`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.users) {
            return data.users.map(user => ({
                user_id: user.user_id,
                username: user.username,
                balance: user.balance
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}