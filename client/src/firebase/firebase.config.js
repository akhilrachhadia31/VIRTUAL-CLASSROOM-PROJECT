import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBWv1-yTPun2cnfjvtY84KAE73vao6S1w0",
  authDomain: "flixify-2a99b.firebaseapp.com",
  projectId: "flixify-2a99b",
  storageBucket: "flixify-2a99b.appspot.com",
  messagingSenderId: "805289486943",
  appId: "1:805289486943:web:082c79c7f6c934508089ea",
  measurementId: "G-B13DXPC28Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };