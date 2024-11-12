// firebaseConfig.js
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDs3WI4bxuDHLtvL-vZV9eIcAmFLdF1dK0",
  authDomain: "sport-951d7.firebaseapp.com",
  projectId: "sport-951d7",
  storageBucket: "sport-951d7.appspot.com",
  messagingSenderId: "996197416431",
  appId: "1:996197416431:android:e2d9009ede25e0a03eca1a"
};

// Initialize Firebase only if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export Firestore instance for use elsewhere
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser, addDoc, getDocs, doc, updateDoc, deleteDoc };export { db };
