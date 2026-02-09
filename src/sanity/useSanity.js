import { useState, useEffect } from 'react';
import { getProducts, getSiteSettings } from './sanityClient';
import { Sparkles, Heart, BookOpen } from 'lucide-react';

// Custom hook to fetch products from Sanity
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        
        // Transform Sanity data to match your existing product structure
        const transformedProducts = data.map((product, index) => ({
          id: index + 1,
          name: product.name,
          shortDescription: product.shortDescription,
          fullDescription: product.fullDescription,
          aboutBook: product.aboutBook,
          price: product.price,
          salePrice: product.salePrice,
          bulkPrice: product.bulkPrice,
          bulkMinimum: product.bulkMinimum,
          bulkMaxBeforePopup: 50, // Keep this hardcoded
          comingSoon: product.comingSoon,
          image: product.mainImage || '✨', // Fallback to emoji if no image
          gallery: product.gallery || [],
          reviews: product.reviews || [],
          whatsInside: product.whatsInside,
          forWho: product.forWho,
          howToUse: product.howToUse,
          link: product.link,
          icon: getIconForProduct(product.name)
        }));
        
        setProducts(transformedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        // Return empty array on error, so fallback can be used
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
}

// Custom hook to fetch site settings
export function useSiteSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const data = await getSiteSettings();
        setSettings(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError(err.message);
        setSettings(null);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  return { settings, loading, error };
}

// Helper function to map product names to icons
function getIconForProduct(productName) {
  if (productName.includes('קלפ')) return Sparkles;
  if (productName.includes('מחברת')) return Heart;
  if (productName.includes('בובי')) return BookOpen;
  if (productName.includes('מנוי')) return Sparkles;
  return Sparkles;
}

// Hardcoded bundles (not in Sanity yet - you can add later if needed)
export const bundles = [
  {
    id: 'bundle1',
    name: 'חבילת קלפים + מחברת',
    description: 'קלפי מסע החיים + מחברת פשוט להודות',
    items: ['קלפי מסע החיים', 'מחברת פשוט להודות'],
    originalPrice: 215,
    price: 200,
    savings: 15,
    image: '🎁'
  },
  {
    id: 'bundle2',
    name: 'ערכה מלאה',
    description: 'קלפי מסע החיים + מחברת פשוט להודות + ספר בובי ואני',
    items: ['קלפי מסע החיים', 'מחברת פשוט להודות', 'ספר בובי ואני'],
    originalPrice: 283,
    price: 250,
    savings: 33,
    image: '🌟',
    recommended: true
  }
];

// Hardcoded pickup points (these can stay hardcoded or move to Sanity later)
export const pickupPoints = [
  {
    area: 'מרכז', locations: [
      { city: 'פתח תקוה', address: 'רח׳ דגל ראובן 27', contact: 'חגית גרינברג', phone: '058-6253893' },
      { city: 'רמת גן', address: 'מבצע עין 9', contact: 'אורטל', phone: '054-6588503' },
      { city: 'תל אביב', address: 'רח׳ נתן ילין מור', contact: 'יהודה', phone: '055-6631648' },
      { city: 'ראשון לציון / בת ים', address: 'רח׳ שושנה דמרי', contact: 'הודיה', phone: '054-6588573' },
      { city: 'רחובות', address: 'מלצר 1', contact: 'מיכל עוקשי', phone: '052-6661033' },
      { city: 'רעננה', address: 'הפנינה 6 (ימי ב׳ ו-ד׳)', contact: 'מוריה', phone: '054-6979143' },
      { city: 'נתניה', address: 'רח׳ שבח 3', contact: 'פרלה', phone: '053-5269028' },
      { city: 'חדרה', address: '', contact: 'צליל שבת', phone: '054-5315136' },
      { city: 'חריש', address: '', contact: 'הילה לנגה', phone: '050-3199460' },
    ]
  },
  {
    area: 'ירושלים והסביבה', locations: [
      { city: 'ירושלים - קרית משה', address: '', contact: 'בריינה', phone: '054-7984328' },
      { city: 'בית אל', address: '', contact: 'גיתית כורסיה', phone: '054-3370180' },
      { city: 'נוף אילון', address: '', contact: 'משפחת כורסיה', phone: '054-5971840' },
      { city: 'נריה', address: '', contact: 'אורטל', phone: '054-6588503' },
      { city: 'בית שמש (מרכז ביג, מושב זכריה)', address: '', contact: 'דלית', phone: '054-4535140' },
      { city: 'מודיעין', address: 'אולפנת אורות', contact: 'הרב אשר', phone: '052-8308305' },
      { city: 'יד בנימין', address: '', contact: 'רינה זוזוט', phone: '050-9348825' },
      { city: 'תפוח', address: '', contact: 'טל שחר', phone: '058-4771085' },
      { city: 'יישוב הדעת', address: '', contact: 'תפארת', phone: '058-4770975' },
    ]
  },
  {
    area: 'דרום', locations: [
      { city: 'אשקלון - שכונת אגמים', address: '', contact: 'אורטל', phone: '054-6588503' },
      { city: 'אשקלון', address: 'מעלה הגת 6', contact: 'סיגלית כרמי', phone: '054-3001580' },
      { city: 'באר שבע', address: 'נחל לבן 10, שכונת הפארק', contact: 'לינוי זולדן', phone: '053-2330623' },
      { city: 'אופקים', address: '', contact: 'הדר קוסובסקי כהן', phone: '054-5214048' },
      { city: 'ירוחם', address: '', contact: 'ענבל אלמקייס', phone: '058-5828745' },
      { city: 'אילת', address: 'סתונית 9 גנים א', contact: 'פדות בקנרוט', phone: '050-2527121' },
      { city: 'ניצן', address: 'רח׳ השקמה 12א', contact: 'סמדר', phone: '052-2654733' },
    ]
  },
  {
    area: 'צפון', locations: [
      { city: 'טבריה', address: '', contact: 'ענבל', phone: '054-6748611' },
      { city: 'צפת', address: '', contact: 'אתי מורדיאן', phone: '050-6851140' },
      { city: 'כרמיאל', address: '', contact: 'מרים', phone: '054-6517260' },
      { city: 'נהריה', address: '', contact: 'דניאל אזולאי', phone: '054-6116657' },
      { city: 'עכו / קריות', address: 'שלום הגליל 22', contact: 'גלית אלקחיל', phone: '052-8401889' },
      { city: 'חספין (גולן)', address: '', contact: 'מיה סבג', phone: '058-4599886' },
      { city: 'שדמות דבורה', address: '', contact: 'רחלי מרום', phone: '050-7791000' },
    ]
  },
  {
    area: 'שומרון ובנימין', locations: [
      { city: 'אלעד', address: 'אבטליון 26', contact: 'יעל עזר', phone: '052-7062852' },
      { city: 'שומריה', address: '', contact: 'מוריה יאול', phone: '052-8119131' },
    ]
  }
];

// Hardcoded lessons (can add to Sanity later if needed)
export const lessons = [
  { id: 1, title: 'שיעור ראשון', thumbnail: '🎬', youtubeUrl: 'https://youtube.com/watch?v=XXXXX' },
  { id: 2, title: 'שיעור שני', thumbnail: '🎬', youtubeUrl: 'https://youtube.com/watch?v=XXXXX' },
  { id: 3, title: 'שיעור שלישי', thumbnail: '🎬', youtubeUrl: 'https://youtube.com/watch?v=XXXXX' },
  { id: 4, title: 'שיעור רביעי', thumbnail: '🎬', youtubeUrl: 'https://youtube.com/watch?v=XXXXX' },
];

// Hardcoded events (can add to Sanity later if needed)
export const events = [
  { id: 1, title: 'ערב העצמה לנשים', date: '2025-02-15', location: 'תל אביב', description: 'ערב מיוחד של חיבור והעצמה' },
  { id: 2, title: 'סדנת קלפים', date: '2025-02-22', location: 'ירושלים', description: 'למדי להשתמש בקלפי מסע החיים' },
];
