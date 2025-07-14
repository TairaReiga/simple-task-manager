/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Gmail認証情報（ご自身の情報に書き換えてください）
const GMAIL_USER = "berserk20041016@gmail.com";
const GMAIL_PASS = "zexj uskq ztno nioo";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

// Firestoreのtasksコレクションに新しいタスクが追加されたときにメール送信（v2記法）
exports.sendTaskNotification = onDocumentCreated("tasks/{taskId}", async (event) => {
  const task = event.data.data();

  const mailOptions = {
    from: GMAIL_USER,
    to: "20123026@kaishi-pu.ac.jp", // ←ここを自分のメールアドレスなどに変更
    subject: `新しいタスク: ${task.title}`,
    text:
      "タスク内容: " +
      task.detail +
      "\n" +
      "期限: " +
      task.dueDate,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("メール送信成功");
  } catch (error) {
    console.error("メール送信失敗:", error);
  }
});

setGlobalOptions({maxInstances: 10});
