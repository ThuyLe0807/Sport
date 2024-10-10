// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Cấu hình Firebase của bạn
const firebaseConfig = {
    apiKey: "AIzaSyBDUch53-UIcIKGPZqeJdZNbNAt3Lg-538",
    authDomain: "football-dc3c9.firebaseapp.com",
    projectId: "football-dc3c9",
    storageBucket: "football-dc3c9.appspot.com",
    messagingSenderId: "651667500159",
    appId: "1:651667500159:android:09c030ea42a796b29f234a"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Lấy đối tượng Firestore

export { db }; // Xuất đối tượng Firestore để sử dụng ở nơi khác
