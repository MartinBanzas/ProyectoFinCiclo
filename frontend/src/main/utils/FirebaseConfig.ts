// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyA8NqFhoDlr7bphmg8m73vJSslrUFzh4Bc",

  authDomain: "notas-trello.firebaseapp.com",

  projectId: "notas-trello",

  storageBucket: "notas-trello.appspot.com",

  messagingSenderId: "294785897603",

  appId: "1:294785897603:web:537ca94a772ff6144837b6"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const cardCollection = collection(db, "tarjetas");