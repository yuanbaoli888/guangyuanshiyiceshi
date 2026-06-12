import { useEffect, useState } from "react";

import { apiRequest } from "../shared/api.js";
import { useAuth } from "../shared/useAuth.js";

export default function Dashboard() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/users", { token })
      .then(setUsers)
      .catch((err) => setError(err.message));
  }, [token]);

  return (
    <main className="page">
      <section className="panel">
        <p className="eyebrow">Dashboard</p>
        <h1>Welcome, {user?.username}</h1>
        <p className="lead">这里是受保护路由示例，会使用 JWT 调用后端用户列表接口。</p>
      </section>

      <section className="panel">
        <h2>Users</h2>
        {error && <p className="error">{error}</p>}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.username}</td>
                  <td>{item.email}</td>
                  <td>{new Date(item.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
