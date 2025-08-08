import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB6VqRRzszy72LY3fbJywmaZIItfVMCjsw",
  authDomain: "sharesoocial.firebaseapp.com",
  projectId: "sharesoocial",
  storageBucket: "sharesoocial.firebasestorage.app",
  messagingSenderId: "206574095054",
  appId: "1:206574095054:web:bbe951e376753d4ca85e9f",
  measurementId: "G-995MPQSXW7"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);