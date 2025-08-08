import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB6VqRRzszy72LY3fbJywmaZIItfVMCjsw",
  authDomain: "sharesoocial.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);