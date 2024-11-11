// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyBNwlnhDQ4xkRNRm3j19EioglKrcPz_gPY',
    authDomain: 'react-next-shop-de0c9.firebaseapp.com',
    projectId: 'react-next-shop-de0c9',
    storageBucket: 'react-next-shop-de0c9.appspot.com',
    messagingSenderId: '954243536569',
    appId: '1:954243536569:web:4ab831f836b96d8b90ad68',
    measurementId: 'G-8PSWHZZJF6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// 객체 생성
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
