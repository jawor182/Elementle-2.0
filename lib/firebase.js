import { initializeApp } from "firebase/app";
import { doc,getDoc, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apikey: process.env.apikey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const docRef = doc(db, "pierwiastki", "test");
const docSnap = await getDoc(docRef);
function fetchData() {
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
}

export default fetchData;
