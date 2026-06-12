import { NavLink, Navigate, Route, Routes } from "react-router-dom";

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
        <NavLink className="brand" to="/">
          Auth Scaffold
        </NavLink>
        <nav>
          <NavLink to="/">Home</NavLink>
          {user && <NavLink to="/dashboard">Dashboard</NavLink>}
          {user && <NavLink to="/profile">Profile</NavLink>}
          {!user && <NavLink to="/login">Login</NavLink>}
          {!user && <NavLink to="/register">Register</NavLink>}
          {user && (
            <button className="link-button" onClick={logout} type="button">
              Logout
            </button>
          )}
        </nav>
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
