# AI Handoff - 项目交接说明

这份文档用于在新开 AI 对话时快速恢复上下文。**新对话开始后，先让 AI 读本文件，再继续。**

## 新窗口建议开场白

> 请先阅读项目根目录的 `AI_HANDOFF.md`，了解项目现状、当前分支、已经完成的产品化阶段、虚拟试穿/换模型方式、运行方式、Git 规则和后续计划。读完先用中文总结你理解到的现状，再继续我的新需求。

---

## 一、项目是什么

`光原TryOn`（Guangyuan TryOn）——一个**在线虚拟试穿**网页产品。用户上传人物照 + 服装图，点「一键试衣」，AI 把衣服穿到人物身上并返回效果图。
项目最初是一个全栈认证脚手架，现已演进为带**真实可用试衣功能**的产品页。

### 当前存储点（2026-06-18）
- GitHub 仓库：`https://github.com/yuanbaoli888/guangyuanshiyiceshi`
- 当前开发分支：`product-foundation`
- 当前顶部提交：`b2dc99f Track try-on jobs during generation`
- 分支来源：从原开发分支 `text` 继续创建，用于把 demo 往真实项目产品化推进；原 `text` 分支仍停在 `1d6ebcb Require login for try-on generation`。
- 继续开发时：优先留在 `product-foundation` 分支小步修改、验证、提交、推送；确认稳定后再决定是否合并回主线。
- 注意：`backend/.env`、API Key、`incoming-photos/` 原图、`.claude/` 本地配置不作为项目代码上传。

### 当前阶段总览（新对话先看这里）
- 已完成：未登录不能一键试衣。前端按钮会引导登录/注册，后端 `/tryon/generate` 也要求有效 JWT。
- 已完成：FAQ 文案、指南/决策区视觉迭代、上传示例图和 hover 展示等首页产品展示优化。
- 已完成第一阶段：真实项目数据库地基，新增 `assets`、`tryon_jobs`、`credit_accounts`、`credit_transactions` 及 Alembic 迁移。
- 已完成第二阶段：一键试衣仍同步返回图片，但每次生成会落 `tryon_jobs`；成功写结果 `assets`，失败写错误状态和错误信息；返回里新增 `job_id`。
- 已预留但未启用：积分扣费、失败退款、积分规则、防刷限流。预留位置在 `backend/app/services/tryon_jobs.py` 的 `reserve_tryon_credits(...)` 和 `refund_tryon_credits(...)`。
- 后续建议：对象存储落图、历史记录页面、结果详情页、真正异步任务队列、积分/套餐方案、后台管理、前端组件拆分。

## 二、技术栈

- 前端：React + Vite + React Router
- 后端：Python + FastAPI（SQLite + Alembic + JWT/bcrypt 的认证脚手架仍在）
- AI 能力：调用**第三方图像编辑大模型**（当前是 vveai 聚合站的 `nano-banana`），不是自己训练的模型

---

## 三、★ 虚拟试穿是怎么实现的（核心，换模型必读）

### 调用链路
前端「一键试衣」→ 把 人物图/主服装图/下装图 压缩成 jpeg base64（`toJpegDataUrl`，最长边 1536）
→ `POST /tryon/generate`（JSON）→ 后端拼提示词、调模型 → **同步返回结果图 URL** → 前端在"试穿后"展示 + 下载。

### 当前用的模型/平台
- 平台：**vveai**（`https://api.vveai.com`），**OpenAI 兼容**聚合站。
- 接口：`POST {base}/v1/chat/completions`，多模态 `messages`（一段 text 提示词 + 两/三张 `image_url` 的 base64 data URI）。
- 模型：`nano-banana-2-2k` / `nano-banana-2-4k`（实际解析到 `gemini-3.x-flash-image`）。
- 返回：结果图是 `choices[0].message.content` 里的 **markdown 图片链接** `![image](https://...jpg)`，解析 URL 即可。
- 同步返回（约 10–30s），约 0.5 元/张。`restore_face` 类能力使人脸保持较好。

### 唯一的"模型集成点"——`backend/app/services/tryon.py`
所有与模型相关的逻辑**只在这一个文件**：
- `_build_prompt(...)`：**提示词模板**（含 `STYLE_HINTS` / `FOCUS_HINTS`），按是否有上/下装、关注点、比例拼接。改提示词只动这里。
- `_model_for_size(size)`：`4K → ai_model_4k`，其余 `→ ai_model_2k`。
- `generate_tryon(person_image, top_image, bottom_image, style, focus, ratio, size) -> 结果图URL`：组请求、调接口、`_extract_image_url` 解析返回。

路由 `backend/app/api/routes/tryon.py` 和前端都只依赖 `generate_tryon` 的"输入图+参数 → 返回图URL"这个契约，**换模型时它们通常不用改**。

### ★ 如何换成其他模型 / 平台
按改动大小分三种：
1. **同平台换模型**（最简单）：改 `backend/.env` 里的 `AI_MODEL_2K` / `AI_MODEL_4K`。
   - 要求新模型是**图像编辑类**（能"输入图片+提示词→输出图片"），不能是纯文生图。
2. **换平台但仍是 OpenAI 兼容、chat/completions 返回图**：改 `.env` 的 `AI_API_BASE_URL` + `AI_API_KEY`（+模型名）。若返回格式不同，改 `tryon.py` 里的 `_extract_image_url`。
3. **接口形态不同**（例如要求公网图片 URL、用 `/v1/images/edits` multipart、或异步任务轮询）：**只重写 `tryon.py` 里的 `generate_tryon`**（保持函数签名/返回 URL 不变），路由和前端不动。
   - 注意坑：有的模型（如阿里云 AITryOn）**只接受公网 URL、不收 base64**，那就需要先把上传图存到对象存储（OSS/COS）拿到 URL——这会多一步，且当前项目没做存储。

---

## 四、目录与关键文件

### 后端 `backend/`
- `app/main.py`：挂载 4 个 router —— `health` / `auth`(`/auth`) / `users`(`/users`) / **`tryon`(`/tryon`)**。
- `app/api/routes/tryon.py`：`POST /tryon/generate`。请求体 `TryonRequest`（`person_image` 必填，`top_image`/`bottom_image` 至少一个，外加 `style/focus/ratio/size`，都是 data URI 或 http URL）；校验失败 400，模型出错 502；成功返回 `{ "image_url": ..., "job_id": ... }`。另有 `GET /tryon/jobs` 和 `GET /tryon/jobs/{job_id}`，用于查询当前登录用户自己的试衣任务记录。
- `app/services/tryon.py`：见上一节（模型集成点 + 提示词）。
- `app/services/tryon_jobs.py`：试衣任务编排层。当前仍同步调用模型，但会先创建 `tryon_jobs`，生成中标记 `processing`，成功写 `assets` 结果图并标记 `succeeded`，失败写错误信息并标记 `failed`。
- `app/core/config.py`：pydantic `Settings`，新增字段 `ai_api_base_url / ai_api_key / ai_model_2k / ai_model_4k`，从 `backend/.env` 读。
- 认证脚手架接口不变：`/health`、`/auth/*`、`/users/*`。

### 真实项目数据库地基
- `app/models/asset.py`：`assets` 图片资产表，准备统一记录人物图、服装图、结果图的存储位置、尺寸、文件大小、hash、软删除状态。
- `app/models/tryon_job.py`：`tryon_jobs` 生成任务表，准备记录每次试衣的素材、状态、模型名、提示词快照、失败原因和积分成本。
- `app/models/billing.py`：`credit_accounts` 积分账户表 + `credit_transactions` 积分流水表，准备支持赠送、消费、退款和对账。
- `migrations/versions/20260618_0001_product_foundation.py`：新增以上真实项目地基表；迁移已接到 `0001_create_users` 后面，`0001_create_users` 也做了表存在时跳过，便于兼容已有本地库。
- 注意：现有一键试衣接口仍是同步生成，但已经会落 `tryon_jobs` 和结果 `assets`。积分扣费/失败退款尚未启用，预留在 `app/services/tryon_jobs.py` 的 `reserve_tryon_credits(...)` 和 `refund_tryon_credits(...)`。

### 前端 `frontend/src/`
- `pages/Home.jsx`：首页全部内容（约 600 行）。
- `App.jsx`：顶栏导航 + 路由。
- `shared/api.js`：`apiRequest` + `generateTryon(payload)`。
- `styles.css`：全部样式。
- `assets/`：图片素材。命名约定：
  - Hero/示例：`commerce/daily/fashion/tryon-person` 各 before/after；`stage-before/after`（中间预览默认示例）。
  - 上传面板示例图库：`sample-person-1..3`、`sample-top-1..3`、`sample-bottom-1..3`。
  - 决策区 hover 预览：`decision-buy-*`、`decision-compare-*`、`decision-share-*`，每组包含 before/after 两张压缩 JPG。

### 工作区（首页核心交互区，`#workspace`）
- **左列：3 个上传面板**（人物照必选 / 主服装图必选 / 下装图可选）。每个面板：
  - 点「添加…」→ 弹系统选图 → 选中后**大图预览 + 右上角 ✕ 移除**；
  - 下方「没有图片?」处有**3 张可点击示例图**（悬停放大、点击一键载入，等价于上传）。
  - 受控状态由 `useUploadSlot` 管理（上传产生 blob 会 `revokeObjectURL`，示例图是静态资源不释放）。
- **中列：深色预览台**，按状态切换：
  1. 有结果 → 「试穿前(人物)/试穿后(结果)」+「下载 / 查看大图」；
  2. 生成中 → loading 转圈；
  3. 上传了任意图 → 「素材已准备好 / 准备素材」+ 人物/主服装/下装三张素材卡；
  4. 都没传 → 默认示例对比图（`stage-before/after`）。
  下方还有「主服装图 / 下装图」两张资产卡（没传显示"未使用"层叠图标）。
- **右列：设置卡**（已精简）：`关注点(服装/我)` + `尺寸(2K/4K)` + `一键试衣`。
  - **注意：早期的「风格」「比例」模块已按用户要求删除**；比例固定走"自动"。
  - `尺寸` 直接关联模型：2K→`nano-banana-2-2k`，4K→`nano-banana-2-4k`。

### 决策区（`先试穿，再决定穿什么`）
- 左侧 3 张权益卡：`购买前预览` / `比较穿搭` / `分享预览`。
- 标签前已添加小图标：`购买更安心` / `更多选择` / `无水印下载`。
- 卡片有 hover/focus 触感：轻微上浮、阴影增强、边框变暖。
- 鼠标移到不同卡片时，右侧预览区同步切换对应 before/after 图片，底部胶囊标题同步切换。
- 这部分只影响静态展示，不影响真实试衣接口和模型调用。

---

## 五、密钥与配置（`backend/.env`，已被 git 忽略）

```
AI_API_BASE_URL=https://api.vveai.com
AI_API_KEY=sk-...        # 用户自己的 key，不入库、不进前端、别贴聊天
AI_MODEL_2K=nano-banana-2-2k
AI_MODEL_4K=nano-banana-2-4k
```
（另有 SECRET_KEY 等脚手架变量。`backend/.env.example` 是模板。）

其它说明：
- `incoming-photos/`：用户收集的大图原图（~18MB/张），**已 gitignore**，仅本地用；压缩后的小图才进 `assets/`。
- `backend/.venv` 里装了 **Pillow**，仅用于本地把大图压成 jpg（不是 App 运行依赖）。

---

## 六、运行 & 验证

```powershell
# 后端（在 backend 目录）
.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
# 前端（在 frontend 目录）
npx vite --host 0.0.0.0 --port 5173
```
- 前端：`http://localhost:5173`；后端健康检查：`http://127.0.0.1:8000/health`
- 前端默认连 `http://localhost:8000`（可用 `VITE_API_URL` 覆盖）。

验证：前端 `npm run lint` + `npm run build`；后端 `.venv\Scripts\python.exe -m compileall app`。

---

## 七、Git 规则（用户固定要求）

- 只要 AI 改/加/删代码或文件，都要 `git add` + `git commit`。
- 不要随意丢弃用户改动。
- 危险操作（`reset` / 回滚 / 删分支 / `--force` 等）**必须先确认**。
- 当前产品化开发分支：`product-foundation`。
- 原开发分支：`text`，当前停在 `1d6ebcb Require login for try-on generation`。产品化改动先在 `product-foundation` 上验证，确认后再决定是否合并回主线。

### 当前代码状态（顶部提交，新→旧）
```
b2dc99f Track try-on jobs during generation
97d7456 Add product database foundation
1d6ebcb Require login for try-on generation
2437d7b Update FAQ copy
4c920be Add hover images to guide steps
4029767 Restyle compare cards with overlap
71ac3c7 Update stored handoff commit pointer
77a54f7 Store current project handoff state
```
写本存储点时：当前分支为 `product-foundation`；工作区只剩本地未跟踪 `.claude/`，不属于项目提交内容。

---

## 八、已知限制 / 可做的下一步

- **比例精确化**：目前比例只是提示词、且选择器已删，实际不保证输出比例。要 1:1/16:9 精确出图需生成后裁剪/扩图。
- **下载**：现在是新标签打开模型返回的远程图（链接会过期），未做后端代理强制下载/落地保存。
- **积分/限流未接入业务流**：已建 `credit_accounts` / `credit_transactions` 表，并在 `tryon_jobs.py` 预留扣费/退款 hook，但还没有真实扣费、防刷和失败退款规则。
- **结果历史部分接入业务流**：已建 `tryon_jobs` / `assets` 表，并且生成接口会落任务和结果资产；但结果仍只是第三方临时 URL，尚未存对象存储。
- **认证已与试衣打通**：`/tryon/generate` 已要求登录；未登录前端按钮会引导登录/注册。
- 效果依赖所选模型：**换模型后务必拿真实图实测**人脸还原、衣服花纹是否够准。

建议后续推进顺序：
1. 对象存储落图：生成成功后把第三方结果图下载到自有 OSS/COS/R2/S3，`assets` 保存 `storage_key`，下载走后端签名链接。
2. 历史记录/结果详情：用 `GET /tryon/jobs` 和 `GET /tryon/jobs/{job_id}` 做前端历史页面和结果详情页。
3. 积分方案落地：用户确认扣费/赠送/退款规则后，在 `reserve_tryon_credits(...)` / `refund_tryon_credits(...)` 接入真实余额和流水。
4. 异步任务队列：把当前同步生成改成创建任务后由 worker 执行，前端轮询任务状态。
5. 后台管理：查看用户、任务、失败原因、积分流水，支持人工退款/删除违规图片。

## 九、给新 AI 的注意事项

- 先读代码、读本文件，不要假设状态。
- 换模型只动 `backend/app/services/tryon.py` + `backend/.env`，别动路由/前端契约。
- 用户重视"能看见完整页面""Git 可回滚"，不要一次做太大不可控重构；每步小改、跑通、提交。
- 回复用中文，清楚、直接。

## 十、以后换模型 / 更新数据的操作流程

1. 先同步：`git pull`。
2. 如果只是换同平台模型：改 `backend/.env` 的 `AI_MODEL_2K` / `AI_MODEL_4K`，不提交 `.env`。
3. 如果换 OpenAI 兼容平台：改 `backend/.env` 的 `AI_API_BASE_URL` / `AI_API_KEY` / 模型名；如返回格式不同，再改 `backend/app/services/tryon.py` 的 `_extract_image_url`。
4. 如果新模型接口形态不同：只重写 `backend/app/services/tryon.py` 的 `generate_tryon`，保持函数签名和返回 URL 契约不变。
5. 新增展示图片时：原图先放 `incoming-photos/` 本地处理，压缩后的 JPG/PNG 再放 `frontend/src/assets/` 入库。
6. 每次修改后验证：前端 `npm run lint` + `npm run build`；后端如有改动跑 `.venv\Scripts\python.exe -m compileall app`。
7. 验证通过后：`git add` + `git commit` + `git push`，让 GitHub 保存最新版本。
