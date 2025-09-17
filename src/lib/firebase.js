// C:\Users\Ujwal\Desktop\lumora-ai-companion\src\lib\firebase.js

// 1. Import the necessary functions from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 2. Your web app's Firebase configuration
// BEST PRACTICE: Store these values in an .env.local file
const firebaseConfig = {
  apiKey: "AIzaSyBuQmN4kw3PfX8K2yEvMv_Z01ocKb8Z3wI",
  authDomain: "lumora-3c148.firebaseapp.com",
  projectId: "lumora-3c148",
  storageBucket: "lumora-3c148.appspot.com", // 🔥 corrected: ".app" → ".appspot.com"
  messagingSenderId: "808838475963",
  appId: "1:808838475963:web:be9d024906957b5bf0f99e",
  measurementId: "G-PR96JPT7MM"
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 4. Initialize and export Firebase services for use in other files
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
