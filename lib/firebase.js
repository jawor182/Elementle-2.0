import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let persistenceEnabled = false;

const enablePersistence = async () => {
  try {
    await enableIndexedDbPersistence(db, {
      forceOwnership: true // Prevents multiple tabs from interfering
    });
    persistenceEnabled = true;
    console.log("Firebase persistence enabled");
  } catch (err) {
    console.warn("Persistence error:", err.code, err.message);
    if (err.code === 'failed-precondition') {
      console.warn("Persistence already enabled in another tab");
    } else if (err.code === 'unimplemented') {
      console.warn("Browser doesn't support all persistence features");
    }
  }
};

// Enable with retry logic
const MAX_RETRIES = 3;
let retryCount = 0;

const enableWithRetry = () => {
  if (retryCount < MAX_RETRIES && !persistenceEnabled) {
    retryCount++;
    setTimeout(enablePersistence, 1000 * retryCount);
  }
};

enablePersistence().catch(enableWithRetry);

export { db, persistenceEnabled };
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
            ...doc.data(),
        });
    });
    const randomPierwiastek =
        pierwiastkiArr[Math.floor(Math.random() * pierwiastkiArr.length)];
    let pierwiastkiList = [];
    for (let i = 0; i < 5; i++) {
        let pierwiastek = pierwiastkiArr[Math.floor(Math.random() * pierwiastkiArr.length)];
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
        console.log(elementleData);
        return elementleData;
    } catch (error) {
        return console.error(error);
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
