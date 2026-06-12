import { Link } from "react-router-dom";

import { useAuth } from "../shared/useAuth.js";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="page hero">
      <section>
        <p className="eyebrow">React + FastAPI + SQLite</p>
        <h1>开箱即用的登录注册全栈脚手架</h1>
        <p className="lead">
          前后端独立启动，REST API 互通，JWT 登录态保存在 localStorage，后端提供 SQLite
          迁移与用户 CRUD 模板。
        </p>
        <div className="actions">
          {user ? (
            <Link className="button primary" to="/dashboard">
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link className="button primary" to="/register">
                Create account
              </Link>
              <Link className="button secondary" to="/login">
                Login
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
