const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// 使用相对路径连接数据库
const dbPath = './my_db.db';  // 改为相对路径
console.log('数据库路径:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('数据库连接失败:', err);
    } else {
        console.log('成功连接到数据库');
        // 验证表是否存在
        db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
            if (err) {
                console.error('查询表失败:', err);
            } else {
                console.log('现有表:', tables);
            }
        });
    }
});

// 获取用户列表的接口
app.get('/api/users', (req, res) => {
    console.log('收到获取用户请求');
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            console.error('查询用户失败:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('查询结果:', rows);
        res.json({ users: rows });
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});

// 优雅关闭
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('关闭数据库失败:', err);
        } else {
            console.log('数据库连接已关闭');
        }
        process.exit(err ? 1 : 0);
    });
}); 