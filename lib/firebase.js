import { initializeApp } from "firebase/app";
import pierwiastki from "@/data/pierwiastki";
import zdania from "@/data/zdania";
import reakcje from "@/data/reakcje";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

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
export async function testFunction() {
    const docRef = doc(db, "pierwiastki", "test");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        return docSnap.data();
    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
}
//async function populateDB(collectionName) {
//    const element = collectionName;
//    for (let i = 0; i < collectionName.length; i++) {
//        await setDoc(doc(db, collectionName, element[i].nazwa), {
//            nazwa: element[i].nazwa,
//            rodzaj: element[i].rodzaj,
//            masaAtomowa: element[i].masaAtomowa,
//            rokOdkrycia: element[i].rokOdkrycia,
//            okres: element[i].okres,
//            elektroujemnosc: element[i].elektroujemnosc,
//            wartosciowosc: element[i].wartosciowosc,
//        });
//    }
//}
//export async function populatePierwiaski(){
//    await populateDB(pierwiastki);
//}

// BUG: ta funckja nie ma sensu i zrobienie jej pod kazdy zestaw nie ma sensu  
async function populateDB(collectionName, elements) {
    for (let i = 0; i < elements.length; i++) {
        await setDoc(doc(db, collectionName, elements[i].nazwa), {
            nazwa: elements[i].nazwa,
            rodzaj: elements[i].rodzaj,
            masaAtomowa: elements[i].masaAtomowa,
            rokOdkrycia: elements[i].rokOdkrycia,
            okres: elements[i].okres,
            elektroujemnosc: elements[i].elektroujemnosc,
            wartosciowosc: elements[i].wartosciowosc,
        });
    }
}

export async function populatePierwiastki() {
    await populateDB("pierwiastki", pierwiastki);
}
