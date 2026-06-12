# Fullstack Auth Scaffold

一个可开箱运行的全栈认证脚手架，包含 React 前端、FastAPI 后端、SQLite 数据库、Alembic 迁移，以及登录、注册、登出和用户 CRUD 模板。

## 技术栈

- 前端：React + Vite + React Router
- 后端：Python + FastAPI + SQLAlchemy
- 数据库：SQLite
- 迁移：Alembic
- 认证：JWT + bcrypt
- 登录态：前端 `localStorage` 保存 access token

## 目录结构

```text
frontend/          React 前端项目
backend/           FastAPI 后端项目
migrations/        Alembic 迁移目录
.env.example       根目录配置示例
README.md          项目说明
```

## 后端启动

进入后端目录：

```bash
cd backend
```

创建并激活虚拟环境：

```bash
python -m venv .venv
.venv\Scripts\activate
```

macOS/Linux：

```bash
source .venv/bin/activate
```

安装依赖并创建配置：

```bash
pip install -r requirements.txt
copy .env.example .env
```

macOS/Linux 复制配置：

```bash
cp .env.example .env
```

执行数据库迁移：

```bash
alembic upgrade head
```

启动 API 服务：

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

运行后端 smoke test：

```bash
python scripts/smoke_test.py
```

后端地址：

- API: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`
- Health: `http://localhost:8000/health`

## 前端启动

进入前端目录：

```bash
cd frontend
```

安装依赖并创建配置：

```bash
npm install
copy .env.example .env
```

macOS/Linux 复制配置：

```bash
cp .env.example .env
```

启动前端：

```bash
npm run dev
```

前端地址：`http://localhost:5173`

## 数据库迁移

迁移命令需要从 `backend/` 目录执行：

```bash
alembic upgrade head
alembic downgrade -1
alembic revision --autogenerate -m "add new table"
```

默认数据库文件是 `backend/app.db`。如需修改路径，编辑 `backend/.env` 中的 `DB_PATH`。

重置本地开发数据库时，可以删除 `backend/app.db` 后重新执行：

```bash
alembic upgrade head
```

## API 示例

注册：

```bash
curl -X POST http://localhost:8000/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"demo\",\"email\":\"demo@example.com\",\"password\":\"password123\"}"
```

登录：

```bash
curl -X POST http://localhost:8000/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username_or_email\":\"demo\",\"password\":\"password123\"}"
```

获取当前用户：

```bash
curl http://localhost:8000/auth/me ^
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

用户列表：

```bash
curl http://localhost:8000/users ^
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

更新当前用户：

```bash
curl -X PUT http://localhost:8000/users/1 ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer <ACCESS_TOKEN>" ^
  -d "{\"username\":\"demo2\",\"email\":\"demo2@example.com\"}"
```

登出：

```bash
curl -X POST http://localhost:8000/auth/logout ^
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

## 登录登出流程

1. 用户通过 `POST /auth/register` 注册。
2. 用户通过 `POST /auth/login` 登录。
3. 后端返回 JWT access token。
4. 前端把 token 保存到 `localStorage` 的 `auth.access_token`。
5. 前端访问受保护页面时调用 `/auth/me` 校验登录态。
6. 后续 API 请求带上 `Authorization: Bearer <token>`。
7. 用户登出时调用 `POST /auth/logout`，然后清理本地 token。

当前登出实现使用内存集合记录已撤销 token，适合脚手架和本地开发。生产环境建议替换为 Redis 或数据库 token 黑名单。

## 配置说明

后端配置位于 `backend/.env`：

- `SECRET_KEY`：JWT 签名密钥，生产环境必须换成长随机值。
- `ACCESS_TOKEN_EXPIRE_MINUTES`：access token 有效期。
- `DB_PATH`：SQLite 文件路径。
- `BACKEND_CORS_ORIGINS`：允许访问 API 的前端地址，多个地址用英文逗号分隔。

前端配置位于 `frontend/.env`：

- `VITE_API_URL`：FastAPI 后端地址。

## 扩展方向

- 新增后端模块：在 `backend/app/api/routes/` 添加路由，在 `backend/app/models/` 添加模型。
- 新增前端页面：在 `frontend/src/pages/` 添加页面，并在 `frontend/src/App.jsx` 注册路由。
- 新增数据库表：添加 SQLAlchemy 模型后运行 `alembic revision --autogenerate`。
- 切换 MySQL/PostgreSQL：将 `DB_PATH` 扩展为完整 SQLAlchemy 数据库 URL，并安装对应驱动。
