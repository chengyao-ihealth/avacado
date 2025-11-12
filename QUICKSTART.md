# Avacado 快速开始指南 🥑

## 本地开发

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 访问应用

打开浏览器访问：http://localhost:3000

## 部署到 GitHub Pages

### 方法1：使用 GitHub Actions（推荐，自动部署）

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **启用 GitHub Pages**
   - 在 GitHub 仓库页面，点击 Settings
   - 在左侧菜单找到 Pages
   - 在 Source 部分，选择 "GitHub Actions"

3. **等待自动部署**
   - GitHub Actions 会自动构建并部署
   - 部署完成后，访问 `https://你的GitHub用户名.github.io/avacado/`
   - 例如：`https://chengyaoshen.github.io/avacado/`
   - 📌 **注意**：如果仓库名称不是 `avacado`，需要修改 `frontend/vite.config.js` 中的 `base` 路径
   - 详细说明请查看 [GITHUB_PAGES_URL.md](./GITHUB_PAGES_URL.md)

### 方法2：手动部署

1. **修改仓库名称（如果需要）**
   
   如果你的仓库名称不是 `avacado`，编辑 `frontend/vite.config.js`：
   ```js
   const base = mode === 'development' ? '/' : '/your-repo-name/'
   ```

2. **安装 gh-pages**
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

3. **部署**
   ```bash
   npm run deploy
   ```

4. **配置 GitHub Pages**
   - 在 GitHub 仓库 Settings > Pages
   - Source 选择 `gh-pages` 分支
   - 访问应用：`https://your-username.github.io/avacado/`

## 使用流程

1. **首次使用**
   - 填写你的姓名（必填）
   - 填写个人背景（可选）
   - 填写病例信息（可选）
   - 点击"开始使用 🥑"

2. **开始聊天**
   - 如果当天有未记录的项目（饮食、症状、运动、心情、睡眠），Avacado会自动问候并询问
   - 你可以直接告诉Avacado你的情况，比如：
     - "今天吃了米饭和蔬菜"
     - "感觉有点累"
     - "今天走了30分钟"
     - "心情不错"
     - "昨晚睡了7小时"

3. **查看记录**
   - 顶部显示今日记录摘要
   - 已完成的项目显示为绿色
   - 未完成的项目显示为橙色并带有提醒

## 功能特点

- 🥑 **Avocado主题** - 美丽的绿色系界面
- 💬 **智能对话** - 自然语言理解，自动提取信息
- 📊 **自动记录** - 自动识别并记录健康数据
- 🔔 **主动提醒** - 缺失数据时主动询问
- 📱 **响应式设计** - 完美适配手机、平板和电脑
- 🌓 **横竖屏支持** - 自动适配横屏和竖屏模式
- 💾 **本地存储** - 所有数据存储在浏览器本地，隐私安全

## 数据存储

- 所有数据存储在浏览器的 LocalStorage 中
- 数据不会上传到服务器，完全本地化
- 清除浏览器数据会删除所有记录

## 故障排除

### 端口被占用

如果3000端口被占用，Vite会自动使用下一个可用端口。

### 依赖安装失败

```bash
# 清除缓存后重试
rm -rf node_modules package-lock.json
npm install
```

### 部署后页面空白

- 检查 `frontend/vite.config.js` 中的 `base` 路径是否正确
- 确保 GitHub Pages 设置正确
- 检查浏览器控制台是否有错误

## 需要帮助？

查看完整的 README.md 和 DEPLOY.md 文件获取更多信息。

---

祝使用愉快！🥑
