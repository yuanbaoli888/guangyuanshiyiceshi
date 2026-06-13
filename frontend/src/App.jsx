import { Link, Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "./shared/useAuth.js";
import Dashboard from "./pages/Dashboard.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) {
    return <main className="page">Loading...</main>;
  }
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand anytry-brand" to="/">
          <span className="brand-mark">光</span>
          <span>光源TryOn</span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#guide">使用指南</a>
          <a href="#faq">常见问题</a>
          <a className="active" href="#try-on">
            试穿
          </a>
          <a href="#pricing">定价</a>
        </nav>
        <div className="topbar-actions">
          <button className="language-pill" type="button" aria-label="切换语言">
            <span className="language-icon">文</span>
            <span>
              中文
              <small>简体中文</small>
            </span>
            <span aria-hidden="true">⌄</span>
          </button>
          {user ? (
            <>
              <Link className="dashboard-link" to="/dashboard">
                控制台
              </Link>
              <button className="login-pill" onClick={logout} type="button">
                退出
              </button>
            </>
          ) : (
            <Link className="login-pill" to="/login">
              <span aria-hidden="true">↪</span>
              登录
            </Link>
          )}
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
