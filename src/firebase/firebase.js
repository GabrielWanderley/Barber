import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBgmiIwXkPkMc2Q87aYQNxaywpGT4W-sLw",
  authDomain: "barber-89573.firebaseapp.com",
  projectId: "barber-89573",
  storageBucket: "barber-89573.appspot.com",
  messagingSenderId: "100323102445",
  appId: "1:100323102445:web:0ae0131184354e079086e4"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export {db}