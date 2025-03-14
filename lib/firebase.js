import { initializeApp } from "firebase/app";
import pierwiastki from "@/data/pierwiastki";
import zdania from "@/data/zdania";
import reakcje from "@/data/reakcje";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    query,
    setDoc,
} from "firebase/firestore";

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
async function populateDBZdania() {
    for (let i = 0; i < zdania.length; i++) {
        await setDoc(doc(db, "zdania", i.toString()), {
            zdanie: zdania[i].zdanie,
            odpowiedzi: zdania[i].odpowiedz,
        });
    }
}
async function populateDBReakcje() {
    for (let i = 0; i < reakcje.length; i++) {
        await setDoc(doc(db, "reakcje", reakcje[i].nazwa), {
            nazwa: reakcje[i].nazwa,
            reagenty: reakcje[i].reagenty,
            produkty: reakcje[i].produkty,
        });
    }
}
// TODO: Dorobic zabieranie danych z reszty baz a potem wsadzanie tego do kolekcji odpowiedzi
export async function getDailyAnswers() {
    const pierwiastki = query(collection(db, "pierwiastki"));
    const pierwiastkiData = await getDocs(pierwiastki);
    let pierwiastkiArr = [];
    pierwiastkiData.forEach((doc) => {
        pierwiastkiArr.push({
            id: doc.id,
            ...doc.data()
        });
    });
    const randomPierwiastek = pierwiastkiArr[Math.floor(Math.random() * pierwiastkiArr.length)];
    const date = new Date().toISOString().split("T")[0];
    return date;

}
export async function populatePierwiastki() {
    await populateDB("pierwiastki", pierwiastki);
}
export async function populateZdania() {
    await populateDBZdania();
}
export async function populateReakcje() {
    await populateDBReakcje();
}

