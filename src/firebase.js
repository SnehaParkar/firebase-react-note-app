// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBMIs8OIe4FDtgS1TZaF9ya2aPCevyfRN4",
	authDomain: "react-firebase-notes-dae65.firebaseapp.com",
	projectId: "react-firebase-notes-dae65",
	storageBucket: "react-firebase-notes-dae65.appspot.com",
	messagingSenderId: "746850927874",
	appId: "1:746850927874:web:fcd6c48d5af9c7a58c6e1b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")

