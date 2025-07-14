import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB2hzolhRJ_9P6CYHwNj5boDXNzkbGTP64",
  authDomain: "simple-task-manager-3df2f.firebaseapp.com",
  projectId: "simple-task-manager-3df2f",
  storageBucket: "simple-task-manager-3df2f.appspot.com", // ←ここ修正
  messagingSenderId: "704447359212",
  appId: "1:704447359212:web:600df963e9cf5fdbae1dc9",
  measurementId: "G-ZD7KP5XJS1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
