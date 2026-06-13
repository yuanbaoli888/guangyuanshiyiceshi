# AI Handoff - 项目交接说明

这份文档用于在新开 Codex/AI 对话时快速恢复上下文。新对话开始后，先让 AI 阅读本文件，再继续开发。

## 新窗口建议开场白

请先阅读项目根目录的 `AI_HANDOFF.md`，了解当前项目状态、技术栈、运行方式、Git 规则和下一步计划。读完后先总结你理解到的项目现状，再继续根据我的新需求开发。

## 项目当前目标

这个项目最初是一个 `FastAPI + React + SQLite` 全栈认证脚手架，现在正在往一个名为 `AnyTryOn` 的在线虚拟试穿产品页面方向演进。

当前优先目标：

- 先把用户提供截图里的完整首页 UI 做出来。
- 首页目前以静态展示为主，先保留截图中的全部信息和模块。
- 后续再逐步替换真实图片素材、调整视觉细节、接入真实上传/试穿逻辑。

## 当前技术栈

- 前端：React + Vite + React Router
- 后端：Python + FastAPI
- 数据库：SQLite
- 迁移：Alembic
- 认证：JWT + bcrypt

## 当前代码状态

当前分支：`main`

最近重要提交：

- `5b4c2ff Initial fullstack auth scaffold`
  - 初始全栈认证脚手架。
  - 包含前端登录/注册/受保护页面，后端认证接口，SQLite 和 Alembic。
- `a9cf134 Build AnyTryOn landing page`
  - 将首页改造成 AnyTryOn 风格长页面。
  - 保留了用户截图中的主要模块和文字。

当前工作区在写入本文件前是干净状态。

## 已完成内容

### 后端

后端仍是初始认证脚手架：

- `/health`
- `/auth/register`
- `/auth/login`
- `/auth/logout`
- `/auth/me`
- `/users` 相关用户接口
- SQLite 数据库配置
- Alembic 迁移

### 前端

当前首页已经改成 AnyTryOn landing page 第一版，主要文件：

- `frontend/src/App.jsx`
- `frontend/src/pages/Home.jsx`
- `frontend/src/styles.css`

首页包含：

- 顶部导航：`AnyTryOn.`、`使用指南`、`常见问题`、`试穿`、`定价`、语言选择、登录按钮
- Hero：`在线虚拟 试穿 工具`
- Cookie 选择卡片
- 虚拟试穿工作区：
  - 人物照上传
  - 主服装图上传
  - 下装图上传
  - 试穿前/试穿后预览
  - 风格选择
  - 关注点、比例、尺寸、一键试衣
- `先试穿，再决定穿什么`
- `为什么先做虚拟试穿`
- `如何用 AnyTryOn 在线试穿衣服`
- `需要更具体的试穿场景？`
- FAQ
- 底部 CTA
- Footer

注意：当前图片区域是模拟照片占位，还没有替换成真实素材。

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

回到初始脚手架，然后又重新做了 AnyTryOn 首页。

## 下一步建议

优先下一步可以做：

1. 对照用户截图继续微调首页视觉细节。
2. 替换真实人物/服装图片素材。
3. 把登录按钮、开始虚拟试穿按钮和工作区交互串起来。
4. 做上传图片预览逻辑。
5. 后端新增试穿任务 API 草案，例如 `/tryon/jobs`。
6. 后续再接入真实 AI 图片生成服务。

## 给新 AI 的注意事项

- 先读代码，不要假设当前状态。
- 首页当前是静态 UI 第一版，不是最终产品。
- 图片占位是临时方案。
- 用户更关心“能看见完整页面”和“Git 可回滚”，不要一次性做太大不可控重构。
- 回复用户时尽量用中文，解释要清楚、直接。
