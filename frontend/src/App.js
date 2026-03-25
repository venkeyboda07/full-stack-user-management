import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

/* API configuration */
const API = process.env.REACT_APP_API || "http://localhost:5000";

function App() {

  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  /* =========================
     Fetch Users
  ========================== */
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`api/users`);
      setUsers(res.data);
    } catch (err) {
      setMessage("Backend connection failed");
      console.error(err);
    }
  };

  /* =========================
     Add User
  ========================== */
  const addUser = async () => {
    if (!name || !email) {
      setMessage("Please enter all fields");
      return;
    }

    try {
      await axios.post(`api/users`, { name, email });
      setMessage("User added successfully");
      setName("");
      setEmail("");
      fetchUsers();
    } catch (err) {
      setMessage("Insert failed");
      console.error(err);
    }

    setTimeout(() => setMessage(""), 2000);
  };

  /* =========================
     Delete User
  ========================== */
  const deleteUser = async (id) => {
  try {
    await axios.delete(`/api/users/${id}`); // relative URL
    setMessage("User deleted");
    fetchUsers();
  } catch {
    setMessage("Delete failed");
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="page">
      <div className="card">
        <h1>User Management</h1>
        <p className="subtitle">Production Ready React UI</p>

        {message && <div className="alert">{message}</div>}

        <div className="form">
          <input
            value={name}
            placeholder="Enter name"
            onChange={e => setName(e.target.value)}
          />
          <input
            value={email}
            placeholder="Enter email"
            onChange={e => setEmail(e.target.value)}
          />
          <button className="addBtn" onClick={addUser}>
            Add User
          </button>
        </div>

        <div className="users">
          <h3>Users</h3>
          {users.length === 0 && <p className="empty">No users added</p>}

          {users.map(u => (
            <div className="userCard" key={u.id}>
              <div>
                <div className="userName">{u.name}</div>
                <div className="userEmail">{u.email}</div>
              </div>
              <button className="deleteBtn" onClick={() => deleteUser(u.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
