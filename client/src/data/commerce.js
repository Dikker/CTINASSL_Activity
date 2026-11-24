export const CART_KEY = 'paradox-cart';
export const ORDERS_KEY = 'paradox-orders';
export const LAST_ORDER_KEY = 'paradox-last-order';

export const readStorage = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
};

export const saveStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event('paradox-storage-update'));
};

export const money = (amount) =>
  `₱${Number(amount || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const cartTotal = (items) =>
  items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

export const cartCount = (items) =>
  items.reduce((sum, item) => sum + Number(item.quantity), 0);
