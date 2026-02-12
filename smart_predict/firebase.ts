
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Actual values from the provided Firebase Console screenshots
const firebaseConfig = {
  apiKey: "AIzaSyCgzZgrLXS2AMBhxXLGkdZqaYIrB5vBLSA",
  authDomain: "smartpredict-cbb71.firebaseapp.com",
  databaseURL: "https://smartpredict-cbb71-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smartpredict-cbb71",
  storageBucket: "smartpredict-cbb71.firebasestorage.app",
  messagingSenderId: "80513446032",
  appId: "1:80513446032:web:4ba8c0129ba4a16766e815",
  measurementId: "G-K5EH2K2G7B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
