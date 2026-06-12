import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../shared/useAuth.js";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username_or_email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label>
          Username or email
          <input
            name="username_or_email"
            value={form.username_or_email}
            onChange={updateField}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={updateField}
            autoComplete="current-password"
            minLength={8}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="button primary" disabled={submitting} type="submit">
          {submitting ? "Signing in..." : "Sign in"}
        </button>
        <p className="muted">
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </main>
  );
}
