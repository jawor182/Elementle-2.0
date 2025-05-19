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
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
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
export async function getDailyAnswers() {
    const pierwiastki = query(collection(db, "pierwiastki"));
    const pierwiastkiData = await getDocs(pierwiastki);
    let pierwiastkiArr = [];
    pierwiastkiData.forEach((doc) => {
        pierwiastkiArr.push({
            id: doc.id,
            ...doc.data(),
        });
    });
    const randomPierwiastek =
        pierwiastkiArr[Math.floor(Math.random() * pierwiastkiArr.length)];
    let pierwiastkiList = [];
    for (let i = 0; i < 5; i++) {
        let pierwiastek =
            pierwiastkiArr[Math.floor(Math.random() * pierwiastkiArr.length)];
        pierwiastkiList.push(pierwiastek);
    }
    const zdania = query(collection(db, "zdania"));
    const zdaniaData = await getDocs(zdania);
    let zdaniaArr = [];
    zdaniaData.forEach((doc) => {
        zdaniaArr.push({
            id: doc.id,
            ...doc.data(),
        });
    });
    const randomZdanie = zdaniaArr[Math.floor(Math.random() * zdaniaArr.length)];
    const reakcje = query(collection(db, "reakcje"));
    const reakcjeData = await getDocs(reakcje);
    let reakcjeArr = [];
    reakcjeData.forEach((doc) => {
        reakcjeArr.push({
            id: doc.id,
            ...doc.data(),
        });
    });
    const randomReakcja =
        reakcjeArr[Math.floor(Math.random() * reakcjeArr.length)];
    const date = new Date().toISOString().split("T")[0];
    let dailyAnswers = {
        pierwiastek: randomPierwiastek,
        pierwiastki: pierwiastkiList,
        reakcja: randomReakcja,
        zdanie: randomZdanie,
        data: date,
    };
    await setDoc(doc(db, "elementle", dailyAnswers.data), {
        data: dailyAnswers.data,
        reakcja: dailyAnswers.reakcja,
        zdanie: dailyAnswers.zdanie,
        pierwiastek: dailyAnswers.pierwiastek,
        pierwiastki: dailyAnswers.pierwiastki,
    });
}
export async function fetchElementle() {
    const date = new Date().toISOString().split("T")[0];
    try {
        const elementleDoc = await getDoc(doc(db, "elementle", date));
        if (elementleDoc.data() === undefined) {
            throw Response.error("Nie ma danych \n Spróbuj ponownie");
        }
        const elementleData = elementleDoc.data();
        return elementleData;
    } catch (error) {
        return console.error(error);
    }
}
export async function fetchUzupelnianie() {
    const date = new Date().toISOString().split("T")[0]; // Pobieramy dzisiejszą datę
    try {
        const docRef = doc(db, "elementle", date); // Pobieramy dokument dla dzisiejszego dnia
        const elementleDoc = await getDoc(docRef);
        
        if (!elementleDoc.exists()) {
            throw new Error("Brak reakcji na dzisiaj w kolekcji 'elementle'.");
        }
        
        const data = elementleDoc.data();
        
        // Oczekujemy, że reakcja będzie w polu 'reakcja' w tym dokumencie
        const randomBlock =  "reagenty";
        const correctAnswer = data.reakcja[randomBlock].join(" + ");
        
        const maskedReaction = {
            ...data.reakcja,
            [randomBlock]: ["?"],
            targetBlock: randomBlock,
            correctAnswer
        };
        
        return maskedReaction;
    } catch (error) {
        console.error("Błąd ładowania reakcji:", error);
        throw error;
    }
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
