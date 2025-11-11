# 部署指南

## 部署到 GitHub Pages

### 方法1：使用 GitHub Actions（推荐）

1. **修改仓库名称配置**
   
   如果你的 GitHub 仓库名称不是 `avacado`，需要修改配置：
   
   - 编辑 `frontend/vite.config.js`，修改 `base` 路径：
   ```js
   const base = process.env.VITE_BASE_PATH || '/your-repo-name/'
   ```
   
   或者设置环境变量：
   ```bash
   export VITE_BASE_PATH=/your-repo-name/
   ```

2. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **启用 GitHub Pages**
   - 在 GitHub 仓库页面，点击 Settings
   - 在左侧菜单找到 Pages
   - 在 Source 部分，选择 "GitHub Actions"

4. **等待部署完成**
   - GitHub Actions 会自动构建并部署
   - 部署完成后，访问 `https://your-username.github.io/avacado/`

### 方法2：手动部署

1. **安装依赖**
   ```bash
   cd frontend
   npm install
   ```

2. **修改 base 路径**
   
   编辑 `frontend/vite.config.js`：
   ```js
   const base = '/your-repo-name/'
   ```

3. **构建项目**
   ```bash
   npm run build
   ```

4. **安装 gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

5. **部署到 GitHub Pages**
   ```bash
   npm run deploy
   ```

6. **配置 GitHub Pages**
   - 在 GitHub 仓库 Settings > Pages
   - Source 选择 `gh-pages` 分支
   - 访问应用：`https://your-username.github.io/avacado/`

## 部署到自定义域名

1. **修改 base 路径**
   
   编辑 `frontend/vite.config.js`：
   ```js
   const base = '/'
   ```

2. **构建项目**
   ```bash
   cd frontend
   npm run build
   ```

3. **上传 dist 目录**
   - 将 `frontend/dist` 目录的内容上传到你的 Web 服务器
   - 配置服务器支持 SPA（单页应用）路由

4. **配置域名**
   - 在 GitHub Pages 设置中，添加自定义域名
   - 或者直接在 Web 服务器上配置

## 部署到其他静态托管服务

### Netlify

1. **连接 GitHub 仓库**
   - 在 Netlify 中连接你的 GitHub 仓库
   - 构建命令：`cd frontend && npm install && npm run build`
   - 发布目录：`frontend/dist`

2. **修改 base 路径**
   ```js
   const base = '/'
   ```

### Vercel

1. **连接 GitHub 仓库**
   - 在 Vercel 中导入 GitHub 仓库
   - 框架预设选择 Vite
   - 根目录设置为 `frontend`

2. **修改 base 路径**
   ```js
   const base = '/'
   ```

## 故障排除

### 页面空白

- 检查 `vite.config.js` 中的 `base` 路径是否正确
- 检查浏览器控制台是否有 404 错误
- 确保所有静态资源路径正确

### 路由问题

- GitHub Pages 不支持客户端路由，需要配置 404 重定向
- 或者使用 Hash 路由（需要修改代码）

### 构建失败

- 检查 Node.js 版本（需要 Node.js 18+）
- 清除 node_modules 和重新安装
- 检查依赖版本兼容性

## 环境变量

可以在 `.env` 文件中设置环境变量：

```env
VITE_BASE_PATH=/avacado/
```

然后在 `vite.config.js` 中使用：

```js
const base = import.meta.env.VITE_BASE_PATH || '/avacado/'
```

