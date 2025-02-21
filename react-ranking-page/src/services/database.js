import SQLite from '@databases/sqlite';

const db = SQLite('./my_db.db');

export async function getUsers() {
    try {
        const users = await db.query(`
        SELECT username
        FROM users
        `);
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
} 