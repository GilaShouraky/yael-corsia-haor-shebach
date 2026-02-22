// src/hooks/useGoogleSheets.js
// Custom hooks to fetch data from Google Sheets

import { useState, useEffect } from 'react';
import { Sparkles, Heart, BookOpen } from 'lucide-react';

// Configuration
const SHEET_ID = '11UmnFDavMPDEhdxU6YezkgMPVC1pdaFeRyqmwtbyFTU'; // 👈 שימי את ה-ID שלך כאן!
const API_KEY = 'AIzaSyD8k_6ppvnFEVDN_o9DCe7AAfeK1p2H2Rw'; // Public API key - safe to expose

// Sheet names (tabs)
const SHEETS = {
  PRODUCTS: 'מוצרים',
  TEXTS: 'טקסטים',
  BUNDLES: 'חבילות',
  PICKUP_POINTS: 'נקודות_איסוף',
  LESSONS: 'שיעורים',      // ← הוסיפי!
  EVENTS: 'אירועים'        // ← הוסיפי!
};

// Helper function to parse JSON safely
const parseJSON = (str) => {
  if (!str || str.trim() === '') return [];
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error('Failed to parse JSON:', str, e);
    return [];
  }
};

// Helper function to convert boolean strings
const parseBoolean = (str) => {
  if (typeof str === 'boolean') return str;
  return str === 'כן' || str === 'true' || str === 'TRUE';
};

// Fetch data from a specific sheet
const fetchSheet = async (sheetName) => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error(`Error fetching ${sheetName}:`, error);
    return [];
  }
};

// Convert rows to objects based on headers
const rowsToObjects = (rows) => {
  if (rows.length === 0) return [];
  const headers = rows[0];
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });
};

// Hook to fetch products
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const rows = await fetchSheet(SHEETS.PRODUCTS);
        const productsData = rowsToObjects(rows);

        const transformedProducts = productsData
          .filter(p => parseBoolean(p.פעיל)) // Only active products
          .map((p, index) => ({
            id: parseInt(p.id) || index + 1,
            name: p.שם_המוצר,
            shortDescription: p.תיאור_קצר,
            fullDescription: p.תיאור_מלא,
            aboutBook: p.אודות_הספר || '',
            price: parseFloat(p.מחיר) || 0,
            salePrice: parseFloat(p.מחיר_מבצע) || null,
            bulkPrice: parseFloat(p.מחיר_כמות) || null,
            bulkMinimum: parseInt(p.כמות_מינימום) || null,
            bulkMaxBeforePopup: 50,
            image: p.תמונה || p.תמונה_ראשית || '✨',
            link: p.קישור_למוצר || '',
            comingSoon: parseBoolean(p.בקרוב),
            whatsInside: parseJSON(p.מה_בערכה),
            forWho: parseJSON(p.למי_מתאים),
            howToUse: p.איך_זה_עובד || '',
            reviews: parseJSON(p.המלצות),
            gallery: parseJSON(p.גלריה) || [],
            icon: getIconForProduct(p.שם_המוצר)
          }));

        setProducts(transformedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

// Hook to fetch texts
export const useTexts = () => {
  const [texts, setTexts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTexts = async () => {
      try {
        setLoading(true);
        const rows = await fetchSheet(SHEETS.TEXTS);

        // Convert to key-value object
        const textsObj = {};
        rows.slice(1).forEach(row => {
          if (row[0] && row[1]) {
            textsObj[row[0]] = row[1];
          }
        });

        setTexts(textsObj);
        setError(null);
      } catch (err) {
        console.error('Error fetching texts:', err);
        setError(err.message);
        setTexts({});
      } finally {
        setLoading(false);
      }
    };

    fetchTexts();
  }, []);

  return { texts, loading, error };
};

// Hook to fetch bundles
export const useBundles = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        setLoading(true);
        const rows = await fetchSheet(SHEETS.BUNDLES);
        const bundlesData = rowsToObjects(rows);

        const transformedBundles = bundlesData.map(b => ({
          id: b.id,
          name: b.שם,
          description: b.תיאור,
          items: parseJSON(b.פריטים),
          originalPrice: parseFloat(b.מחיר_מקורי) || 0,
          price: parseFloat(b.מחיר_מבצע) || 0,
          savings: parseFloat(b.חיסכון) || 0,
          recommended: parseBoolean(b.מומלץ),
          image: '🎁'
        }));

        setBundles(transformedBundles);
        setError(null);
      } catch (err) {
        console.error('Error fetching bundles:', err);
        setError(err.message);
        setBundles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBundles();
  }, []);

  return { bundles, loading, error };
};

// Hook to fetch pickup points
export const usePickupPoints = () => {
  const [pickupPoints, setPickupPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPickupPoints = async () => {
      try {
        setLoading(true);
        const rows = await fetchSheet(SHEETS.PICKUP_POINTS);
        const pointsData = rowsToObjects(rows);

        // Group by area
        const grouped = {};
        pointsData.forEach(p => {
          const area = p.אזור;
          if (!grouped[area]) {
            grouped[area] = [];
          }
          grouped[area].push({
            city: p.עיר,
            address: p.כתובת || '',
            contact: p.איש_קשר,
            phone: p.טלפון
          });
        });

        // Convert to array format
        const points = Object.keys(grouped).map(area => ({
          area,
          locations: grouped[area]
        }));

        setPickupPoints(points);
        setError(null);
      } catch (err) {
        console.error('Error fetching pickup points:', err);
        setError(err.message);
        setPickupPoints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPickupPoints();
  }, []);

  return { pickupPoints, loading, error };
};


// Helper function to map product names to icons
const getIconForProduct = (productName) => {
  if (productName?.includes('קלפ')) return Sparkles;
  if (productName?.includes('מחברת')) return Heart;
  if (productName?.includes('בובי')) return BookOpen;
  if (productName?.includes('מנוי')) return Sparkles;
  return Sparkles;
};

// Hook to fetch lessons
export const useLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const rows = await fetchSheet(SHEETS.LESSONS);
        const lessonsData = rowsToObjects(rows);

        const transformedLessons = lessonsData.map((l, index) => {
          console.log('Lesson data:', l);
          return {
          id: parseInt(l.id) || index + 1,
          title: l.כותרת || l.שם || '',
          youtubeUrl: l.קישור_יוטיוב || l.קישור || l.url || '',
          thumbnail: l.תמונה || null,
        }});

        setLessons(transformedLessons);
        setError(null);
      } catch (err) {
        console.error('Error loading lessons:', err);
        setError(err.message);
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  return { lessons, loading, error };
};

// Hook to fetch events
export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const rows = await fetchSheet(SHEETS.EVENTS);
        const eventsData = rowsToObjects(rows);

        const transformedEvents = eventsData.map(e => ({
          id: parseInt(e.id),
          title: e.שם_האירוע,
          date: e.תאריך,
          location: e.מיקום,
          description: e.תיאור
        }));

        setEvents(transformedEvents);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
};

// Export configuration for direct access if needed
export const GOOGLE_SHEETS_CONFIG = {
  SHEET_ID,
  SHEETS
};
