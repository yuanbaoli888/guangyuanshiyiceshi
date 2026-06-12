import { useEffect, useState } from "react";

import { apiRequest } from "../shared/api.js";
import { useAuth } from "../shared/useAuth.js";

export default function Profile() {
  const { token, user, refreshMe } = useAuth();
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm((current) => ({
        ...current,
        username: user.username,
        email: user.email,
      }));
    }
  }, [user]);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    const payload = {
      username: form.username,
      email: form.email,
      ...(form.password ? { password: form.password } : {}),
    };

    try {
      await apiRequest(`/users/${user.id}`, {
        method: "PUT",
        token,
        body: JSON.stringify(payload),
      });
      await refreshMe(token);
      setForm((current) => ({ ...current, password: "" }));
      setMessage("Profile updated");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="page auth-page">
      <form className="auth-card wide" onSubmit={handleSubmit}>
        <h1>Profile</h1>
        <label>
          Username
          <input name="username" value={form.username} onChange={updateField} minLength={3} required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={updateField} required />
        </label>
        <label>
          New password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={updateField}
            minLength={8}
            placeholder="Leave blank to keep current password"
          />
        </label>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <button className="button primary" type="submit">
          Save changes
        </button>
      </form>
    </main>
  );
}
