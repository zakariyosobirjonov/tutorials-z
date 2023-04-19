import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBPpgSe6VQVGVuzXInV8U8w3mm2UgxNhXk",
  authDomain: "firechat-1d7eb.firebaseapp.com",
  projectId: "firechat-1d7eb",
  storageBucket: "firechat-1d7eb.appspot.com",
  messagingSenderId: "45485522636",
  appId: "1:45485522636:web:9c934ed2e5069bc32c4c69"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)