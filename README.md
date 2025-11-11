# Avacado 🥑 - 健康聊天助手

一个美丽的、以鳄梨为主题的医疗健康聊天机器人应用，帮助患者记录和管理日常健康状况。

## 功能特点

- 🥑 **Avocado主题设计** - 精美的绿色系界面，响应式设计，完美支持手机和电脑
- 💬 **智能聊天机器人** - 根据患者背景和病例信息进行个性化对话
- 📊 **日常记录管理** - 自动跟踪和提醒记录以下项目：
  - 饮食 (Food)
  - 症状 (Symptom)
  - 运动 (Exercise)
  - 心情 (Mood)
  - 睡眠 (Sleep)
- 🔔 **主动提醒** - 如果当天有任何数据缺失，会自动发起友好的对话来收集
- 📱 **响应式设计** - 完美适配手机、平板和桌面设备
- 💾 **本地存储** - 所有数据存储在浏览器本地，隐私安全

## 技术栈

- **前端**: React 18 + Vite
- **存储**: LocalStorage（浏览器本地存储）
- **部署**: GitHub Pages（静态网站）

## 快速开始

### 本地开发

1. **安装依赖**
```bash
cd frontend
npm install
```

2. **启动开发服务器**
```bash
npm run dev
```

3. **访问应用**
打开浏览器访问：http://localhost:3000

### 构建生产版本

```bash
cd frontend
npm run build
```

构建产物在 `frontend/dist` 目录。

## 部署到 GitHub Pages

### 方法1：使用 GitHub Actions（推荐）

1. **配置仓库名称**
   - 如果仓库名称不是 `avacado`，请修改 `frontend/vite.config.js` 中的 `base` 路径：
   ```js
   base: '/your-repo-name/',
   ```

2. **启用 GitHub Pages**
   - 在 GitHub 仓库设置中，进入 Pages 设置
   - Source 选择 "GitHub Actions"

3. **推送代码**
   - 推送代码到 `main` 分支
   - GitHub Actions 会自动构建并部署到 GitHub Pages

4. **访问应用**
   - 访问 `https://your-username.github.io/avacado/`

### 方法2：手动部署

1. **安装 gh-pages**
```bash
cd frontend
npm install --save-dev gh-pages
```

2. **构建并部署**
```bash
npm run deploy
```

3. **配置 GitHub Pages**
   - 在 GitHub 仓库设置中，进入 Pages 设置
   - Source 选择 `gh-pages` 分支
   - 访问应用：`https://your-username.github.io/avacado/`

## 项目结构

```
avacado/
├── frontend/
│   ├── src/
│   │   ├── components/      # React组件
│   │   ├── services/        # 业务逻辑（存储、聊天机器人）
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js       # Vite配置
│   └── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions部署配置
└── README.md
```

## 使用说明

1. **首次使用**: 填写患者基本信息（姓名、背景、病例信息）
2. **开始聊天**: 与Avacado聊天，分享你的健康状况
3. **自动记录**: 系统会自动识别并记录你提到的饮食、症状、运动、心情和睡眠信息
4. **主动提醒**: 如果当天有未记录的项目，Avacado会主动询问

## 数据存储

- 所有数据存储在浏览器的 LocalStorage 中
- 数据不会上传到服务器，完全本地化
- 清除浏览器数据会删除所有记录

## 响应式设计

- **手机**: 优化了触摸交互，适配小屏幕
- **平板**: 中等屏幕优化布局
- **电脑**: 大屏幕最佳体验
- **横屏/竖屏**: 自动适配不同方向

## 开发

### 修改仓库名称

如果部署到不同名称的仓库，需要修改：

1. `frontend/vite.config.js` 中的 `base` 路径
2. `.github/workflows/deploy.yml` 中的路径（如需要）

### 自定义配置

- 修改颜色主题：编辑 `frontend/src/index.css` 中的 CSS 变量
- 修改聊天机器人逻辑：编辑 `frontend/src/services/chatbot.js`
- 修改数据字段：编辑 `frontend/src/services/storage.js` 和相关组件

## 故障排除

### 部署后页面空白

- 检查 `vite.config.js` 中的 `base` 路径是否正确
- 确保 GitHub Pages 设置正确
- 检查浏览器控制台是否有错误

### 数据丢失

- 数据存储在浏览器 LocalStorage 中
- 清除浏览器数据会删除所有记录
- 建议定期导出数据（未来功能）

## 许可证

MIT

---

Made with 🥑 by Avacado Team
