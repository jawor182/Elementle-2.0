export const saveToCache = (key, data) => {
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.error("Failed to save to cache:", e);
    }
  };
  
  export const getFromCache = (key, maxAgeHours = 24) => {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      const ageHours = (Date.now() - timestamp) / (1000 * 60 * 60);
      
      return ageHours < maxAgeHours ? data : null;
    } catch (e) {
      console.error("Failed to read from cache:", e);
      return null;
    }
  };
  
  export const clearOldCache = (maxAgeHours = 72) => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('cache_')) {
        try {
          const { timestamp } = JSON.parse(localStorage.getItem(key));
          const ageHours = (Date.now() - timestamp) / (1000 * 60 * 60);
          if (ageHours > maxAgeHours) {
            localStorage.removeItem(key);
          }
        } catch (e) {
          console.error("Failed to clear cache item:", key, e);
        }
      }
    });
  };