import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyCktJSz3wihHafdZCB_65r_qHFJHpAnrhg",
  authDomain: "classroom-database-d5341.firebaseapp.com",
  databaseURL: "https://classroom-database-d5341-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "classroom-database-d5341",
  storageBucket: "classroom-database-d5341.firebasestorage.app",
  messagingSenderId: "183322396617",
  appId: "1:183322396617:web:c09faeb3d98dfad8178a18",
  measurementId: "G-H3DQ4GG1F5"
};

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export { app, db }
