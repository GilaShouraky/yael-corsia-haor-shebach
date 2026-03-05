const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxM_6IkceJWXbVfiRTlqIneb7jpl2olWfaQ4blTfU6BmKXk2MvWEfkCa6Elaqk_xzNF/exec';
const SMOOVE_API_KEY = '50f2b9e9-534f-49d5-8dc4-2b05ec90039c';
const SMOOVE_LIST_ID = 1117962;

const addToSmoove = async (customer, products) => {
  try {
    const response = await fetch('/.netlify/functions/smoove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        cellPhone: customer.phone,
        products,
      }),
    });
    if (response.ok) {
      console.log('✅ Smoove: איש קשר נוסף בהצלחה', customer.email);
    } else {
      console.error('❌ Smoove error:', response.status, await response.text());
    }
  } catch (err) {
    console.error('❌ Smoove error:', err);
  }
};



const saveOrderToSheets = async (orderData) => {
  try {
    const { customer, shipping, items, totalAmount } = orderData;
    const productNames = items.map(item => `${item.name} (x${item.quantity})`).join(', ');

    const shippingDetails = shipping.deliveryMethod === 'delivery'
      ? `משלוח עד הבית | כתובת: ${shipping.address}, ${shipping.city}, מיקוד: ${shipping.zipCode}`
      : `איסוף עצמי | נקודת איסוף: ${shipping.pickupLocation}`;

    const payload = {
      sheet: 'רכישות',
      date: new Date().toLocaleDateString('he-IL'),
      products: productNames,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      idNumber: customer.idNumber,
      shipping: shippingDetails,
      totalAmount: '₪' + (totalAmount || ''),
      notes: shipping.notes || '',
    };

    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('Error saving order:', err);
  }
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ArrowRight, ShoppingBag, X, CheckCircle, AlertCircle, Tag } from 'lucide-react';
import './PaymentICount.css';
import { validateCardNumber, validateCVV, validateExpiry } from './ICountService';
import { detectBundleDiscount, getBundleMessage } from './bundleDetection';

const CheckoutPage = ({ cart, getTotalPrice, setCart, pickupPoints, updateQuantity, bundles, products }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idNumber: '',
  });

  const [shippingData, setShippingData] = useState({
    deliveryMethod: 'delivery',
    address: '',
    city: '',
    zipCode: '',
    pickupLocation: '',
    notes: ''
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    installments: '1',
  });

  const [validationErrors, setValidationErrors] = useState({});

  const formatCardNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    const groups = numbers.match(/.{1,4}/g);
    return groups ? groups.join(' ') : numbers;
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const formatted = formatCardNumber(value);
      if (formatted.replace(/\s/g, '').length <= 16) {
        setPaymentData(prev => ({ ...prev, [name]: formatted }));
      }
    } else if (name === 'cvv') {
      if (/^\d{0,4}$/.test(value)) {
        setPaymentData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'expiryMonth' || name === 'expiryYear') {
      if (/^\d{0,2}$/.test(value)) {
        setPaymentData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setPaymentData(prev => ({ ...prev, [name]: value }));
    }

    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const errors = {};

    if (!customerData.firstName.trim()) errors.firstName = 'שם פרטי חובה';
    if (!customerData.lastName.trim()) errors.lastName = 'שם משפחה חובה';
    if (!customerData.email.trim()) errors.email = 'אימייל חובה';
    else if (!/\S+@\S+\.\S+/.test(customerData.email)) errors.email = 'אימייל לא תקין';
    if (!customerData.phone.trim()) errors.phone = 'טלפון חובה';
    else if (!/^05\d{8}$/.test(customerData.phone.replace(/-/g, ''))) errors.phone = 'מספר טלפון לא תקין';
    if (!customerData.idNumber.trim()) errors.idNumber = 'ת.ז חובה (לחשבונית מס)';
    else if (!/^\d{9}$/.test(customerData.idNumber)) errors.idNumber = 'ת.ז לא תקינה';

    if (shippingData.deliveryMethod === 'delivery') {
      if (!shippingData.address.trim()) errors.address = 'כתובת חובה';
      if (!shippingData.city.trim()) errors.city = 'עיר חובה';
      if (!shippingData.zipCode.trim()) errors.zipCode = 'מיקוד חובה';
    } else {
      if (!shippingData.pickupLocation) errors.pickupLocation = 'בחר נקודת איסוף';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors = {};

    if (!validateCardNumber(paymentData.cardNumber.replace(/\s/g, ''))) {
      errors.cardNumber = 'מספר כרטיס לא תקין';
    }
    if (!paymentData.cardHolder.trim()) errors.cardHolder = 'שם בעל הכרטיס חובה';
    if (!validateExpiry(paymentData.expiryMonth, paymentData.expiryYear)) {
      errors.expiry = 'תוקף כרטיס לא תקין';
    }
    if (!validateCVV(paymentData.cvv)) {
      errors.cvv = 'CVV לא תקין';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const orderData = {
        customer: customerData,
        shipping: shippingData,
        items: cart,
        totalAmount: getTotalPrice(),
        payment: {
          ...paymentData,
          cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
        }
      };

      // Save order to sheets and Smoove
      await saveOrderToSheets({ customer: customerData, shipping: shippingData, items: cart, totalAmount: getTotalPrice() });
      await addToSmoove(customerData, cart.map(item => `${item.name} (x${item.quantity})`).join(', '));

      // Redirect to Meshulam payment
      const meshulamRes = await fetch('/.netlify/functions/meshulam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const meshulamData = await meshulamRes.json();

      if (meshulamData.success && meshulamData.url) {
        window.location.href = meshulamData.url;
      } else {
        setError(meshulamData.error || 'שגיאה ביצירת קישור תשלום');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('אירעה שגיאה בעיבוד התשלום. אנא נסה שנית.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && currentStep !== 3) {
    return (
      <div className="checkout-empty">
        <ShoppingBag size={64} />
        <h2>הסל ריק</h2>
        <p>אין מוצרים בסל הקניות</p>
        <button onClick={() => navigate('/shop')} className="back-to-shop-btn">
          חזרה לחנות
        </button>
      </div>
    );
  }

  return (
    <div className="icount-checkout-container">
      {/* Progress Steps */}
      <div className="checkout-progress">
        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
          <div className="step-circle">{currentStep <= 1 ? '1' : ''}</div>
          <span>פרטים</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
          <div className="step-circle">{currentStep <= 2 ? '2' : ''}</div>
          <span>תשלום</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
          <div className="step-circle">{currentStep <= 3 ? '3' : ''}</div>
          <span>אישור</span>
        </div>
      </div>

      {/* Step 1: Customer & Shipping Details */}
      {currentStep === 1 && (
        <div className="checkout-step-container">
          <div className="checkout-grid">
            <div className="checkout-main-section">
              <div className="section-header">
                <h2>פרטים אישיים</h2>
                <Lock size={20} />
              </div>

              <div className="form-section">
                <div className="form-row-2">
                  <div className="form-field">
                    <label>שם פרטי *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={customerData.firstName}
                      onChange={handleCustomerChange}
                      className={validationErrors.firstName ? 'error' : ''}
                      placeholder="הכנס שם פרטי"
                    />
                    {validationErrors.firstName && <span className="error-text">{validationErrors.firstName}</span>}
                  </div>

                  <div className="form-field">
                    <label>שם משפחה *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={customerData.lastName}
                      onChange={handleCustomerChange}
                      className={validationErrors.lastName ? 'error' : ''}
                      placeholder="הכנס שם משפחה"
                    />
                    {validationErrors.lastName && <span className="error-text">{validationErrors.lastName}</span>}
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label>אימייל *</label>
                    <input
                      type="email"
                      name="email"
                      value={customerData.email}
                      onChange={handleCustomerChange}
                      className={validationErrors.email ? 'error' : ''}
                      placeholder="example@email.com"
                    />
                    {validationErrors.email && <span className="error-text">{validationErrors.email}</span>}
                  </div>

                  <div className="form-field">
                    <label>טלפון *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerData.phone}
                      onChange={handleCustomerChange}
                      className={validationErrors.phone ? 'error' : ''}
                      placeholder="050-1234567"
                    />
                    {validationErrors.phone && <span className="error-text">{validationErrors.phone}</span>}
                  </div>
                </div>

                <div className="form-field">
                  <label>מספר ת.ז * (לחשבונית מס)</label>
                  <input
                    type="text"
                    name="idNumber"
                    value={customerData.idNumber}
                    onChange={handleCustomerChange}
                    className={validationErrors.idNumber ? 'error' : ''}
                    placeholder="123456789"
                    maxLength="9"
                  />
                  {validationErrors.idNumber && <span className="error-text">{validationErrors.idNumber}</span>}
                  <small className="field-hint">נדרש לצורך הנפקת חשבונית מס</small>
                </div>
              </div>

              <div className="section-header">
                <h2>אופן משלוח</h2>
              </div>

              <div className="delivery-options-grid">
                <label className={`delivery-card ${shippingData.deliveryMethod === 'delivery' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="delivery"
                    checked={shippingData.deliveryMethod === 'delivery'}
                    onChange={handleShippingChange}
                  />
                  <div className="delivery-card-content">
                    <div className="delivery-icon">🚚</div>
                    <strong>משלוח עד הבית</strong>
                    <span>3-5 ימי עסקים</span>
                  </div>
                </label>

                <label className={`delivery-card ${shippingData.deliveryMethod === 'pickup' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="pickup"
                    checked={shippingData.deliveryMethod === 'pickup'}
                    onChange={handleShippingChange}
                  />
                  <div className="delivery-card-content">
                    <div className="delivery-icon">📍</div>
                    <strong>איסוף עצמי</strong>
                    <span>ללא עלות נוספת</span>
                  </div>
                </label>
              </div>

              {shippingData.deliveryMethod === 'delivery' ? (
                <div className="form-section">
                  <div className="form-field">
                    <label>כתובת *</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingData.address}
                      onChange={handleShippingChange}
                      className={validationErrors.address ? 'error' : ''}
                      placeholder="רחוב ומספר בית"
                    />
                    {validationErrors.address && <span className="error-text">{validationErrors.address}</span>}
                  </div>

                  <div className="form-row-2">
                    <div className="form-field">
                      <label>עיר *</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingData.city}
                        onChange={handleShippingChange}
                        className={validationErrors.city ? 'error' : ''}
                        placeholder="תל אביב"
                      />
                      {validationErrors.city && <span className="error-text">{validationErrors.city}</span>}
                    </div>

                    <div className="form-field">
                      <label>מיקוד *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingData.zipCode}
                        onChange={handleShippingChange}
                        className={validationErrors.zipCode ? 'error' : ''}
                        placeholder="1234567"
                      />
                      {validationErrors.zipCode && <span className="error-text">{validationErrors.zipCode}</span>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="form-section">
                  <div className="form-field">
                    <label>נקודת איסוף *</label>
                    <select
                      name="pickupLocation"
                      value={shippingData.pickupLocation}
                      onChange={handleShippingChange}
                      className={validationErrors.pickupLocation ? 'error' : ''}
                    >
                      <option value="">בחרי נקודת איסוף...</option>
                      {pickupPoints && pickupPoints.length > 0 ? (
                        pickupPoints.map((region, regionIndex) => (
                          <optgroup key={regionIndex} label={region.area}>
                            {region.locations && region.locations.map((location, locIndex) => (
                              <option 
                                key={`${regionIndex}-${locIndex}`} 
                                value={`${location.city} - ${location.location}`}
                              >
                                {location.city} - {location.location}
                              </option>
                            ))}
                          </optgroup>
                        ))
                      ) : (
                        <>
                          <option value="petach-tikva">פתח תקווה - דגל ראובן 27</option>
                          <option value="ramat-gan">רמת גן - מבצע עין 9</option>
                        </>
                      )}
                    </select>
                    {validationErrors.pickupLocation && <span className="error-text">{validationErrors.pickupLocation}</span>}
                  </div>
                </div>
              )}

              <div className="form-section">
                <div className="form-field">
                  <label>הערות להזמנה (אופציונלי)</label>
                  <textarea
                    name="notes"
                    value={shippingData.notes}
                    onChange={handleShippingChange}
                    rows="3"
                    placeholder="הערות מיוחדות..."
                  />
                </div>
              </div>

              <button onClick={handleContinueToPayment} className="continue-btn">
                המשך לתשלום
                <ArrowRight size={20} />
              </button>
            </div>

            <OrderSummary cart={cart} getTotalPrice={getTotalPrice} updateQuantity={updateQuantity} bundles={bundles} />
          </div>
        </div>
      )}

      {/* Step 2: Payment */}
      {currentStep === 2 && (
        <div className="checkout-step-container">
          <div className="checkout-grid">
            <div className="checkout-main-section">
              <div className="section-header">
                <h2>פרטי תשלום</h2>
                <Lock size={20} className="secure-icon" />
              </div>

              {error && (
                <div className="alert alert-error">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmitPayment}>
                <div className="payment-card-visual">
                  <div className="card-chip"></div>
                  <div className="card-number-display">
                    {paymentData.cardNumber || '•••• •••• •••• ••••'}
                  </div>
                  <div className="card-holder-display">
                    {paymentData.cardHolder || 'שם בעל הכרטיס'}
                  </div>
                  <div className="card-expiry-display">
                    {paymentData.expiryMonth && paymentData.expiryYear 
                      ? `${paymentData.expiryMonth}/${paymentData.expiryYear}` 
                      : 'MM/YY'}
                  </div>
                </div>

                <div className="form-section">
                  <div className="form-field">
                    <label>מספר כרטיס *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handlePaymentChange}
                      className={validationErrors.cardNumber ? 'error' : ''}
                      dir="ltr"
                      style={{ textAlign: 'left' }}
                      placeholder="1234 5678 9012 3456"
                    />
                    {validationErrors.cardNumber && <span className="error-text">{validationErrors.cardNumber}</span>}
                  </div>

                  <div className="form-field">
                    <label>שם בעל הכרטיס *</label>
                    <input
                      type="text"
                      name="cardHolder"
                      value={paymentData.cardHolder}
                      onChange={handlePaymentChange}
                      className={validationErrors.cardHolder ? 'error' : ''}
                      placeholder="כפי שמופיע בכרטיס"
                    />
                    {validationErrors.cardHolder && <span className="error-text">{validationErrors.cardHolder}</span>}
                  </div>

                  <div className="form-row-3">
                    <div className="form-field">
                      <label>חודש *</label>
                      <input
                        type="text"
                        name="expiryMonth"
                        value={paymentData.expiryMonth}
                        onChange={handlePaymentChange}
                        className={validationErrors.expiry ? 'error' : ''}
                        placeholder="MM"
                        maxLength="2"
                      />
                    </div>

                    <div className="form-field">
                      <label>שנה *</label>
                      <input
                        type="text"
                        name="expiryYear"
                        value={paymentData.expiryYear}
                        onChange={handlePaymentChange}
                        className={validationErrors.expiry ? 'error' : ''}
                        placeholder="YY"
                        maxLength="2"
                      />
                    </div>

                    <div className="form-field">
                      <label>CVV *</label>
                      <input
                        type="text"
                        name="cvv"
                        value={paymentData.cvv}
                        onChange={handlePaymentChange}
                        className={validationErrors.cvv ? 'error' : ''}
                        placeholder="123"
                        maxLength="4"
                      />
                    </div>
                  </div>
                  {validationErrors.expiry && <span className="error-text">{validationErrors.expiry}</span>}
                  {validationErrors.cvv && <span className="error-text">{validationErrors.cvv}</span>}

                  <div className="form-field">
                    <label>תשלומים</label>
                    <select
                      name="installments"
                      value={paymentData.installments}
                      onChange={handlePaymentChange}
                    >
                      <option value="1">תשלום אחד</option>
                      <option value="2">2 תשלומים</option>
                      <option value="3">3 תשלומים</option>
                      <option value="6">6 תשלומים</option>
                      <option value="12">12 תשלומים</option>
                    </select>
                  </div>
                </div>

                <div className="payment-buttons">
                  <button 
                    type="button" 
                    onClick={() => setCurrentStep(1)} 
                    className="back-btn"
                    disabled={isProcessing}
                  >
                    חזרה
                  </button>
                  <button 
                    type="submit" 
                    className="pay-btn"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="spinner"></div>
                        מעבד תשלום...
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        שלם ₪{getTotalPrice()}
                        <Lock size={16} />
                      </>
                    )}
                  </button>
                </div>

                <div className="secure-notice">
                  <Lock size={16} />
                  <span>תשלום מאובטח ומוצפן ע"י Meshulam</span>
                </div>
              </form>
            </div>

            <OrderSummary cart={cart} getTotalPrice={getTotalPrice} updateQuantity={updateQuantity} bundles={bundles} />
          </div>
        </div>
      )}

      {/* Step 3: Success */}
      {currentStep === 3 && (
        <div className="success-container">
          <div className="success-card">
            <div className="success-icon">
              <CheckCircle size={80} />
            </div>
            <h1>התשלום בוצע בהצלחה!</h1>
            <p className="success-subtitle">תודה על הרכישה מהאור שבך</p>
            
            <div className="success-details">
              <div className="detail-item">
                <span>סכום ששולם:</span>
                <strong>₪{getTotalPrice()}</strong>
              </div>
              <div className="detail-item">
                <span>חשבונית נשלחה ל:</span>
                <strong>{customerData.email}</strong>
              </div>
            </div>

            <div className="success-message">
              <p>קיבלנו את ההזמנה שלך!</p>
              <p>חשבונית מס ואישור תשלום נשלחו למייל.</p>
              <p>נחזור אלייך בקרוב בנוגע למשלוח.</p>
            </div>

            <div className="success-actions">
              <button onClick={() => navigate('/')} className="home-btn">
                חזרה לעמוד הבית
              </button>
              <button onClick={() => navigate('/shop')} className="shop-btn">
                חזרה לחנות
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OrderSummary = ({ cart, getTotalPrice, updateQuantity, bundles }) => {
  const { discount, matchedBundle } = (bundles && bundles.length > 0)
    ? detectBundleDiscount(cart, bundles)
    : { discount: 0, matchedBundle: null };
  const bundleMsg = getBundleMessage(matchedBundle, discount);

  const subtotal = cart.reduce((sum, item) => {
    const isNotebook = item.id === 2;
    const unitPrice = isNotebook && item.quantity >= 10 ? 30 : (item.salePrice || item.price);
    return sum + unitPrice * item.quantity;
  }, 0);

  const finalTotal = Math.max(0, subtotal - discount).toFixed(2);

  return (
    <div className="order-summary-sidebar">
      <h3>סיכום הזמנה</h3>
      
      <div className="summary-items">
        {cart.map((item) => {
          const isNotebook = item.id === 2;
          const unitPrice = isNotebook && item.quantity >= 10 ? 30 : (item.salePrice || item.price);
          
          return (
            <div key={item.id} className="summary-item">
              <div className="item-info">
                <h4>{item.name}</h4>
                <div className="checkout-quantity-controls">
                  <button 
                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
                {isNotebook && item.quantity >= 10 && (
                  <span className="special-price">מחיר מיוחד!</span>
                )}
              </div>
              <div className="item-price">
                ₪{(unitPrice * item.quantity).toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="summary-divider"></div>

      {bundleMsg && (
        <div className="bundle-discount-banner">
          <div className="bundle-discount-title">
            <Tag size={16} />
            <strong>{bundleMsg.title}</strong>
          </div>
          <p className="bundle-discount-msg">{bundleMsg.message}</p>
          <div className="bundle-savings-row">
            <span>הנחת מבצע:</span>
            <span className="bundle-savings-amount">-₪{discount.toFixed(2)}</span>
          </div>
        </div>
      )}

      {discount > 0 && (
        <div className="summary-row">
          <span>סכום לפני הנחה:</span>
          <span className="original-subtotal">₪{subtotal.toFixed(2)}</span>
        </div>
      )}

      <div className="summary-total">
        <span>סה"כ לתשלום</span>
        <span className="total-amount">₪{discount > 0 ? finalTotal : getTotalPrice()}</span>
      </div>

      <div className="payment-secure-badge">
        <Lock size={16} />
        <span>תשלום מאובטח</span>
      </div>
    </div>
  );
};

export default CheckoutPage;
