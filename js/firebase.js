import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBRJMAH8lCYBkPlciyLNO7rDCFlCJF5Wrk",
    authDomain: "parentyx-91391.firebaseapp.com",
    projectId: "parentyx-91391",
    storageBucket: "parentyx-91391.firebasestorage.app",
    messagingSenderId: "657311068659",
    appId: "1:657311068659:web:73dcda8057c24a02b46286",
    measurementId: "G-2TTMLQKB85"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
