# Avacado 🥑 - 健康聊天助手

一个美丽的、以鳄梨为主题的医疗健康聊天机器人应用，帮助患者记录和管理日常健康状况。

## 📋 目录

- [功能特点](#功能特点)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [部署指南](#部署指南)
- [使用说明](#使用说明)
- [项目结构](#项目结构)
- [开发指南](#开发指南)
- [故障排除](#故障排除)

## ✨ 功能特点

- 🥑 **Avocado主题设计** - 精美的绿色系界面，响应式设计，完美支持手机和电脑
- 💬 **智能聊天机器人** - 根据患者背景和病例信息进行个性化对话
- 📊 **日常记录管理** - 自动跟踪和提醒记录以下项目：
  - 🍽️ 饮食 (Food)
  - 🤒 症状 (Symptom)
  - 🏃 运动 (Exercise)
  - 😊 心情 (Mood)
  - 😴 睡眠 (Sleep)
- 🔔 **主动提醒** - 如果当天有任何数据缺失，会自动发起友好的对话来收集
- 📱 **响应式设计** - 完美适配手机、平板和桌面设备
- 🌓 **横竖屏支持** - 自动适配横屏和竖屏模式
- 💾 **本地存储** - 所有数据存储在浏览器本地，隐私安全

## 🛠️ 技术栈

- **前端**: React 18 + Vite
- **存储**: LocalStorage（浏览器本地存储）
- **部署**: GitHub Pages（静态网站）

## 🚀 快速开始

### 本地开发

#### 方法1：使用启动脚本（推荐）

```bash
./start-local.sh
```

#### 方法2：手动启动

```bash
cd frontend
npm install    # 第一次运行需要安装依赖
npm run dev    # 启动开发服务器
```

然后打开浏览器访问：http://localhost:3000

### 检查依赖安装

```bash
cd frontend
npm list --depth=0
```

应该看到类似输出：
```
avacado-frontend@1.0.0
├── react@18.2.0
├── react-dom@18.2.0
├── vite@5.0.8
└── ...
```

### 构建生产版本

```bash
cd frontend
npm run build      # 构建
npm run preview    # 预览构建结果
```

构建产物在 `frontend/dist` 目录。

## 📦 部署指南

### 部署到 GitHub Pages

#### 方法1：使用 GitHub Actions（推荐，自动部署）

1. **配置仓库名称**
   
   如果你的 GitHub 仓库名称不是 `avacado`，需要修改配置：
   
   编辑 `frontend/vite.config.js`：
   ```js
   // 将 'avacado' 改为你的实际仓库名称
   const base = mode === 'development' ? '/' : '/你的仓库名称/'
   ```

2. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **启用 GitHub Pages**
   - 在 GitHub 仓库页面，点击 **Settings**（设置）
   - 在左侧菜单找到 **Pages**（页面）
   - 在 **Source** 部分，选择 **"GitHub Actions"**
   - 保存设置

4. **等待部署完成**
   - GitHub Actions 会自动构建并部署
   - 部署完成后，访问：`https://你的GitHub用户名.github.io/仓库名称/`
   - 例如：`https://chengyaoshen.github.io/avacado/`

#### 方法2：手动部署

1. **修改仓库名称配置**
   
   编辑 `frontend/vite.config.js`：
   ```js
   const base = mode === 'development' ? '/' : '/你的仓库名称/'
   ```

2. **安装 gh-pages**
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

3. **构建并部署**
   ```bash
   npm run deploy
   ```

4. **配置 GitHub Pages**
   - 在 GitHub 仓库 Settings > Pages
   - Source 选择 `gh-pages` 分支
   - 访问应用：`https://你的用户名.github.io/仓库名称/`

### 部署到其他静态托管服务

#### Netlify

1. 连接 GitHub 仓库
2. 构建命令：`cd frontend && npm install && npm run build`
3. 发布目录：`frontend/dist`
4. 修改 `vite.config.js` 中的 `base` 为 `/`

#### Vercel

1. 导入 GitHub 仓库
2. 框架预设选择 Vite
3. 根目录设置为 `frontend`
4. 修改 `vite.config.js` 中的 `base` 为 `/`

## 📖 使用说明

### 首次使用

1. **填写基本信息**
   - 填写你的姓名（必填）
   - 填写个人背景（可选，例如：30岁，软件工程师）
   - 填写病例信息（可选，例如：有高血压病史）
   - 点击"开始聊天 🥑"按钮

2. **开始聊天**
   - 如果当天有未记录的项目，Avacado会自动问候并询问
   - 你可以直接告诉Avacado你的情况，例如：
     - "今天吃了米饭和蔬菜"
     - "感觉有点累"
     - "今天走了30分钟"
     - "心情不错"
     - "昨晚睡了7小时"

3. **查看记录**
   - 顶部显示今日记录摘要
   - 已完成的项目显示为绿色
   - 未完成的项目显示为橙色并带有提醒
   - 完成所有记录后，会显示完成百分比

### 数据存储

- 所有数据存储在浏览器的 LocalStorage 中
- 数据不会上传到服务器，完全本地化
- 清除浏览器数据会删除所有记录
- 不同设备间数据不同步

## 📁 项目结构

```
avacado/
├── frontend/
│   ├── src/
│   │   ├── components/      # React组件
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── DailyLogSummary.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Message.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── MessageList.jsx
│   │   │   └── PatientSetup.jsx
│   │   ├── services/        # 业务逻辑
│   │   │   ├── chatbot.js   # 聊天机器人逻辑
│   │   │   └── storage.js   # 数据存储服务
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js       # Vite配置
│   └── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions部署配置
├── start-local.sh           # 本地启动脚本
└── README.md
```

## 🔧 开发指南

### 修改仓库名称

如果部署到不同名称的仓库，需要修改：

1. `frontend/vite.config.js` 中的 `base` 路径
2. 重新构建并部署

### 自定义配置

- **修改颜色主题**：编辑 `frontend/src/index.css` 中的 CSS 变量
- **修改聊天机器人逻辑**：编辑 `frontend/src/services/chatbot.js`
- **修改数据字段**：编辑 `frontend/src/services/storage.js` 和相关组件

### 环境变量

可以在 `.env` 文件中设置环境变量：

```env
VITE_BASE_PATH=/avacado/
```

然后在 `vite.config.js` 中使用：

```js
const base = import.meta.env.VITE_BASE_PATH || '/avacado/'
```

## ❗ 故障排除

### 本地运行问题

#### 问题1：依赖安装失败

**解决方法**：
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

如果网络问题，可以使用国内镜像：
```bash
npm install --registry=https://registry.npmmirror.com
```

#### 问题2：端口被占用

**解决方法**：
```bash
# Vite 会自动使用下一个可用端口
# 或手动指定端口
npm run dev -- --port 3001
```

#### 问题3：Node.js 版本过低

**检查版本**：
```bash
node --version
```

**需要 Node.js 18+**，升级方法：
- 访问 https://nodejs.org/ 下载最新版本
- 或使用 nvm：`nvm install 18 && nvm use 18`

#### 问题4：权限问题（macOS/Linux）

**解决方法**：
```bash
sudo npm install
```

### GitHub Pages 问题

#### 问题1：页面显示 404

**原因**：`vite.config.js` 中的 `base` 路径与仓库名称不匹配

**解决方法**：
1. 检查你的 GitHub 仓库名称
2. 编辑 `frontend/vite.config.js`：
   ```js
   // 将 'avacado' 改为你的实际仓库名称
   const base = mode === 'development' ? '/' : '/你的仓库名称/'
   ```
3. 重新提交并推送代码

#### 问题2：页面空白

**原因**：资源路径错误或构建失败

**解决方法**：
1. 检查 GitHub Actions 部署日志
2. 打开浏览器开发者工具（F12）
3. 查看 Console 和 Network 标签的错误
4. 确认 `base` 路径配置正确

#### 问题3：部署工作流失败

**检查清单**：
- [ ] GitHub Pages 是否已启用（Settings > Pages）
- [ ] Source 是否选择 "GitHub Actions"
- [ ] 工作流文件是否存在（`.github/workflows/deploy.yml`）
- [ ] Node.js 版本是否 >= 18
- [ ] 是否有构建错误

#### 问题4：Actions 权限问题

**解决方法**：
1. 前往 Settings > Actions > General
2. 在 "Workflow permissions" 部分
3. 选择 "Read and write permissions"
4. 勾选 "Allow GitHub Actions to create and approve pull requests"

### 构建问题

#### 问题1：构建失败

**检查**：
1. 查看错误信息
2. 检查 `package.json` 中的依赖
3. 确认 Node.js 版本

**解决方法**：
```bash
cd frontend
rm -rf node_modules dist
npm install
npm run build
```

#### 问题2：构建成功但预览失败

**检查**：
1. `dist` 目录是否存在
2. 文件是否完整
3. 预览端口是否被占用

### 调试技巧

#### 1. 查看浏览器控制台

按 F12 打开开发者工具，查看：
- **Console**：JavaScript 错误
- **Network**：资源加载问题
- **Application**：LocalStorage 数据

#### 2. 查看构建日志

```bash
cd frontend
npm run build
# 查看输出信息
```

#### 3. 检查 GitHub Actions 日志

1. 前往 GitHub 仓库
2. 点击 Actions 标签
3. 查看最新的工作流运行
4. 点击查看详细日志

#### 4. 本地测试构建

```bash
cd frontend
npm run build
npm run preview
# 访问 http://localhost:4173
```

### 常见错误

#### 错误1：`Cannot find module`

**原因**：依赖未安装或路径错误

**解决**：
```bash
cd frontend
npm install
```

#### 错误2：`Port 3000 is already in use`

**原因**：端口被占用

**解决**：
```bash
npm run dev -- --port 3001
```

#### 错误3：`base path must start with /`

**原因**：vite.config.js 中 base 路径配置错误

**解决**：确保 base 路径以 `/` 开头和结尾：
```js
const base = '/avacado/'  // ✅ 正确
const base = 'avacado'    // ❌ 错误
```

#### 错误4：GitHub Pages 显示旧版本

**原因**：缓存问题

**解决**：
1. 清除浏览器缓存
2. 强制刷新（Ctrl+F5 或 Cmd+Shift+R）
3. 等待几分钟后重试

## 🔍 GitHub Pages URL 说明

### 标准格式

GitHub Pages 的 URL 格式为：
```
https://你的GitHub用户名.github.io/仓库名称/
```

### 示例

如果你的 GitHub 用户名是 `chengyaoshen`，仓库名称是 `avacado`，那么访问地址是：
```
https://chengyaoshen.github.io/avacado/
```

### 如何确认你的 URL

#### 方法1：查看 GitHub 仓库设置

1. 打开你的 GitHub 仓库页面
2. 点击 **Settings**（设置）
3. 在左侧菜单找到 **Pages**（页面）
4. 在 **Pages** 设置页面，你会看到访问链接

#### 方法2：查看部署状态

1. 打开你的 GitHub 仓库
2. 点击 **Actions**（操作）标签
3. 查看最新的部署工作流
4. 部署成功后，会显示访问链接

#### 方法3：直接访问

根据你的用户名和仓库名，直接访问：
```
https://你的用户名.github.io/仓库名称/
```

## 📝 响应式设计

- **手机**: 优化了触摸交互，适配小屏幕
- **平板**: 中等屏幕优化布局
- **电脑**: 大屏幕最佳体验
- **横屏/竖屏**: 自动适配不同方向

## 🔐 数据安全

- 所有数据存储在浏览器的 LocalStorage 中
- 数据不会上传到服务器，完全本地化
- 清除浏览器数据会删除所有记录
- 建议定期备份重要数据

## 🎯 未来改进

- [ ] 添加数据导出/导入功能
- [ ] 添加云同步功能（可选）
- [ ] 添加数据备份功能
- [ ] 优化移动端体验
- [ ] 添加离线支持（PWA）
- [ ] 添加多语言支持

## 📄 许可证

MIT

---

Made with 🥑 by Avacado Team
