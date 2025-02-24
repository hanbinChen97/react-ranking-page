const API_URL = 'http://localhost:3001';

export async function getUsers() {
    try {
        const response = await fetch(`${API_URL}/api/users`);
        const data = await response.json();
        return data.users || [];
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
} 