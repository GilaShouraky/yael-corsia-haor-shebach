import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Star, Sparkles, Heart, BookOpen, CheckCircle, Users, HelpCircle } from 'lucide-react';
import './ProductPage.css';

const getProductIcon = (product) => {
  const name = product?.name || '';
  if (name.includes('קלפ')) return Sparkles;
  if (name.includes('מחברת')) return Heart;
  if (name.includes('בובי')) return BookOpen;
  return null;
};

const ProductPage = ({ products, bundles, addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>המוצר לא נמצא</h2>
        <button onClick={() => navigate('/shop')} className="back-btn">
          חזרה לחנות
        </button>
      </div>
    );
  }

  const isNotebook = product.id === 2;
  const bulkMin = product.bulkMinimum || 10;
  const bulkPrice = product.bulkPrice || 30;
  const currentPrice = isNotebook && quantity >= bulkMin ? bulkPrice : (product.salePrice || product.price);
  const totalPrice = (currentPrice * quantity).toFixed(2);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  // Parse array fields safely
  const parseList = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try { return JSON.parse(val); } catch { return []; }
  };

  const whatsInside = parseList(product.whatsInside);
  const forWho = parseList(product.forWho);

  return (
    <div className="product-page-container">
      <div className="product-page-wrapper">
      <button onClick={() => navigate('/shop')} className="back-to-shop">
        <ArrowRight size={20} />
        חזרה לחנות
      </button>
      <div className="product-page-grid">
        {/* תמונה */}
        <div className="product-page-image-section">
          {product.image && product.image.startsWith('http') ? (
            <img src={product.image} alt={product.name} className="product-page-image" />
          ) : (
            <div className="product-page-emoji">✨</div>
          )}
        </div>

        {/* מידע */}
        <div className="product-page-info">
          <div className="product-page-header">
            <h1 className="product-page-title">{product.name}</h1>
            {(() => { const Icon = getProductIcon(product); return Icon ? <Icon size={28} className="product-icon-large" /> : null; })()}
          </div>

          {/* מחיר */}
          <div className="product-page-pricing">
            {product.salePrice ? (
              <>
                <span className="original-price-large">₪{product.price}</span>
                <span className="sale-price-large">₪{product.salePrice}</span>
                <span className="sale-badge-large">מבצע!</span>
              </>
            ) : (
              <span className="current-price-large">₪{product.price}</span>
            )}
          </div>

          {/* תיאור קצר */}
          {product.shortDescription && (
            <div className="product-page-description">
              <p>{product.shortDescription}</p>
            </div>
          )}

          {/* תיאור מלא */}
          {product.fullDescription && (
            <div className="product-full-description">
              <p>{product.fullDescription}</p>
            </div>
          )}

          {/* אודות הספר / מוצר */}
          {product.aboutBook && (
            <div className="product-about-book">
              <p>{product.aboutBook}</p>
            </div>
          )}

          {/* מה בערכה */}
          {whatsInside.length > 0 && (
            <div className="product-section-box">
              <h3 className="product-section-title">
                <CheckCircle size={18} />
                מה כולל המוצר
              </h3>
              <ul className="product-section-list">
                {whatsInside.map((item, i) => (
                  <li key={i}>
                    <CheckCircle size={14} className="list-icon-check" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* למי מתאים */}
          {forWho.length > 0 && (
            <div className="product-section-box">
              <h3 className="product-section-title">
                <Users size={18} />
                למי מתאים
              </h3>
              <ul className="product-section-list">
                {forWho.map((item, i) => (
                  <li key={i}>
                    <Heart size={14} className="list-icon-heart" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* איך זה עובד */}
          {product.howToUse && (
            <div className="product-section-box">
              <h3 className="product-section-title">
                <HelpCircle size={18} />
                איך זה עובד
              </h3>
              <p className="product-how-to-use">{product.howToUse}</p>
            </div>
          )}

          {/* מחיר כמות למחברת */}
          {isNotebook && (
            <div className="bulk-pricing-notice">
              <h3>💡 מחיר מיוחד לכמויות</h3>
              <p>קניית {bulkMin} יחידות ומעלה — <strong>₪{bulkPrice} ליחידה</strong></p>
              {quantity >= bulkMin && (
                <div className="bulk-active">✓ המחיר המיוחד חל על ההזמנה שלך!</div>
              )}
            </div>
          )}

          {/* כמות */}
          <div className="product-quantity-section">
            <label>כמות:</label>
            <div className="quantity-controls-large">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
              />
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <div className="total-price-display">
              <span>סה"כ:</span>
              <strong>₪{totalPrice}</strong>
            </div>
          </div>

          <button onClick={handleAddToCart} className="add-to-cart-large">
            <ShoppingCart size={20} />
            הוסף לסל — ₪{totalPrice}
          </button>

          {showSuccess && (
            <div className="add-success-message">
              ✓ המוצר נוסף לסל בהצלחה!
            </div>
          )}

          {/* קישור למוצר המקורי */}
          {product.link && (
            <a href={product.link} target="_blank" rel="noopener noreferrer" className="product-original-link">
              לעמוד המוצר המקורי ←
            </a>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProductPage;
