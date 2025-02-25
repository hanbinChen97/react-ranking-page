const API_URL = 'http://localhost:3001';

export async function getUsers() {
    try {
        const response = await fetch(`${API_URL}/api/users`);
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