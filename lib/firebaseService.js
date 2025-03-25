import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Enhanced with multiple fallback strategies
export async function fetchElementle() {
  const date = new Date().toISOString().split("T")[0];
  
  // Strategy 1: Try Firestore with timeout
  try {
    const firestoreData = await fetchWithTimeout(
      () => getDoc(doc(db, "elementle", date)),
      3000 // 3 second timeout
    );
    
    if (firestoreData.exists()) {
      return formatData(firestoreData.data());
    }
  } catch (firestoreError) {
    console.warn("Firestore failed:", firestoreError);
  }

  // Strategy 2: Check localStorage cache
  try {
    const cachedData = getCache(date);
    if (cachedData) {
      console.log("Using cached data from localStorage");
      return cachedData;
    }
  } catch (cacheError) {
    console.warn("Cache read failed:", cacheError);
  }

  // Strategy 3: Fallback to hardcoded data
  const fallbackData = getFallbackData(date);
  if (fallbackData) {
    console.warn("Using fallback data");
    return fallbackData;
  }

  throw new Error("All data sources failed - please check your connection");
}

// Corrected fetchWithTimeout function
function fetchWithTimeout(fetchFn, timeout) {
    return Promise.race([
      fetchFn(),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), timeout);
      })
    ]);
  }

// Cache management
function getCache(date) {
  const cache = localStorage.getItem(`elementle_cache`);
  if (!cache) return null;
  
  const { data, timestamp } = JSON.parse(cache);
  const cacheAge = Date.now() - timestamp;
  
  // Only use cache if less than 24 hours old
  return cacheAge < 86400000 ? data : null;
}

// Hardcoded fallback data
function getFallbackData(date) {
  const fallbackElements = {
    "2025-03-25": {
      pierwiastek: {
        nazwa: "wodor",
        rodzaj: "niemetal",
        masaAtomowa: 1.008,
        rokOdkrycia: 1766,
        elektroujemnosc: 2.20,
        okres: 1,
        wartosciowosc: 1
      }
    }
    // Add more dates as needed
  };
  
  return fallbackElements[date] || null;
}

function formatData(data) {
  // Save to cache
  localStorage.setItem(`elementle_cache`, JSON.stringify({
    data,
    timestamp: Date.now()
  }));
  
  return {
    ...data,
    pierwiastek: {
      nazwa: data.pierwiastek?.nazwa || '?',
      // ... other fields
    }
  };
}