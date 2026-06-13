# AI Handoff - 项目交接说明

这份文档用于在新开 Codex/AI 对话时快速恢复上下文。新对话开始后，先让 AI 阅读本文件，再继续开发。

## 新窗口建议开场白

请先阅读项目根目录的 `AI_HANDOFF.md`，了解当前项目状态、技术栈、运行方式、Git 规则和下一步计划。读完后先总结你理解到的项目现状，再继续根据我的新需求开发。

## 项目当前目标

这个项目最初是一个 `FastAPI + React + SQLite` 全栈认证脚手架，现在正在往一个名为 `光原TryOn`（Guangyuan TryOn）的在线虚拟试穿产品页面方向演进。

当前优先目标：

- 首页 UI 第一版已完成（对照用户截图），目前以静态展示为主。
- Hero 区图片素材已替换为真实图片，并加了 hover 切换效果。
- 后续重点：继续微调视觉细节、把上传/预览/按钮做成可交互、接入真实试穿逻辑。

## 当前技术栈

- 前端：React + Vite + React Router
- 后端：Python + FastAPI
- 数据库：SQLite
- 迁移：Alembic
- 认证：JWT + bcrypt

## 当前代码状态

当前分支：`main`

最近重要提交（`main` 顶部，新到旧）：

- `7658f3c / 8be6836 / 4bf8184 / 09d4052 Hide hero tile labels`
  - 隐藏 Hero 拼贴四格上的文字标签（fashion / commerce / daily / person）。
- `294dec7 Rename brand to Guangyuan TryOn`
  - 品牌从 `AnyTryOn` 统一改名为 `光原TryOn`（全站文案、品牌标、footer、版权）。
- `a757d26 Add hover swaps for hero style tiles`
  - Hero 风格卡片增加 hover 切换图（鼠标悬停时 before → after）。
- `f02fddb Remove cookie choice card`
  - 移除首页早期的 Cookie 选择卡片。
- 更早：`a9cf134 Build AnyTryOn landing page`（首页第一版）、`5b4c2ff Initial fullstack auth scaffold`（初始认证脚手架）。

当前工作区在写入本文件前是干净状态。

## 已完成内容

### 后端

后端仍是初始认证脚手架，**尚未新增任何试穿（tryon）接口**：

- `/health`
- `/auth/register`、`/auth/login`、`/auth/logout`、`/auth/me`
- `/users` 用户接口（列表 / me / 按 id 查 / 改 / 删）
- SQLite 数据库配置
- Alembic 迁移

路由挂载见 `backend/app/main.py`（`health` / `auth` / `users` 三个 router）。

### 前端

当前首页是 `光原TryOn` landing page，主要文件：

- `frontend/src/App.jsx`（顶栏导航 + 路由 + 品牌点击回顶）
- `frontend/src/pages/Home.jsx`（首页全部区块，约 400 行）
- `frontend/src/styles.css`（约 1400 行样式）
- `frontend/src/assets/`（真实图片素材：commerce / daily / fashion / tryon-person 各有 before + after，共 8 张）

顶部导航（在 `App.jsx`）：品牌 `光`/`光原TryOn`、`使用指南`、`常见问题`、`试穿`、`定价`、语言选择、登录/控制台/退出按钮（按登录态切换）。

首页区块（按 `Home.jsx` 顺序）：

- Hero（`#try-on`）：标题 `在线虚拟 试穿 工具` + 右侧四格拼贴，已用真实图，**hover 时 before → after 切换**，四格文字标签已隐藏。
- 虚拟试穿工作区（`#workspace`）：
  - 左：人物照（必选）、主服装图（必选）、下装图（可选）上传面板
  - 中：试穿前/试穿后预览、主服装图/下装图素材
  - 右：风格选择、关注点、比例、尺寸、`一键试衣`
- `先试穿，再决定穿什么`
- `为什么先做虚拟试穿`（有无虚拟试穿对比）
- `如何用 光原TryOn 在线试穿衣服`（`#guide`，三步）
- `需要更具体的试穿场景？`（`#pricing`，场景卡片）
- FAQ（`#faq`，折叠列表，答案为占位文案）
- 底部 CTA
- Footer
- 右下角悬浮工具按钮

注意：Hero 四格已是真实图片；工作区内部分缩略图（cloth/pants/portrait 等）仍是 CSS 占位块，FAQ 答案也仍是占位文案。早期的 Cookie 选择卡片已移除。

## 启动方式

项目根目录：

```powershell
E:\iwen-codex\项目实战测试
```

后端：

```powershell
cd backend
.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

前端：

```powershell
cd frontend
npx vite --host 0.0.0.0 --port 5173
```

访问地址：

- 前端：`http://localhost:5173`
- 后端健康检查：`http://127.0.0.1:8000/health`

## 验证命令

前端：

```powershell
cd frontend
npm run lint
npm run build
```

后端：

```powershell
cd backend
.venv\Scripts\python.exe -m compileall app
```

## 用户的固定协作规则

用户要求：

- 以后只要 AI 修改、添加、删除代码或项目文件，都要执行：
  - `git add`
  - `git commit`
- 不要随意丢弃用户改动。
- 如果要回滚、reset、删除分支等危险操作，必须先确认。

## Git 操作历史提醒

用户已经学习并操作过：

- `git init`
- `git add`
- `git commit`
- 分支：`main`、`master`、曾经有 `text`
- 删除分支
- 切换分支
- `git revert`
- `git reset --hard`

用户曾要求用：

```powershell
git reset --hard 5b4c2ff
```

回到初始脚手架，然后又重新做了首页（即现在的 `光原TryOn` landing page）。

## 下一步建议

优先下一步可以做：

1. 对照用户截图继续微调首页视觉细节。
2. 替换工作区内剩余的占位缩略图（Hero 四格已用真实图，此项部分完成）。
3. 把登录按钮、开始虚拟试穿按钮和工作区交互串起来。
4. 做上传图片预览逻辑。
5. 补全 FAQ 折叠项的真实答案文案。
6. 后端新增试穿任务 API 草案，例如 `/tryon/jobs`（目前后端无任何 tryon 接口）。
7. 后续再接入真实 AI 图片生成服务。

## 给新 AI 的注意事项

- 先读代码，不要假设当前状态。
- 首页当前是静态 UI 第一版，不是最终产品。
- 图片占位是临时方案。
- 用户更关心“能看见完整页面”和“Git 可回滚”，不要一次性做太大不可控重构。
- 回复用户时尽量用中文，解释要清楚、直接。
