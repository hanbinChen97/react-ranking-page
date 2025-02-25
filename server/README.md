# Server

这是服务器端的说明文档。

## 环境配置

首先创建并激活 conda 环境：

```bash
conda create -n sqlite_server python=3.10
conda activate sqlite_server

pip install -r requirements.txt
```

## 运行说明

### 启动服务器

要启动服务器，请在终端中执行以下命令：

```bash
python app.py
```

服务器将会启动并连接到 SQLite 数据库。

### 测试数据库

要运行数据库测试，请执行：

```bash
python test_db.py
```

这将运行所有数据库相关的测试用例。

## 目录结构

```
server/
├── app.py          # 主应用服务器
├── instance/
│   └── my_db          # 数据库
├── test_db.py      # 数据库测试文件
└── README.md       # 本文档
```

## 数据库结构

数据库包含以下表格：

### users_balance 表
- `user_balance_id` (INTEGER): 余额记录ID
- `user_id` (INTEGER): 用户ID
- `user_flag` (TEXT): 用户标识
- `username` (TEXT): 用户名
- `exchange` (TEXT): 交易所
- `balance` (REAL): 账户余额
- `balance_update_time` (TEXT): 余额更新时间
- `balance_update_timestamp` (INTEGER): 余额更新时间戳

### users 表
- `user_id` (INTEGER): 用户ID
- `username` (TEXT): 用户名
- `shipan` (TEXT): 实盘标识
- `exchange` (TEXT): 交易所
- `balance` (REAL): 账户余额
- `balance_update_time` (TEXT): 余额更新时间
- `flag` (TEXT): 用户标识
- `apikey` (TEXT): API密钥
- `secret` (TEXT): API密钥secret
- `phrase` (TEXT): API密钥短语

### positions 表
- `position_id` (INTEGER): 持仓ID
- `user_id` (INTEGER): 用户ID
- `username` (TEXT): 用户名
- `datetime` (TEXT): 时间
- `symbol` (TEXT): 交易对
- `amount` (REAL): 持仓数量
- `side` (TEXT): 持仓方向
- `position_json` (TEXT): 持仓详细信息(JSON格式)

### positions_dev 表
- `positions_id` (INTEGER): 持仓ID
- `user_id` (INTEGER): 用户ID
- `username` (TEXT): 用户名
- `datetime` (TEXT): 时间
- `positions_json` (TEXT): 持仓详细信息(JSON格式)

### position_changes 表
- `position_change_id` (INTEGER): 持仓变更ID
- `user_id` (INTEGER): 用户ID
- `username` (TEXT): 用户名
- `action` (TEXT): 操作类型
- `old_symbol` (TEXT): 原交易对
- `new_symbol` (TEXT): 新交易对
- `old_pos_amt` (REAL): 原持仓数量
- `new_pos_amt` (REAL): 新持仓数量
- `old_side` (TEXT): 原持仓方向
- `new_side` (TEXT): 新持仓方向
- `old_timestamp` (TEXT): 原时间戳
- `new_timestamp` (TEXT): 新时间戳

### orders 表
- `order_id` (INTEGER): 订单ID
- `user_id` (INTEGER): 用户ID
- `username` (TEXT): 用户名
- `time_user` (TEXT): 用户端时间
- `time_consumer` (TEXT): 消费者端时间
- `price_user` (REAL): 用户端价格
- `price_consumer` (REAL): 消费者端价格
- `total_user` (REAL): 用户端总额
- `total_consumer` (REAL): 消费者端总额
- `diff` (REAL): 差价
- `symbol` (TEXT): 交易对
- `side` (TEXT): 交易方向
- `amount` (REAL): 交易数量
- `position_change_id` (INTEGER): 关联的持仓变更ID
- `order_json` (TEXT): 订单详细信息(JSON格式)

## 注意事项

- 确保已安装所有必要的 Python 依赖
- 数据库文件将自动创建（如果不存在）
- 测试数据库和生产数据库是分开的，以确保测试不会影响实际数据 