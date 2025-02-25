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
├── test_db.py      # 数据库测试文件
└── README.md       # 本文档
```

## 注意事项

- 确保已安装所有必要的 Python 依赖
- 数据库文件将自动创建（如果不存在）
- 测试数据库和生产数据库是分开的，以确保测试不会影响实际数据 