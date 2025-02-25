const API_URL = 'http://localhost:3001';

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

export async function getUsernames() {
    try {
        const response = await fetch(`${API_URL}/api/usernames`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.usernames || [];
    } catch (error) {
        console.error('Error fetching usernames:', error);
        return [];
    }
}