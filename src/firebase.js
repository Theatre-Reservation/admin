// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDI28tyVOLxU8s5dpUKZLPLnb5FMDwcles",
  authDomain: "theatre-reservation-syst-64103.firebaseapp.com",
  projectId: "theatre-reservation-syst-64103",
  storageBucket: "theatre-reservation-syst-64103.appspot.com",
  messagingSenderId: "273998990157",
  appId: "1:273998990157:web:299bf2ce0b83b0d3f80504",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
