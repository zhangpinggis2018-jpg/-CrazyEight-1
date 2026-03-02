# 平哥的疯狂8点 (Crazy Eights)

一个精致且互动的疯狂8点纸牌游戏，基于 React, Tailwind CSS 和 Motion 构建。

## 🚀 部署指南 (Vercel)

### 1. 同步到 GitHub
1. 在 GitHub 上创建一个新的仓库（例如：`crazy-eights`）。
2. 在本地终端中运行以下命令：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/crazy-eights.git
   git push -u origin main
   ```

### 2. 部署到 Vercel
1. 登录 [Vercel](https://vercel.com/)。
2. 点击 **"Add New"** -> **"Project"**。
3. 导入您刚刚创建的 GitHub 仓库。
4. 在 **"Environment Variables"** 中添加：
   - `GEMINI_API_KEY`: 您的 Google AI Studio API 密钥（如果后续需要 AI 功能）。
5. 点击 **"Deploy"**。

## 🛠️ 技术栈
- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS
- **Animation**: Motion (Framer Motion)
- **Icons**: Lucide React

## 🎮 游戏规则
- 匹配顶牌的 **花色** 或 **点数**。
- **8是万能牌**：随时可以打出并指定新的花色。
- 最先清空手牌的玩家获胜！

## 📄 许可证
Apache-2.0
