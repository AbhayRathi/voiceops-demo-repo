// src/billing.js
// Demo billing module.

export function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function applyDiscount(total, discountPercent) {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('Invalid discount percentage');
  }
  return total * (1 - discountPercent / 100);
}

export function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}