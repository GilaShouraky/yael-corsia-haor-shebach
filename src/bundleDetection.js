// bundleDetection.js
// Bundle logic:
// - Checks bundle2 (3 items) first, then bundle1 (2 items) with leftovers
// - Uses partial name matching to handle slight differences between sheet names

// Check if two product names refer to the same product (partial match)
const namesMatch = (cartName, bundleName) => {
  const a = String(cartName).trim().toLowerCase();
  const b = String(bundleName).trim().toLowerCase();
  if (a === b) return true;
  // Partial: one contains the other
  if (a.includes(b) || b.includes(a)) return true;
  // Check shared words (at least 2 significant words match)
  const wordsA = a.split(/[\s\-,]+/).filter(w => w.length > 1);
  const wordsB = b.split(/[\s\-,]+/).filter(w => w.length > 1);
  const shared = wordsA.filter(w => wordsB.includes(w));
  return shared.length >= 2;
};

const findCartItem = (cart, bundleItemName) =>
  cart.find(i => i.name && namesMatch(i.name, bundleItemName));

const countSets = (available, bundle, cart) => {
  const items = bundle.items || [];
  if (!items.length) return 0;
  let minSets = Infinity;
  for (const name of items) {
    const cartItem = findCartItem(cart, name);
    if (!cartItem) return 0;
    const qty = available[cartItem.name.trim()] ?? cartItem.quantity;
    if (qty < 1) return 0;
    minSets = Math.min(minSets, qty);
  }
  return minSets === Infinity ? 0 : minSets;
};

const oneSetPrice = (cart, bundle) => {
  let total = 0;
  for (const name of (bundle.items || [])) {
    const item = findCartItem(cart, name);
    if (item) total += (item.salePrice || item.price);
  }
  return total;
};

export const detectBundleDiscount = (cart, bundles) => {
  if (!cart?.length || !bundles?.length)
    return { discount: 0, matchedBundle: null, matchedBundles: [], sets: 0 };

  // Largest bundle first
  const sorted = [...bundles].sort((a, b) => (b.items?.length || 0) - (a.items?.length || 0));

  // Build available quantities by actual cart item name
  const available = {};
  cart.forEach(item => { available[item.name.trim()] = item.quantity; });

  let totalDiscount = 0;
  const matchedBundles = [];

  for (const bundle of sorted) {
    const sets = countSets(available, bundle, cart);
    if (sets > 0) {
      const bundlePrice = parseFloat(bundle.price) || 0;
      const origPrice = oneSetPrice(cart, bundle);
      const discountPerSet = Math.max(0, origPrice - bundlePrice);
      totalDiscount += discountPerSet * sets;
      matchedBundles.push({ bundle, sets, saving: discountPerSet * sets });

      // Subtract used quantities
      for (const name of (bundle.items || [])) {
        const cartItem = findCartItem(cart, name);
        if (cartItem) {
          const key = cartItem.name.trim();
          available[key] = (available[key] || 0) - sets;
        }
      }
    }
  }

  const primary = matchedBundles[0] || null;
  return {
    discount: totalDiscount,
    matchedBundle: primary?.bundle || null,
    matchedBundles,
    sets: primary?.sets || 0,
  };
};

export const calculateTotalWithBundles = (cart, bundles, products) => {
  const { discount, matchedBundle, matchedBundles, sets } = detectBundleDiscount(cart, bundles);
  let total = 0;
  cart.forEach((item) => {
    const product = products?.find(p => p.id === item.id);
    const isNotebook = item.id === 2;
    const bulkMin = item.bulkMinimum || product?.bulkMinimum || 10;
    const bPrice = item.bulkPrice || product?.bulkPrice || 30;
    const unitPrice = isNotebook && item.quantity >= bulkMin
      ? bPrice
      : (item.salePrice || item.price || product?.salePrice || product?.price || 0);
    total += unitPrice * item.quantity;
  });
  return {
    total: Math.max(0, total - discount).toFixed(2),
    discount, matchedBundle, matchedBundles, sets,
  };
};

export const getBundleMessage = (matchedBundle, discount, sets = 1, matchedBundles = []) => {
  if (!discount) return null;

  if (matchedBundles.length > 1) {
    const parts = matchedBundles.map(({ bundle, sets: s }) =>
      s > 1 ? `×${s} ${bundle.name}` : bundle.name
    );
    return {
      headline: `🎁 מבצע משולב: ${parts.join(' + ')}`,
      savings: `חיסכון של ₪${discount.toFixed(0)}`,
      title: parts.join(' + '),
    };
  }

  const name = matchedBundle?.name || '';
  const bundlePrice = parseFloat(matchedBundle?.price) || 0;
  const headline = sets > 1
    ? `🎁 מבצע ×${sets}: ${name} — ₪${(bundlePrice * sets).toFixed(0)} בלבד!`
    : `🎁 מבצע: ${name} ב־₪${bundlePrice} בלבד!`;
  return {
    headline,
    savings: `חיסכון של ₪${discount.toFixed(0)}`,
    title: name,
  };
};

export default { detectBundleDiscount, calculateTotalWithBundles, getBundleMessage };
