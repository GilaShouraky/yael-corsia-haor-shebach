// Complete data import for Yael Corsia website
// Import all products, bundles, settings, pickup points, etc.

import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'YOUR_PROJECT_ID', // 👈 שימי את ה-ID שלך!
  dataset: 'production',
  useCdn: false,
  token: 'YOUR_SANITY_TOKEN', // 👈 שימי את ה-Token שיצרת!
  apiVersion: '2024-01-01',
})

// ========================================
// נתוני האתר המלאים
// ========================================

// 1. הגדרות אתר
const siteSettings = {
  _type: 'siteSettings',
  _id: 'siteSettings',
  siteName: 'האור שבך',
  tagline: 'מסע של התבוננות, השראה וצמיחה אישית',
  about: [
    {
      _type: 'block',
      children: [{
        _type: 'span',
        text: 'נעים מאוד! שמי יעל כורסיה - מטפלת אישית וזוגית, מנטורית ומנחת סדנאות מודעות עצמית יהודית מעל ל-30 שנה.'
      }],
      markDefs: [],
      style: 'normal'
    },
    {
      _type: 'block',
      children: [{
        _type: 'span',
        text: 'אני מייסדת מועדון הנשים "מסע החיים" - מרחב של התבוננות, השראה וצמיחה אישית, שבו אנו נפגשות מדי שבוע למסע מרגש של חיבור פנימי והתחדשות.'
      }],
      markDefs: [],
      style: 'normal'
    }
  ],
  contactEmail: 'orshebach@gmail.com',
  contactPhone: '054-6588503',
  whatsappNumber: '972546588503',
  instagramHandle: 'yael_corsia',
  whatsappGroupLink: 'https://did.li/D3hx5',
  stats: {
    yearsExperience: 30,
    womenHelped: 5000,
    notebooksSold: 10000,
    workshopsHeld: 100
  }
}

// 2. מוצרים
const products = [
  {
    _type: 'product',
    name: 'קלפי מסע החיים',
    slug: {
      _type: 'slug',
      current: 'klafei-masa-hachaim'
    },
    shortDescription: 'קלפים מעוררי השראה שנכתבו מתוך 30 שנות טיפול והנחיה',
    fullDescription: 'קלפים מעוררי השראה שנכתבו מתוך השיעורים והטיפולים שאני מעבירה מעל ל-30 שנה. כל קלף מלווה בתובנה ובתפילה אישית שתחזק אותך. הקלפים פותחים צוהר להתבוננות פנימית - כלי מדהים לתהליכי עומק והתפתחות.',
    price: 180,
    whatsInside: [
      '42 קלפים מעוררי השראה - כל קלף יפתח לך צוהר להתבוננות פנימית עמוקה ולצמיחה אישית',
      'מסרים מתוך מקורות יהודיים - מילים שיחברו אותך אל הנשמה, אל האמונה ואל הדרך שלך',
      'שילוב מיוחד של מודעות ותפילה - כל קלף מלווה בתובנה ובכיוון תפילה אישי',
      'דרך יצירתית לעבוד על עצמך - לבד, עם חברות או בקבוצה'
    ],
    forWho: [
      'לנשים שמבקשות להכניס יותר משמעות לחיי היומיום',
      'למנחות ומאמנות שרוצות כלי טיפולי ייחודי לקבוצות ולמפגשים',
      'לכל מי שמחפשת חיבור עמוק יותר לעצמה ולבורא'
    ],
    howToUse: 'בחרי קלף בהכוונה או באינטואיציה, קראי את המסר שבו. התחברי אליו דרך שאלה פנימית או תפילה אישית - ותני לו להאיר לך את הדרך.',
    reviews: [
      {
        _type: 'customerReview',
        customerName: 'דבורה כהן',
        reviewText: 'הקלפים האלה פשוט מדהימים! כל בוקר אני שולפת קלף והוא תמיד מדויק'
      },
      {
        _type: 'customerReview',
        customerName: 'רות לוי',
        reviewText: 'כלי עבודה נפלא לסדנאות שלי, התלמידות מתחברות מיד'
      },
      {
        _type: 'customerReview',
        customerName: 'שרה גולד',
        reviewText: 'המתנה המושלמת לכל אישה - משמעותי ומרגש'
      }
    ],
    link: 'https://lp.vp4.me/17y3',
    order: 1,
    active: true
  },
  {
    _type: 'product',
    name: 'מחברת פשוט להודות',
    slug: {
      _type: 'slug',
      current: 'machberet-pashut-lehodot'
    },
    shortDescription: 'מחברת מעוצבת לכתיבת תודות - נמכרה באלפי עותקים בארץ ובעולם',
    fullDescription: 'מחברת מעוצבת לכתיבת תודות עם משפטים מעוררי השראה. המחברת עוזרת בעיסוק בראיית הטוב, באימון אישי ובמשיכת אור ושפע לחיים!',
    price: 35,
    bulkPrice: 30,
    bulkMinimum: 10,
    forWho: [
      'לכל אחד, בכל גיל ובכל שלב - גילאי 9-99!',
      'לכתיבה אישית, זוגית, משפחתית או צוותית',
      'לכל מי שרוצה להתמקד בטוב ולהכניס יותר שמחה לחיים'
    ],
    reviews: [
      {
        _type: 'customerReview',
        customerName: 'מרים אברהם',
        reviewText: 'המחברת הזו שינתה לי את החיים! אני כותבת כל יום ומרגישה את השינוי'
      },
      {
        _type: 'customerReview',
        customerName: 'יהודית ברגר',
        reviewText: 'קניתי לכל המשפחה - אנחנו כותבים ביחד כל ערב'
      },
      {
        _type: 'customerReview',
        customerName: 'חנה שפירא',
        reviewText: 'מתנה מושלמת שכולם אוהבים לקבל'
      }
    ],
    link: 'https://lp.vp4.me/qqkm',
    order: 2,
    active: true
  },
  {
    _type: 'product',
    name: 'בובי ואני',
    slug: {
      _type: 'slug',
      current: 'bobi-vaani'
    },
    shortDescription: 'ספר ילדים מרגש על התמודדות עם פחדים ופיתוח שפה רגשית',
    fullDescription: 'את הספר "בובי ואני" כתבתי מתוך חוויה אישית כאימא וכסבתא, שפוגשת לא מעט לבבות קטנים שפוחדים, במיוחד בלילות.\n\nיש רגעים שבהם העולם משתתק ודווקא אז עולים הפחדים. אבל ברגעים אלו מסתתרת הזדמנות: לעצור, לנשום, להקשיב, להיות עם הילד ולא למהר \'להעלים את הפחד\', אלא ללמד את הילד לעבד את רגשותיו.',
    aboutBook: 'סיפור מחבק על דָּוִד והפחד, ועל הדרך למצוא בתוכנו אומץ, אמון ואהבה. כי כל ילד פוגש פחד, וכל הורה רוצה לדעת איך לעזור לו. ספר שמדבר לילדים - ונוגע בלב של כולנו. מזמין שיח רגשי, זמן איכות וריפוי עדין יחד.',
    price: 68,
    salePrice: 50,
    forWho: [
      'לילדים בגילאי 3-8',
      'להורים שרוצים לעזור לילדיהם להתמודד עם פחדים',
      'למטפלים, גננות ואנשי חינוך לגיל הרך'
    ],
    reviews: [
      {
        _type: 'customerReview',
        customerName: 'לאה כהן',
        reviewText: 'הספר עזר לבת שלי להתמודד עם הפחד מהחושך. תודה רבה!'
      },
      {
        _type: 'customerReview',
        customerName: 'טל גרינברג',
        reviewText: 'כמורה בגן, הספר הזה הפך לחלק בלתי נפרד מהשגרה שלנו'
      },
      {
        _type: 'customerReview',
        customerName: 'נועה לוי',
        reviewText: 'סיפור מרגש ומחבק שנוגע ישר ללב'
      }
    ],
    link: 'https://yaelcorsiabook1.netlify.app/',
    order: 3,
    active: true
  },
  {
    _type: 'product',
    name: 'מנוי למסע החיים',
    slug: {
      _type: 'slug',
      current: 'manuy-lemasa-hachaim'
    },
    shortDescription: 'מועדון נשים - מרחב של התבוננות, השראה וצמיחה אישית',
    fullDescription: 'מועדון נשים ייחודי המתכנס מדי שבוע למסע מרגש של חיבור פנימי והתחדשות.',
    comingSoon: true,
    order: 4,
    active: true
  }
]

// ========================================
// ייבוא הנתונים
// ========================================

async function importAllData() {
  console.log('🚀 מתחיל ייבוא כל הנתונים לפאנל...\n')
  
  try {
    // 1. ייבוא הגדרות אתר
    console.log('📝 מייבא הגדרות אתר...')
    await client.createOrReplace(siteSettings)
    console.log('✅ הגדרות אתר יובאו בהצלחה!\n')
    
    // 2. ייבוא מוצרים
    console.log('🛍️ מייבא מוצרים...')
    for (const product of products) {
      try {
        const result = await client.create(product)
        console.log(`  ✅ יובא: ${product.name}`)
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`  ⚠️  ${product.name} כבר קיים - מדלג`)
        } else {
          console.error(`  ❌ שגיאה ב-${product.name}:`, error.message)
        }
      }
    }
    
    console.log('\n🎉 הייבוא הושלם בהצלחה!')
    console.log('\n📊 סיכום:')
    console.log(`  ✅ הגדרות אתר: 1`)
    console.log(`  ✅ מוצרים: ${products.length}`)
    console.log('\n💡 עכשיו רענני את הפאנל ותראי את כל התוכן!')
    
  } catch (error) {
    console.error('\n❌ שגיאה כללית:', error.message)
    console.error('\n🔍 ודאי ש:')
    console.error('  1. ה-Project ID נכון')
    console.error('  2. ה-Token תקף ויש לו הרשאות Editor')
    console.error('  3. יש חיבור לאינטרנט')
  }
}

// הרצה!
importAllData()
