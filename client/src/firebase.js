// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-47.firebaseapp.com",
  projectId: "mern-estate-47",
  storageBucket: "mern-estate-47.appspot.com",
  messagingSenderId: "591094035173",
  appId: "1:591094035173:web:66f79dabd1747275491a0c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);