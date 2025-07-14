import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serviceAccountKey.json を fs で読み込む
const serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const app = express();

// CORSミドルウェアは一番最初
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
}));

app.use(express.json());

// すべてのOPTIONSリクエストを即200で返す
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 認証ミドルウェア
async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch {
    res.sendStatus(403);
  }
}

// タスク一覧
app.get("/api/tasks", authenticateToken, async (req, res) => {
  const tasksRef = db.collection("tasks").where("uid", "==", req.user.uid);
  const snapshot = await tasksRef.get();
  const tasks = [];
  snapshot.forEach(doc => tasks.push({ id: doc.id, ...doc.data() }));
  res.json(tasks);
});

// タスク作成
app.post("/api/tasks", authenticateToken, async (req, res) => {
  const { title, detail, dueDate } = req.body;
  const newTask = {
    title,
    detail,
    dueDate,
    status: "未開始",
    uid: req.user.uid,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };
  const docRef = await db.collection("tasks").add(newTask);
  res.json({ id: docRef.id, ...newTask });
});

// タスク編集
app.put("/api/tasks/:id", authenticateToken, async (req, res) => {
  const { title, detail, dueDate, status } = req.body;
  const taskRef = db.collection("tasks").doc(req.params.id);
  await taskRef.update({ title, detail, dueDate, status });
  res.json({ id: req.params.id, title, detail, dueDate, status });
});

// タスク削除
app.delete("/api/tasks/:id", authenticateToken, async (req, res) => {
  await db.collection("tasks").doc(req.params.id).delete();
  res.json({ id: req.params.id });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
