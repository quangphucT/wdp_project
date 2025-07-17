// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCi1w7Mn3GJbl9hj6cPD0AS6DDbZ6Q9YJY",
  authDomain: "movie-management-93078.firebaseapp.com",
  projectId: "movie-management-93078",
  storageBucket: "movie-management-93078.appspot.com",
  messagingSenderId: "317599319414",
  appId: "1:317599319414:web:17c2f53ba22ad60c42e657",
  measurementId: "G-7M5GHZJD0F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)
export { storage };
