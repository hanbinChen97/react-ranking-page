import sqlite3
import os

def check_database():
    # 获取数据库文件路径
    db_path = os.path.join(os.path.dirname(__file__), 'instance', 'my_db.db')
    
    # 连接数据库
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 获取所有表名
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print("所有表格:", [table[0] for table in tables])
    
    # 对每个表查看其结构
    for table in tables:
        table_name = table[0]
        cursor.execute(f"PRAGMA table_info({table_name});")
        columns = cursor.fetchall()
        print(f"\n{table_name} 表结构:")
        for col in columns:
            print(f"列名: {col[1]}, 类型: {col[2]}")
    
    # 关闭连接
    conn.close()

if __name__ == "__main__":
    check_database()