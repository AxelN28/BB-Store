const storageKey = 'bb-store-bag';
export const sizes = Array.from({ length: 15 }, (_, index) => String(6 + index / 2));

export function loadBag(products) {
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey));
    if (Array.isArray(saved)) {
      return saved.filter((item) => item && Object.hasOwn(products, item.productId) &&
        products[item.productId].sizes?.includes(item.size) && Number.isSafeInteger(item.quantity) && item.quantity > 0);
    }
  } catch {
    // The bag can still be used when browser storage is unavailable.
  }
  return [];
}

export function saveBag(items) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  } catch {
    // Keep the current bag in memory if storage is unavailable.
  }
}

export function changeQuantity(items, productId, size, change) {
  const index = items.findIndex((item) => item.productId === productId && item.size === size);
  if (index === -1) {
    return change > 0 ? [...items, { productId, size, quantity: change }] : items;
  }

  const quantity = items[index].quantity + change;
  if (quantity <= 0) return items.filter((_, itemIndex) => itemIndex !== index);
  return items.map((item, itemIndex) => itemIndex === index ? { ...item, quantity } : item);
}
