#!/bin/bash

# 设置颜色输出
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== 启动 Jumbo 项目 =====${NC}"

# 当前工作目录
PROJECT_DIR="$(pwd)"
BACKEND_DIR="$PROJECT_DIR/server"
FRONTEND_DIR="$PROJECT_DIR/react-ranking-page"

# 确保 conda 可用
echo -e "${YELLOW}正在配置 Conda 环境...${NC}"
# 使 conda 在脚本中可用（针对 macOS）
eval "$(conda shell.bash hook)"

# 检查目录是否存在
check_directories() {
    if [ ! -d "$BACKEND_DIR" ]; then
        echo -e "${RED}错误: 后端目录 '$BACKEND_DIR' 不存在!${NC}"
        exit 1
    fi

    if [ ! -d "$FRONTEND_DIR" ]; then
        echo -e "${RED}错误: 前端目录 '$FRONTEND_DIR' 不存在!${NC}"
        exit 1
    fi
}

# 启动后端服务器
start_backend() {
    echo -e "${GREEN}正在启动后端服务...${NC}"
    cd "$BACKEND_DIR" || { echo -e "${RED}后端目录不存在！${NC}"; exit 1; }
    
    # 检查 conda 环境是否存在，不存在则创建
    if ! conda info --envs | grep -q "sqlite_server"; then
        echo -e "${YELLOW}创建 conda 环境: sqlite_server${NC}"
        conda create -y -n sqlite_server python=3.10
    fi
    
    # 激活环境
    echo -e "${YELLOW}激活 conda 环境: sqlite_server${NC}"
    conda activate sqlite_server
    
    # 检查是否成功激活环境
    if [[ "$(conda info --envs | grep '*' | awk '{print $1}')" != "sqlite_server" ]]; then
        echo -e "${RED}conda 环境激活失败！${NC}"
        exit 1
    fi
    
    # 安装依赖
    if [ -f "requirements.txt" ]; then
        echo -e "${YELLOW}安装后端依赖...${NC}"
        pip install -r requirements.txt
        if [ $? -ne 0 ]; then
            echo -e "${RED}后端依赖安装失败！${NC}"
            exit 1
        fi
    else
        echo -e "${RED}警告: requirements.txt 文件不存在${NC}"
    fi
    
    # 启动后端服务
    echo -e "${GREEN}启动后端服务器...${NC}"
    python app.py &
    BACKEND_PID=$!
    echo -e "${GREEN}后端服务已启动，PID: $BACKEND_PID${NC}"
    
    # 等待后端服务启动完成
    echo -e "${YELLOW}等待后端服务启动完成...${NC}"
    # 检查端口 3001 是否已开始监听连接
    attempt=1
    max_attempts=10
    while ! nc -z localhost 3001 && [ $attempt -le $max_attempts ]; do
        echo -e "${YELLOW}等待后端服务启动 (尝试 $attempt/$max_attempts)...${NC}"
        sleep 2
        ((attempt++))
    done
    
    if nc -z localhost 3001; then
        echo -e "${GREEN}后端服务已成功启动，端口 3001 已开放！${NC}"
    else
        echo -e "${YELLOW}无法确认后端服务是否成功启动，但将继续前端启动流程...${NC}"
    fi
}

# 启动前端服务
start_frontend() {
    echo -e "${GREEN}正在启动前端应用...${NC}"
    cd "$FRONTEND_DIR" || { echo -e "${RED}前端目录不存在！${NC}"; exit 1; }
    
    # 安装依赖（如果需要）
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}安装前端依赖...${NC}"
        npm install
        if [ $? -ne 0 ]; then
            echo -e "${RED}前端依赖安装失败！${NC}"
            exit 1
        fi
    fi
    
    # 启动前端服务
    echo -e "${GREEN}启动前端应用...${NC}"
    npm start &
    FRONTEND_PID=$!
    echo -e "${GREEN}前端应用已启动，PID: $FRONTEND_PID${NC}"
}

# 清理函数，确保在脚本终止时关闭所有启动的服务
cleanup() {
    echo -e "${YELLOW}正在关闭服务...${NC}"
    if [ -n "$BACKEND_PID" ]; then
        echo -e "${YELLOW}关闭后端服务 (PID: $BACKEND_PID)${NC}"
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ -n "$FRONTEND_PID" ]; then
        echo -e "${YELLOW}关闭前端应用 (PID: $FRONTEND_PID)${NC}"
        kill $FRONTEND_PID 2>/dev/null
    fi
    echo -e "${GREEN}服务已关闭${NC}"
    exit 0
}

# 注册清理函数
trap cleanup INT TERM EXIT

# 主执行流程
check_directories
start_backend
start_frontend

echo -e "${GREEN}===== Jumbo 项目已成功启动 =====${NC}"
echo -e "后端服务运行在 http://localhost:3001"
echo -e "前端应用运行在 http://localhost:3000"
echo -e "${YELLOW}按 Ctrl+C 关闭所有服务${NC}"

# 保持脚本运行
wait