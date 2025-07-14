import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import axios from "axios";

const API_URL = "http://localhost:5001/api";

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", detail: "", dueDate: "" });
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (e) {
      setTasks([]);
    }
    setLoading(false);
  };

  const handleAuth = async (email, password, isLogin) => {
    if (isLogin) {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      await createUserWithEmailAndPassword(auth, email, password);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await user.getIdToken();
    if (editingId) {
      await axios.put(`${API_URL}/tasks/${editingId}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } else {
      await axios.post(`${API_URL}/tasks`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    setForm({ title: "", detail: "", dueDate: "" });
    setEditingId(null);
    fetchTasks();
  };

  const handleDelete = async id => {
    const token = await user.getIdToken();
    await axios.delete(`${API_URL}/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleEdit = task => {
    setForm({ title: task.title, detail: task.detail, dueDate: task.dueDate });
    setEditingId(task.id);
  };

  const handleStatus = async (id, status) => {
    const token = await user.getIdToken();
    const task = tasks.find(t => t.id === id);
    await axios.put(`${API_URL}/tasks/${id}`, { ...task, status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === "all") return true;
    return t.status === filter;
  });

  if (!user) {
    let email, password;
    return (
      <div style={{ maxWidth: 400, margin: "40px auto" }}>
        <h2>ログイン / 新規登録</h2>
        <form onSubmit={e => {
          e.preventDefault();
          handleAuth(email.value, password.value, true);
        }}>
          <input placeholder="メール" ref={el => email = el} required />
          <input placeholder="パスワード" type="password" ref={el => password = el} required />
          <button type="submit">ログイン</button>
        </form>
        <form onSubmit={e => {
          e.preventDefault();
          handleAuth(email.value, password.value, false);
        }}>
          <button type="submit">新規登録</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Simple Task Manager</h2>
      <button onClick={() => signOut(auth)}>ログアウト</button>
      <button onClick={fetchTasks} style={{ marginLeft: 8 }}>再読み込み</button>
      <form onSubmit={handleSubmit} style={{ margin: "20px 0" }}>
        <input
          placeholder="タイトル"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          placeholder="詳細"
          value={form.detail}
          onChange={e => setForm({ ...form, detail: e.target.value })}
        />
        <input
          type="date"
          value={form.dueDate}
          onChange={e => setForm({ ...form, dueDate: e.target.value })}
          required
        />
        <button type="submit">{editingId ? "更新" : "作成"}</button>
      </form>
      <div>
        <label>フィルター: </label>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">全て</option>
          <option value="未開始">未開始</option>
          <option value="進行中">進行中</option>
          <option value="完了">完了</option>
        </select>
      </div>
      {loading ? <p>読み込み中...</p> : (
        <ul>
          {filteredTasks.map(task => (
            <li key={task.id}>
              <b>{task.title}</b>（{task.status}） 期限: {task.dueDate}
              <button onClick={() => handleEdit(task)}>編集</button>
              <button onClick={() => handleDelete(task.id)}>削除</button>
              <select
                value={task.status}
                onChange={e => handleStatus(task.id, e.target.value)}
              >
                <option value="未開始">未開始</option>
                <option value="進行中">進行中</option>
                <option value="完了">完了</option>
              </select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
