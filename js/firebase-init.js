// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAaO9gZZCL7FkHGJGTQ0qcuMxZnE6IyM_I",
  authDomain: "myanez-7c9cb.firebaseapp.com",
  projectId: "myanez-7c9cb",
  storageBucket: "myanez-7c9cb.firebasestorage.app",
  messagingSenderId: "1098565093028",
  appId: "1:1098565093028:web:65543e617c71c745200831"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { onAuthStateChanged, signInAnonymously, collection, doc, setDoc, getDocs };