import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, BookOpen, Sparkles, Mail, Phone, Instagram, X, MapPin, CreditCard, Truck, ChevronDown, ChevronUp, Send, Play, Calendar, Users, MessageCircle } from 'lucide-react';
import './YaelCorsiaWebsite.css';

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Bulk Order Popup Component
const BulkOrderPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('שלום יעל! אשמח לבצע הזמנה מרוכזת של מעל 50 מחברות "פשוט להודות"');
    window.open(`https://wa.me/972546588503?text=${message}`, '_blank');
    onClose();
  };
  
  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="bulk-popup">
        <button onClick={onClose} className="popup-close">
          <X />
        </button>
        <div className="bulk-popup-content">
          <h3>הזמנה מרוכזת</h3>
          <p>להזמנה מרוכזת מעל 50 יחידות אנא פנו אלינו בווצאפ</p>
          <button onClick={handleWhatsAppClick} className="whatsapp-bulk-button">
            <WhatsAppIcon className="whatsapp-icon" />
            פנו אלינו בווצאפ
          </button>
        </div>
      </div>
    </>
  );
};

// Shared data and state management
const useSharedState = () => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [expandedPickup, setExpandedPickup] = useState(false);
  const [showBulkPopup, setShowBulkPopup] = useState(false);

  const products = [
    {
      id: 1,
      name: 'קלפי מסע החיים',
      shortDescription: 'קלפים מעוררי השראה שנכתבו מתוך 30 שנות טיפול והנחיה',
      fullDescription: 'קלפים מעוררי השראה שנכתבו מתוך השיעורים והטיפולים שאני מעבירה מעל ל-30 שנה. כל קלף מלווה בתובנה ובתפילה אישית שתחזק אותך. הקלפים פותחים צוהר להתבוננות פנימית - כלי מדהים לתהליכי עומק והתפתחות.',
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
      testimonials: [
        'הקלפים האלה פשוט מדהימים! כל בוקר אני שולפת קלף והוא תמיד מדויק',
        'כלי עבודה נפלא לסדנאות שלי, התלמידות מתחברות מיד',
        'המתנה המושלמת לכל אישה - משמעותי ומרגש'
      ],
      price: 180,
      image: 'https://i.imgur.com/EvOv2HL.jpeg',
      icon: Sparkles,
      link: 'https://lp.vp4.me/17y3'
    },
    {
      id: 2,
      name: 'מחברת פשוט להודות',
      shortDescription: 'מחברת מעוצבת לכתיבת תודות - נמכרה באלפי עותקים בארץ ובעולם',
      fullDescription: 'מחברת מעוצבת לכתיבת תודות עם משפטים מעוררי השראה. המחברת עוזרת בעיסוק בראיית הטוב, באימון אישי ובמשיכת אור ושפע לחיים!',
      forWho: [
        'לכל אחד, בכל גיל ובכל שלב - גילאי 9-99!',
        'לכתיבה אישית, זוגית, משפחתית או צוותית',
        'לכל מי שרוצה להתמקד בטוב ולהכניס יותר שמחה לחיים'
      ],
      testimonials: [
        'המחברת הזו שינתה לי את החיים! אני כותבת כל יום ומרגישה את השינוי',
        'קניתי לכל המשפחה - אנחנו כותבים ביחד כל ערב',
        'מתנה מושלמת שכולם אוהבים לקבל'
      ],
      price: 35,
      bulkPrice: 30,
      bulkMinimum: 10,
      bulkMaxBeforePopup: 50,
      image: 'https://i.imgur.com/ielPgE4.jpeg',
      icon: Heart,
      link: 'https://lp.vp4.me/qqkm'
    },
    {
      id: 3,
      name: 'בובי ואני',
      shortDescription: 'ספר ילדים מרגש על התמודדות עם פחדים ופיתוח שפה רגשית',
      fullDescription: `את הספר "בובי ואני" כתבתי מתוך חוויה אישית כאימא וכסבתא, שפוגשת לא מעט לבבות קטנים שפוחדים, במיוחד בלילות.

יש רגעים שבהם העולם משתתק ודווקא אז עולים הפחדים. אבל ברגעים אלו מסתתרת הזדמנות: לעצור, לנשום, להקשיב, להיות עם הילד ולא למהר 'להעלים את הפחד', אלא ללמד את הילד לעבד את רגשותיו.`,
      aboutBook: 'סיפור מחבק על דָּוִד והפחד, ועל הדרך למצוא בתוכנו אומץ, אמון ואהבה. כי כל ילד פוגש פחד, וכל הורה רוצה לדעת איך לעזור לו. ספר שמדבר לילדים - ונוגע בלב של כולנו. מזמין שיח רגשי, זמן איכות וריפוי עדין יחד.',
      forWho: [
        'לילדים בגילאי 3-8',
        'להורים שרוצים לעזור לילדיהם להתמודד עם פחדים',
        'למטפלים, גננות ואנשי חינוך לגיל הרך'
      ],
      price: 68,
      salePrice: 50,
      image: 'https://i.imgur.com/OXNGHx2.png',
      icon: BookOpen,
      link: 'https://yaelcorsiabook1.netlify.app/'
    },
    {
      id: 4,
      name: 'מנוי למסע החיים',
      shortDescription: 'מועדון נשים - מרחב של התבוננות, השראה וצמיחה אישית',
      fullDescription: 'מועדון נשים ייחודי המתכנס מדי שבוע למסע מרגש של חיבור פנימי והתחדשות.',
      price: null,
      image: '✨',
      icon: Sparkles,
      comingSoon: true
    }
  ];

  const bundles = [
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

  const pickupPoints = [
    { area: 'מרכז', locations: [
      { city: 'פתח תקוה', address: 'רח׳ דגל ראובן 27', contact: 'חגית גרינברג', phone: '058-6253893' },
      { city: 'רמת גן', address: 'מבצע עין 9', contact: 'אורטל', phone: '054-6588503' },
      { city: 'תל אביב', address: 'רח׳ נתן ילין מור', contact: 'יהודה', phone: '055-6631648' },
      { city: 'ראשון לציון / בת ים', address: 'רח׳ שושנה דמרי', contact: 'הודיה', phone: '054-6588573' },
      { city: 'רחובות', address: 'מלצר 1', contact: 'מיכל עוקשי', phone: '052-6661033' },
      { city: 'רעננה', address: 'הפנינה 6 (ימי ב׳ ו-ד׳)', contact: 'מוריה', phone: '054-6979143' },
      { city: 'נתניה', address: 'רח׳ שבח 3', contact: 'פרלה', phone: '053-5269028' },
      { city: 'חדרה', address: '', contact: 'צליל שבת', phone: '054-5315136' },
      { city: 'חריש', address: '', contact: 'הילה לנגה', phone: '050-3199460' },
    ]},
    { area: 'ירושלים והסביבה', locations: [
      { city: 'ירושלים - קרית משה', address: '', contact: 'בריינה', phone: '054-7984328' },
      { city: 'בית אל', address: '', contact: 'גיתית כורסיה', phone: '054-3370180' },
      { city: 'נוף אילון', address: '', contact: 'משפחת כורסיה', phone: '054-5971840' },
      { city: 'נריה', address: '', contact: 'אורטל', phone: '054-6588503' },
      { city: 'בית שמש (מרכז ביג, מושב זכריה)', address: '', contact: 'דלית', phone: '054-4535140' },
      { city: 'מודיעין', address: 'אולפנת אורות', contact: 'הרב אשר', phone: '052-8308305' },
      { city: 'יד בנימין', address: '', contact: 'רינה זוזוט', phone: '050-9348825' },
      { city: 'תפוח', address: '', contact: 'טל שחר', phone: '058-4771085' },
      { city: 'יישוב הדעת', address: '', contact: 'תפארת', phone: '058-4770975' },
    ]},
    { area: 'דרום', locations: [
      { city: 'אשקלון - שכונת אגמים', address: '', contact: 'אורטל', phone: '054-6588503' },
      { city: 'אשקלון', address: 'מעלה הגת 6', contact: 'סיגלית כרמי', phone: '054-3001580' },
      { city: 'באר שבע', address: 'נחל לבן 10, שכונת הפארק', contact: 'לינוי זולדן', phone: '053-2330623' },
      { city: 'אופקים', address: '', contact: 'הדר קוסובסקי כהן', phone: '054-5214048' },
      { city: 'ירוחם', address: '', contact: 'ענבל אלמקייס', phone: '058-5828745' },
      { city: 'אילת', address: 'סתונית 9 גנים א', contact: 'פדות בקנרוט', phone: '050-2527121' },
      { city: 'ניצן', address: 'רח׳ השקמה 12א', contact: 'סמדר', phone: '052-2654733' },
    ]},
    { area: 'צפון', locations: [
      { city: 'טבריה', address: '', contact: 'ענבל', phone: '054-6748611' },
      { city: 'צפת', address: '', contact: 'אתי מורדיאן', phone: '050-6851140' },
      { city: 'כרמיאל', address: '', contact: 'מרים', phone: '054-6517260' },
      { city: 'נהריה', address: '', contact: 'דניאל אזולאי', phone: '054-6116657' },
      { city: 'עכו / קריות', address: 'שלום הגליל 22', contact: 'גלית אלקחיל', phone: '052-8401889' },
      { city: 'חספין (גולן)', address: '', contact: 'מיה סבג', phone: '058-4599886' },
      { city: 'שדמות דבורה', address: '', contact: 'רחלי מרום', phone: '050-7791000' },
    ]},
    { area: 'שומרון ובנימין', locations: [
      { city: 'אלעד', address: 'אבטליון 26', contact: 'יעל עזר', phone: '052-7062852' },
      { city: 'שומריה', address: '', contact: 'מוריה יאול', phone: '052-8119131' },
    ]}
  ];

  const lessons = [
    { id: 1, title: 'שיעור ראשון', thumbnail: '🎬', youtubeUrl: 'https://youtube.com/watch?v=XXXXX' },
    { id: 2, title: 'שיעור שני', thumbnail: '🎬', youtubeUrl: 'https://youtube.com/watch?v=XXXXX' },
    { id: 3, title: 'שיעור שלישי', thumbnail: '🎬', youtubeUrl: 'https://youtube.com/watch?v=XXXXX' },
    { id: 4, title: 'שיעור רביעי', thumbnail: '🎬', youtubeUrl: 'https://youtube.com/watch?v=XXXXX' },
  ];

  const events = [
    { id: 1, title: 'ערב העצמה לנשים', date: '2025-02-15', location: 'תל אביב', description: 'ערב מיוחד של חיבור והעצמה' },
    { id: 2, title: 'סדנת קלפים', date: '2025-02-22', location: 'ירושלים', description: 'למדי להשתמש בקלפי מסע החיים' },
  ];

  const addToCart = (product, quantity = 1) => {
    // Check for bulk popup for notebook
    if (product.id === 2 && quantity > 50) {
      setShowBulkPopup(true);
      return;
    }
    
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.id === 2 && newQuantity > 50) {
        setShowBulkPopup(true);
        return;
      }
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    // Check for bulk popup for notebook
    const item = cart.find(i => i.id === productId);
    if (item && item.id === 2 && newQuantity > 50) {
      setShowBulkPopup(true);
      return;
    }
    
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => {
      let price = item.salePrice || item.price;
      // Apply bulk pricing for notebook (10+ units = 30 NIS each)
      if (item.id === 2 && item.quantity >= 10) {
        price = 30;
      }
      return sum + (price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleCheckout = () => {
    const message = cart.map(item => {
      let priceInfo = '';
      if (item.id === 2 && item.quantity >= 10) {
        priceInfo = ' (מחיר מיוחד: ₪30 ליחידה)';
      }
      return `${item.name} x${item.quantity}${priceInfo}`;
    }).join('\n');
    const total = getTotalPrice();
    const whatsappMessage = encodeURIComponent(
      `שלום יעל! אשמח להזמין:\n${message}\n\nסה"כ: ₪${total}`
    );
    window.open(`https://wa.me/972546588503?text=${whatsappMessage}`, '_blank');
  };

  return {
    cart, setCart,
    isCartOpen, setIsCartOpen,
    showNotification, setShowNotification,
    selectedProduct, setSelectedProduct,
    expandedPickup, setExpandedPickup,
    showBulkPopup, setShowBulkPopup,
    products, bundles, pickupPoints, lessons, events,
    addToCart, removeFromCart, updateQuantity,
    getTotalPrice, getTotalItems, handleCheckout
  };
};

// Header Component with WhatsApp button
const Header = ({ getTotalItems, setIsCartOpen, isCartOpen }) => {
  const location = useLocation();
  
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <div className="logo-title">האור שבך</div>
        </Link>
        <nav className="nav-links">
          <Link to="/shop" className={location.pathname === '/shop' ? 'active' : ''}>חנות</Link>
          <Link to="/subscribe" className={location.pathname === '/subscribe' ? 'active' : ''}>מנויות</Link>
          <Link to="/lessons" className={location.pathname === '/lessons' ? 'active' : ''}>שיעורים</Link>
          <Link to="/events" className={location.pathname === '/events' ? 'active' : ''}>אירועים</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>אודות</Link>
        </nav>
        <div className="header-buttons">
          <a 
            href="https://did.li/D3hx5"
            target="_blank"
            rel="noopener noreferrer"
            className="join-whatsapp-button"
          >
            <WhatsAppIcon className="whatsapp-header-icon" />
            <span className="join-text">להצטרפות לקבוצת העצמה לחצי כאן</span>
          </a>
          <button 
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="cart-button"
          >
            <ShoppingCart className="cart-icon" />
            {getTotalItems() > 0 && (
              <span className="cart-badge">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

// Product Modal Component - Updated for notebook bulk pricing
const ProductModal = ({ selectedProduct, setSelectedProduct, addToCart, setShowBulkPopup }) => {
  const [quantity, setQuantity] = useState(1);
  
  if (!selectedProduct) return null;
  
  const isNotebook = selectedProduct.id === 2;
  const currentPrice = isNotebook && quantity >= 10 ? 30 : (selectedProduct.salePrice || selectedProduct.price);
  const totalPrice = currentPrice * quantity;
  
  const handleQuantityChange = (newQty) => {
    if (newQty > 50 && isNotebook) {
      setShowBulkPopup(true);
      return;
    }
    setQuantity(Math.max(1, newQty));
  };
  
  const handleAddToCart = () => {
    if (quantity > 50 && isNotebook) {
      setShowBulkPopup(true);
      return;
    }
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setQuantity(1);
  };
  
  return (
    <>
      <div 
        className="modal-overlay"
        onClick={() => { setSelectedProduct(null); setQuantity(1); }}
      />
      <div className="modal product-modal">
        <div className="modal-content">
          <button 
            onClick={() => { setSelectedProduct(null); setQuantity(1); }}
            className="modal-close"
          >
            <X className="close-icon" />
          </button>
          
          <div className="modal-grid">
            <div className="modal-image-section">
              {typeof selectedProduct.image === 'string' && selectedProduct.image.startsWith('http') ? (
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="modal-image"
                />
              ) : (
                <div className="modal-emoji">{selectedProduct.image}</div>
              )}
            </div>
            
            <div className="modal-info-section">
              <h2 className="modal-title">{selectedProduct.name}</h2>
              
              <div className="modal-pricing">
                {selectedProduct.salePrice ? (
                  <>
                    <span className="original-price">₪{selectedProduct.price}</span>
                    <span className="sale-price">₪{selectedProduct.salePrice}</span>
                    <span className="sale-badge">מחיר השקה!</span>
                  </>
                ) : selectedProduct.price ? (
                  <span className="current-price">₪{selectedProduct.price}</span>
                ) : null}
              </div>

              <div className="modal-description">
                <p>{selectedProduct.fullDescription}</p>
                {selectedProduct.aboutBook && (
                  <p className="about-book">{selectedProduct.aboutBook}</p>
                )}
              </div>

              {selectedProduct.whatsInside && (
                <div className="modal-section">
                  <h3>מה בערכה?</h3>
                  <ul>
                    {selectedProduct.whatsInside.map((item, idx) => (
                      <li key={idx}>✔ {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedProduct.forWho && (
                <div className="modal-section">
                  <h3>למי מתאים?</h3>
                  <ul>
                    {selectedProduct.forWho.map((item, idx) => (
                      <li key={idx}>❤ {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedProduct.howToUse && (
                <div className="modal-section">
                  <h3>איך זה עובד?</h3>
                  <p>{selectedProduct.howToUse}</p>
                </div>
              )}

              {selectedProduct.testimonials && (
                <div className="modal-section testimonials-section">
                  <h3>מה אומרים עלינו</h3>
                  <div className="testimonials-grid">
                    {selectedProduct.testimonials.map((testimonial, idx) => (
                      <div key={idx} className="testimonial-card">
                        <p>"{testimonial}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isNotebook && (
                <div className="bulk-pricing-info">
                  <div className="bulk-notice success">
                    💡 מעל 10 יחידות - רק ₪30 ליחידה!
                  </div>
                  {quantity >= 10 && (
                    <div className="bulk-applied">
                      ✓ מחיר מיוחד הופעל! ₪30 ליחידה
                    </div>
                  )}
                </div>
              )}
              
              {selectedProduct.comingSoon ? (
                <div className="coming-soon-container">
                  <span className="coming-soon-badge">בקרוב</span>
                </div>
              ) : (
                <div className="modal-actions">
                  {isNotebook && (
                    <div className="quantity-selector">
                      <label>כמות:</label>
                      <div className="quantity-controls">
                        <button onClick={() => handleQuantityChange(quantity - 1)}>-</button>
                        <input 
                          type="number" 
                          value={quantity} 
                          onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                          min="1"
                          max="50"
                        />
                        <button onClick={() => handleQuantityChange(quantity + 1)}>+</button>
                      </div>
                      <span className="total-price">סה"כ: ₪{totalPrice}</span>
                    </div>
                  )}
                  <button
                    onClick={handleAddToCart}
                    className="add-to-cart-button"
                  >
                    הוסף לסל
                  </button>
                  {selectedProduct.link && (
                    <a 
                      href={selectedProduct.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-original-link"
                    >
                      לעמוד המוצר המלא
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Cart Sidebar Component
const CartSidebar = ({ isCartOpen, setIsCartOpen, cart, updateQuantity, getTotalPrice, handleCheckout, setShowBulkPopup }) => {
  if (!isCartOpen) return null;
  
  const handleQtyChange = (itemId, newQty) => {
    const item = cart.find(i => i.id === itemId);
    if (item && item.id === 2 && newQty > 50) {
      setShowBulkPopup(true);
      return;
    }
    updateQuantity(itemId, newQty);
  };
  
  return (
    <>
      <div 
        className="modal-overlay"
        onClick={() => setIsCartOpen(false)}
      />
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2 className="cart-title">סל הקניות</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="cart-close"
          >
            <X className="close-icon" />
          </button>
        </div>
        
        {cart.length === 0 ? (
          <p className="cart-empty">הסל ריק</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => {
                const isNotebook = item.id === 2;
                const unitPrice = isNotebook && item.quantity >= 10 ? 30 : (item.salePrice || item.price);
                return (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h3 className="cart-item-name">{item.name}</h3>
                      <p className="cart-item-price">
                        ₪{unitPrice}
                        {isNotebook && item.quantity >= 10 && (
                          <span className="bulk-discount-badge"> (מחיר מיוחד!)</span>
                        )}
                      </p>
                    </div>
                    <div className="cart-item-quantity">
                      <button
                        onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                        className="quantity-button"
                      >
                        -
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                        className="quantity-button"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-summary">
              <div className="cart-divider"></div>
              <div className="cart-total">
                <span>סה"כ לתשלום:</span>
                <span className="total-price">₪{getTotalPrice()}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="checkout-button"
            >
              <Phone className="button-icon" />
              המשך להזמנה בוואטסאפ
            </button>
          </>
        )}
      </div>
    </>
  );
};

// Hero Section Component
const HeroSection = () => (
  <section className="hero">
    <div className="hero-content">
      <div className="hero-decoration">
        <img 
          src="/images/crown.png" 
          alt="כתר" 
          className="crown-image"
        />
      </div>
      <h1 className="hero-title">האור שבך</h1>
      <p className="hero-subtitle">עם יעל כורסיה</p>
      <div className="hero-divider"></div>
      <p className="hero-tagline">מסע של התבוננות, השראה וצמיחה אישית</p>
    </div>
  </section>
);

// About Section Component (for HomePage)
const AboutSectionHome = () => (
  <section className="about-section-home">
    <div className="about-container">
      <div className="about-image-wrapper">
        <img 
          src="https://i.imgur.com/01HMEOs.jpeg" 
          alt="יעל כורסיה"
          className="about-image"
        />
      </div>
      <div className="about-card">
        <h2 className="about-title">קצת עליי</h2>
        <div className="about-content">
          <p><strong>נעים מאוד! שמי יעל כורסיה</strong> - מטפלת אישית וזוגית, מנטורית ומנחת סדנאות מודעות עצמית יהודית מעל ל-30 שנה.</p>
          <p>אני מייסדת מועדון הנשים <strong>"מסע החיים"</strong> - מרחב של התבוננות, השראה וצמיחה אישית, שבו אנו נפגשות מדי שבוע למסע מרגש של חיבור פנימי והתחדשות.</p>
          <p>לאורך השנים ליוויתי נשים רבות בתהליכי מודעות, שינוי וצמיחה - ומתוך הדרך הזו נולד גם הרצון להעניק לילדים כלים רגשיים שיסייעו להם להכיר את עצמם, להתמודד עם פחדים וקשיים ולגלות את הכוחות שבתוכם.</p>
          <p>הספר <strong>"בּוּבִּי וַאֲנִי"</strong> הוא הספר הראשון בסדרת ספרים חדשה, שמטרתה לעזור לילדים לפתח שפה רגשית, ביטחון עצמי ויכולת ביטוי בריאה - בדרך עדינה, מקרבת ומלאת לב.</p>
          <p>בנוסף זכיתי להוציא לאור את <strong>מחברת "פשוט להודות"</strong> - מחברת מעוצבת לכתיבת תודות, שנמכרה באלפי עותקים בארץ ובעולם, ואת <strong>ערכת הקלפים "מודעות, תפילה והעצמה"</strong> - ערכה ייחודית ומרגשת המשלבת השראה, תפילה וכלים לעבודה פנימית.</p>
          <p className="about-highlight">אני מאמינה שככל שנעניק לילדים (ולנו עצמנו) שפה רגשית, חיבור לעצמם ואמונה בטוב - נוכל ליצור עולם חומל, יצירתי ושמח יותר.</p>
        </div>
      </div>
    </div>
  </section>
);

// Product Card Component
const ProductCard = ({ product, setSelectedProduct }) => {
  const IconComponent = product.icon;
  return (
    <div className="product-card">
      <div className="product-image-container">
        {typeof product.image === 'string' && product.image.startsWith('http') ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="product-image"
          />
        ) : (
          <div className="product-emoji">{product.image}</div>
        )}
      </div>
      <div className="product-info">
        <div className="product-header">
          <IconComponent className="product-icon" />
          <h3 className="product-name">{product.name}</h3>
        </div>
        <p className="product-description">{product.shortDescription}</p>
        {product.comingSoon ? (
          <div className="coming-soon-container">
            <span className="coming-soon-badge">בקרוב</span>
          </div>
        ) : (
          <div className="product-footer">
            <div className="product-pricing">
              {product.salePrice ? (
                <>
                  <span className="product-original-price">₪{product.price}</span>
                  <span className="product-sale-price">₪{product.salePrice}</span>
                </>
              ) : (
                <span className="product-price">₪{product.price}</span>
              )}
            </div>
            <button
              onClick={() => setSelectedProduct(product)}
              className="details-button"
            >
              לפרטים נוספים
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Bundle Card Component
const BundleCard = ({ bundle, addToCart }) => (
  <div className={`bundle-card ${bundle.recommended ? 'recommended' : ''}`}>
    {bundle.recommended && (
      <div className="recommended-badge">הכי משתלם!</div>
    )}
    <div className="bundle-emoji">{bundle.image}</div>
    <h3 className="bundle-title">{bundle.name}</h3>
    <p className="bundle-description">{bundle.description}</p>
    
    <div className="bundle-items">
      <strong>הערכה כוללת:</strong>
      <ul>
        {bundle.items.map((item, idx) => (
          <li key={idx}>✓ {item}</li>
        ))}
      </ul>
    </div>
    
    <div className="bundle-pricing">
      <span className="bundle-original">₪{bundle.originalPrice}</span>
      <span className="bundle-price">₪{bundle.price}</span>
      <span className="bundle-savings">חיסכון של ₪{bundle.savings}!</span>
    </div>
    
    <button
      onClick={() => addToCart(bundle)}
      className="bundle-button"
    >
      הוסף לסל
    </button>
  </div>
);

// Pickup Points Component
const PickupPointsSection = ({ pickupPoints, expandedPickup, setExpandedPickup }) => (
  <div className="pickup-section">
    <button 
      className="pickup-toggle"
      onClick={() => setExpandedPickup(!expandedPickup)}
    >
      <MapPin className="toggle-icon" />
      <span>נקודות איסוף עצמי ברחבי הארץ</span>
      {expandedPickup ? <ChevronUp /> : <ChevronDown />}
    </button>
    
    {expandedPickup && (
      <div className="pickup-points">
        {pickupPoints.map((region, idx) => (
          <div key={idx} className="pickup-region">
            <h4 className="region-title">{region.area}</h4>
            <div className="locations-grid">
              {region.locations.map((loc, locIdx) => (
                <div key={locIdx} className="location-card">
                  <strong>{loc.city}</strong>
                  {loc.address && <span className="location-address">{loc.address}</span>}
                  <span className="location-contact">{loc.contact}</span>
                  <a href={`tel:${loc.phone}`} className="location-phone">{loc.phone}</a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Home Page Component - with Hero and About section
const HomePage = () => (
  <>
    <HeroSection />
    <div className="home-welcome">
      <p>ברוכים הבאים לעולם של השראה, צמיחה והתפתחות אישית</p>
      <div className="home-links">
        <Link to="/shop" className="home-link-card">
          <ShoppingCart className="home-link-icon" />
          <span>לחנות</span>
        </Link>
        <Link to="/subscribe" className="home-link-card">
          <Users className="home-link-icon" />
          <span>הצטרפי אלינו</span>
        </Link>
        <Link to="/lessons" className="home-link-card">
          <Play className="home-link-icon" />
          <span>שיעורים</span>
        </Link>
        <Link to="/events" className="home-link-card">
          <Calendar className="home-link-icon" />
          <span>אירועים</span>
        </Link>
      </div>
    </div>
    <AboutSectionHome />
  </>
);

// Shop Page Component
const ShopPage = ({ products, bundles, pickupPoints, addToCart, setSelectedProduct, expandedPickup, setExpandedPickup }) => (
  <div className="page-content">
    
    <section className="products-section">
      <h2 className="section-title">המוצרים שלי</h2>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} setSelectedProduct={setSelectedProduct} />
        ))}
      </div>
    </section>

    <section className="bundles-section-small">
      <h2 className="section-title-small">מבצעים מיוחדים</h2>
      <div className="bundles-grid-small">
        {bundles.map((bundle) => (
          <BundleCard key={bundle.id} bundle={bundle} addToCart={addToCart} />
        ))}
      </div>
    </section>

    <section className="purchase-section">
      <h2 className="section-title-small">אופן הרכישה</h2>
      
      <div className="purchase-options">
        <div className="purchase-card">
          <div className="purchase-icon">
            <CreditCard />
          </div>
          <h3>תשלום מאובטח</h3>
          <p>תשלום בכרטיס אשראי דרך מערכת Grow המאובטחת</p>
        </div>
        
        <div className="purchase-card">
          <div className="purchase-icon">
            <Truck />
          </div>
          <h3>משלוח עד הבית</h3>
          <p>משלוח בשליח תוך 3-5 ימי עסקים בתשלום נוסף</p>
        </div>
        
        <div className="purchase-card">
          <div className="purchase-icon">
            <MapPin />
          </div>
          <h3>איסוף עצמי</h3>
          <p>נקודות איסוף ברחבי הארץ - ללא תשלום נוסף!</p>
        </div>
      </div>

      <PickupPointsSection 
        pickupPoints={pickupPoints}
        expandedPickup={expandedPickup}
        setExpandedPickup={setExpandedPickup}
      />
    </section>
  </div>
);

// Subscribe Page Component
const SubscribePage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    area: '',
    whatsappGroup: false,
    fullSubscription: false
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const selections = [];
    if (formData.whatsappGroup) selections.push('קבוצת ווצאפ העצמה');
    if (formData.fullSubscription) selections.push('מנוי שלם במסע החיים');
    
    const message = `שלום יעל! אשמח להירשם
שם: ${formData.firstName} ${formData.lastName}
אזור מגורים: ${formData.area}
אני רוצה להצטרף ל: ${selections.join(', ')}`;
    
    const whatsappMessage = encodeURIComponent(message);
    window.open(`https://wa.me/972546588503?text=${whatsappMessage}`, '_blank');
    setSubmitted(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="page-content">
      <h1 className="page-title">הצטרפי אלינו</h1>
      
      <div className="subscribe-container">
        {submitted ? (
          <div className="subscribe-success">
            <Sparkles className="success-icon" />
            <h2>תודה על ההרשמה!</h2>
            <p>נחזור אלייך בהקדם</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="subscribe-form">
            <div className="form-group">
              <label htmlFor="firstName">שם פרטי</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="הכניסי את שמך"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">שם משפחה</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="הכניסי את שם המשפחה"
              />
            </div>

            <div className="form-group">
              <label htmlFor="area">אזור מגורים</label>
              <input
                type="text"
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
                placeholder="לדוגמה: תל אביב, ירושלים..."
              />
            </div>

            <div className="form-group checkbox-group">
              <label>אני רוצה להצטרף ל:</label>
              
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="whatsappGroup"
                  name="whatsappGroup"
                  checked={formData.whatsappGroup}
                  onChange={handleChange}
                />
                <label htmlFor="whatsappGroup">קבוצת ווצאפ העצמה</label>
              </div>

              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="fullSubscription"
                  name="fullSubscription"
                  checked={formData.fullSubscription}
                  onChange={handleChange}
                />
                <label htmlFor="fullSubscription">מנוי שלם במסע החיים</label>
              </div>
            </div>

            <button type="submit" className="submit-button">
              <Send className="button-icon" />
              שליחה
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// Lessons Page Component
const LessonsPage = ({ lessons }) => (
  <div className="page-content">
    <h1 className="page-title">שיעורים</h1>
    <p className="page-subtitle">שיעורי וידאו להעצמה והשראה</p>
    
    <div className="lessons-grid">
      {lessons.map((lesson) => (
        <a 
          key={lesson.id}
          href={lesson.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="lesson-card"
        >
          <div className="lesson-thumbnail">
            <Play className="play-icon" />
          </div>
          <h3 className="lesson-title">{lesson.title}</h3>
        </a>
      ))}
    </div>
  </div>
);

// Events Page Component
const EventsPage = ({ events }) => (
  <div className="page-content">
    <h1 className="page-title">אירועים</h1>
    <p className="page-subtitle">האירועים הקרובים שלנו</p>
    
    {events.length === 0 ? (
      <div className="no-events">
        <Calendar className="no-events-icon" />
        <p>אין אירועים מתוכננים כרגע</p>
        <p>עקבי אחרינו לעדכונים!</p>
      </div>
    ) : (
      <div className="events-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-date">
              <Calendar className="event-icon" />
              <span>{new Date(event.date).toLocaleDateString('he-IL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}</span>
            </div>
            <h3 className="event-title">{event.title}</h3>
            <p className="event-location">📍 {event.location}</p>
            <p className="event-description">{event.description}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

// About Page Component
const AboutPage = () => (
  <div className="page-content">
    <section className="about-section">
      <div className="about-image-wrapper">
        <img 
          src="https://i.imgur.com/01HMEOs.jpeg" 
          alt="יעל כורסיה"
          className="about-image"
        />
      </div>
      <div className="about-card">
        <h2 className="about-title">קצת עליי</h2>
        <div className="about-content">
          <p><strong>נעים מאוד! שמי יעל כורסיה</strong> - מטפלת אישית וזוגית, מנטורית ומנחת סדנאות מודעות עצמית יהודית מעל ל-30 שנה.</p>
          <p>אני מייסדת מועדון הנשים <strong>"מסע החיים"</strong> - מרחב של התבוננות, השראה וצמיחה אישית, שבו אנו נפגשות מדי שבוע למסע מרגש של חיבור פנימי והתחדשות.</p>
          <p>לאורך השנים ליוויתי נשים רבות בתהליכי מודעות, שינוי וצמיחה - ומתוך הדרך הזו נולד גם הרצון להעניק לילדים כלים רגשיים שיסייעו להם להכיר את עצמם, להתמודד עם פחדים וקשיים ולגלות את הכוחות שבתוכם.</p>
          <p>הספר <strong>"בּוּבִּי וַאֲנִי"</strong> הוא הספר הראשון בסדרת ספרים חדשה, שמטרתה לעזור לילדים לפתח שפה רגשית, ביטחון עצמי ויכולת ביטוי בריאה - בדרך עדינה, מקרבת ומלאת לב.</p>
          <p>בנוסף זכיתי להוציא לאור את <strong>מחברת "פשוט להודות"</strong> - מחברת מעוצבת לכתיבת תודות, שנמכרה באלפי עותקים בארץ ובעולם, ואת <strong>ערכת הקלפים "מודעות, תפילה והעצמה"</strong> - ערכה ייחודית ומרגשת המשלבת השראה, תפילה וכלים לעבודה פנימית.</p>
          <p className="about-highlight">אני מאמינה שככל שנעניק לילדים (ולנו עצמנו) שפה רגשית, חיבור לעצמם ואמונה בטוב - נוכל ליצור עולם חומל, יצירתי ושמח יותר.</p>
        </div>
      </div>
    </section>
  </div>
);

// Contact Section Component
const ContactSection = () => (
  <section className="contact-section">
    <div className="contact-content">
      <h2 className="contact-title">יצירת קשר</h2>
      <p className="contact-subtitle">אשמח לענות על כל שאלה ולהיות איתך בקשר</p>
      <div className="contact-links">
        <a 
          href="https://wa.me/972546588503" 
          target="_blank"
          rel="noopener noreferrer"
          className="contact-link whatsapp"
        >
          <WhatsAppIcon className="contact-icon" />
          <span>054-6588503</span>
        </a>
        <a 
          href="mailto:orshebach@gmail.com"
          className="contact-link"
        >
          <Mail className="contact-icon" />
          <span>orshebach@gmail.com</span>
        </a>
        <a 
          href="https://instagram.com/yael_corsia"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-link"
        >
          <Instagram className="contact-icon" />
          <span>yael_corsia</span>
        </a>
      </div>
    </div>
  </section>
);

// Footer Component
const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <p>© 2025 האור שבך - יעל כורסיה | כל הזכויות שמורות</p>
    </div>
  </footer>
);

// Notification Component
const Notification = ({ showNotification }) => {
  if (!showNotification) return null;
  return (
    <div className="notification">
      ✓ נוסף לסל בהצלחה!
    </div>
  );
};

// Main Layout Component
const Layout = ({ children, state }) => {
  const {
    cart, isCartOpen, setIsCartOpen,
    showNotification, selectedProduct, setSelectedProduct,
    showBulkPopup, setShowBulkPopup,
    getTotalItems, getTotalPrice, updateQuantity, handleCheckout, addToCart
  } = state;

  return (
    <div className="website-container" dir="rtl">
      <Header 
        getTotalItems={getTotalItems} 
        setIsCartOpen={setIsCartOpen}
        isCartOpen={isCartOpen}
      />
      
      <ProductModal 
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        addToCart={addToCart}
        setShowBulkPopup={setShowBulkPopup}
      />
      
      <CartSidebar 
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cart={cart}
        updateQuantity={updateQuantity}
        getTotalPrice={getTotalPrice}
        handleCheckout={handleCheckout}
        setShowBulkPopup={setShowBulkPopup}
      />
      
      <BulkOrderPopup 
        isOpen={showBulkPopup}
        onClose={() => setShowBulkPopup(false)}
      />
      
      {children}
      
      <ContactSection />
      <Footer />
      <Notification showNotification={showNotification} />
    </div>
  );
};

// App Content Component (inside Router)
const AppContent = () => {
  const state = useSharedState();
  const {
    products, bundles, pickupPoints, lessons, events,
    addToCart, setSelectedProduct,
    expandedPickup, setExpandedPickup
  } = state;

  return (
    <Layout state={state}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={
          <ShopPage 
            products={products}
            bundles={bundles}
            pickupPoints={pickupPoints}
            addToCart={addToCart}
            setSelectedProduct={setSelectedProduct}
            expandedPickup={expandedPickup}
            setExpandedPickup={setExpandedPickup}
          />
        } />
        <Route path="/subscribe" element={<SubscribePage />} />
        <Route path="/lessons" element={<LessonsPage lessons={lessons} />} />
        <Route path="/events" element={<EventsPage events={events} />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Layout>
  );
};

// Main App Component
export default function HaOrShebachWebsite() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
