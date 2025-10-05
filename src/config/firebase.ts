import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyASNIrcirWeb1qPYVpNQUAUsnjp99WQkLY",
  authDomain: "full-stack-app-94ca1.firebaseapp.com",
  projectId: "full-stack-app-94ca1",
  storageBucket: "full-stack-app-94ca1.firebasestorage.app",
  messagingSenderId: "249646422313",
  appId: "1:249646422313:web:a5232d36f88643a31dbf38"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
