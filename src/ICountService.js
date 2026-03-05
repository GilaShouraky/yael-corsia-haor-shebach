// ICountService.js - Card validation utilities

export const validateCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  let sum = 0;
  let isEven = false;
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);
    if (isEven) { digit *= 2; if (digit > 9) digit -= 9; }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
};

export const validateCVV = (cvv) => /^\d{3,4}$/.test(cvv);

export const validateExpiry = (month, year) => {
  if (!/^\d{2}$/.test(month) || !/^\d{2}$/.test(year)) return false;
  const expMonth = parseInt(month, 10);
  const expYear = parseInt(year, 10);
  if (expMonth < 1 || expMonth > 12) return false;
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) return false;
  return true;
};

export const getCardType = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (/^4/.test(cleaned)) return 'Visa';
  if (/^5[1-5]/.test(cleaned)) return 'MasterCard';
  if (/^3[47]/.test(cleaned)) return 'American Express';
  if (/^2/.test(cleaned)) return 'Isracard';
  return 'Unknown';
};

export default { validateCardNumber, validateCVV, validateExpiry, getCardType };
