// C:\Users\Ujwal\Desktop\lumora-ai-companion\src\lib\firebase.js

// 1. Import the necessary functions from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// 2. Your web app's Firebase configuration
// BEST PRACTICE: Store these values in an .env.local file
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "lumora-3c148.firebaseapp.com",
  projectId: "lumora-3c148",
  storageBucket: "lumora-3c148.appspot.com", // Corrected storageBucket URL
  messagingSenderId: "808838475963",
  appId: "1:808838475963:web:9fdea845b280a12cf0f99e",
  measurementId: "G-WTZRP6GJDQ"
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 4. Initialize and export Firebase services for use in other files
export const auth = getAuth(app);
export const db = getFirestore(app);