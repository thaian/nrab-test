const CART_KEY = 'nrabCart';

const PRODUCT = {
  name: 'ChocoCookies NESTLÉ Recheio de Avelã 100g',
  info: '1x1 unidade • 100g',
  image: 'assets/product.png',
  originalPrice: 5.99
};

const PRICING = {
  originalPrice: 5.99,
  price5Percent: 5.69,
  price7Percent: 5.57
};

function formatBRL(value) {
  return 'R$ ' + value.toFixed(2).replace('.', ',');
}

/**
 * Tiered discount:
 * - Remainder units (1–9 per block): 5% off → R$ 5,69/un
 * - Each complete group of 10: 7% off → R$ 5,57/un
 * e.g. 11 = 10×5,57 + 1×5,69; 21 = 20×5,57 + 1×5,69
 */
function calculatePricing(quantity) {
  const qty = Math.max(0, Math.floor(quantity));

  if (qty < 1) {
    return {
      quantity: 0,
      unitsAt7Percent: 0,
      unitsAt5Percent: 0,
      subtotal: 0,
      savings: 0,
      averageUnitPrice: 0,
      originalTotal: 0
    };
  }

  const groupsOf10 = Math.floor(qty / 10);
  const remainder = qty % 10;
  const unitsAt7Percent = groupsOf10 * 10;
  const unitsAt5Percent = remainder;

  const subtotal =
    unitsAt7Percent * PRICING.price7Percent +
    unitsAt5Percent * PRICING.price5Percent;
  const originalTotal = qty * PRICING.originalPrice;
  const savings = originalTotal - subtotal;
  const averageUnitPrice = subtotal / qty;

  return {
    quantity: qty,
    unitsAt7Percent,
    unitsAt5Percent,
    subtotal,
    savings,
    averageUnitPrice,
    originalTotal
  };
}

function getCart() {
  try {
    const raw = sessionStorage.getItem(CART_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveCart(quantity) {
  const pricing = calculatePricing(quantity);
  if (pricing.quantity < 1) {
    sessionStorage.removeItem(CART_KEY);
    return null;
  }
  const cart = {
    ...PRODUCT,
    ...pricing
  };
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
}

function updateCartQuantity(quantity) {
  return saveCart(quantity);
}

function clearCart() {
  sessionStorage.removeItem(CART_KEY);
}
