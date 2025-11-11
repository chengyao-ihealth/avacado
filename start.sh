#!/bin/bash

# Avacado启动脚本

echo "🥑 启动 Avacado 健康聊天助手..."
echo ""

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "正在安装根目录依赖..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "正在安装后端依赖..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "正在安装前端依赖..."
    cd frontend && npm install && cd ..
fi

echo ""
echo "✅ 依赖安装完成！"
echo ""
echo "启动开发服务器..."
echo "前端: http://localhost:3000"
echo "后端API: http://localhost:3001"
echo ""

npm run dev

