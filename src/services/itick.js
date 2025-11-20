import axios from 'axios';

const TOKEN = 'EA71D01C-CC2B-4C0E-8781-B7CB8FCAECDA';

// Create axios instance with base URL pointing to the proxy
const api = axios.create({
  baseURL: '/api', // Uses the proxy defined in vite.config.js
  timeout: 10000,
  // Zhitu API typically passes token in query params, but we can keep common headers if needed
  headers: {
    'accept': 'application/json'
  }
});

/**
 * Fetch Weekly K-Line Data using Zhitu API
 * @param {string} code - Stock code (e.g., '159338.SZ')
 */
export const fetchWeeklyKLine = async (code = '159338.SZ') => {
  try {
    const period = 'w';
    const adjust = 'f'; // f: 前复权
    const limit = 5; // Limit for realtime data

    // Calculate dates for history (6 months ago)
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    // Calculate end time for history: 5 weeks ago (to avoid overlap with realtime data)
    const fiveWeeksAgo = new Date();
    fiveWeeksAgo.setDate(now.getDate() - 35); // 5 weeks * 7 days
    
    // Format dates as YYYYMMDD
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };

    const et = formatDate(fiveWeeksAgo);
    const st = formatDate(sixMonthsAgo);

    // Fetch Realtime Data (Latest 5)
    const realtimePromise = api.get(`/hs/latest/${code}/${period}/${adjust}`, {
      params: { token: TOKEN, limit: limit }
    });

    // Fetch Historical Data (6 Months)
    // API: https://api.zhituapi.com/hs/history/code/period/adjust?token=...&st=...&et=...
    const historyPromise = api.get(`/hs/history/${code}/${period}/${adjust}`, {
      params: { 
        token: TOKEN, 
        st: st,
        et: et
      }
    });

    const [realtimeRes, historyRes] = await Promise.all([realtimePromise, historyPromise]);
    
    let mergedData = [];

    // Process History Data
    if (historyRes.data) {
      const historyData = Array.isArray(historyRes.data) ? historyRes.data : (historyRes.data.data || []);
      mergedData = [...historyData];
    }

    // Process Realtime Data and Merge
    if (realtimeRes.data) {
      const realtimeData = Array.isArray(realtimeRes.data) ? realtimeRes.data : (realtimeRes.data.data || []);
      
      // Helper to normalize date key for deduplication
      const getNormalizedKey = (item) => {
         // Get the raw date value (assuming index 0 for array, or specific fields for object)
         let val = Array.isArray(item) ? item[0] : (item.t || item.date || item.time);
         if (!val) return null;
         
         // Convert to string to ensure type consistency (Number 20240101 vs String "20240101")
         let strVal = String(val);
         
         // Normalize "YYYY-MM-DD" to "YYYYMMDD"
         if (strVal.includes('-')) {
             strVal = strVal.replace(/-/g, '');
         }
         
         // If it's a standard timestamp (seconds/ms), we might want to convert to YYYYMMDD 
         // But for now, assume API consistency or YYYYMMDD format for Weekly data.
         // If mixing timestamp and YYYYMMDD, more complex conversion is needed.
         
         return strVal;
      };

      const dataMap = new Map();
      
      // Add history first
      mergedData.forEach(item => {
        const key = getNormalizedKey(item);
        if (key) dataMap.set(key, item);
      });

      // Add/Overwrite with realtime (latest data usually more accurate for current candle)
      realtimeData.forEach(item => {
        const key = getNormalizedKey(item);
        if (key) dataMap.set(key, item);
      });

      // Convert back to array and sort
      mergedData = Array.from(dataMap.values());
      
      // Sort by date
      mergedData.sort((a, b) => {
        const dateA = getNormalizedKey(a);
        const dateB = getNormalizedKey(b);
        // Simple string comparison works for YYYYMMDD
        return dateA.localeCompare(dateB);
      });
    }

    return mergedData;
    
  } catch (error) {
    console.error('Error fetching weekly data from Zhitu API:', error);
    throw error;
  }
};
