# Jumbo 项目

这是一个由两个主要部分组成的项目：前端排名展示系统和后端 SQLite 服务器。

## 项目结构

```
jumbo/
├── react-ranking-page/    # React 前端项目
└── sqlite-server/        # SQLite 后端服务
```

## 启动说明

### 前端项目 (react-ranking-page)

1. 进入前端项目目录：
```bash
cd react-ranking-page
```

2. 安装依赖：
```bash
npm install
```

3. 启动项目：
```bash
npm start
```

前端服务将会在 3000 端口启动 (http://localhost:3000)。

### 后端服务 (sqlite-server)

1. 进入后端项目目录：
```bash
cd sqlite-server
```

2. 安装依赖：
```bash
npm install
```

3. 启动服务器：
```bash
npm start
```

后端服务将会在 3001 端口启动 (http://localhost:3001)。

## 系统要求

- Node.js
- npm

## 注意事项

- 确保在启动前端项目之前，后端服务已经正常运行
- 请确保 3000 和 3001 端口未被其他程序占用
