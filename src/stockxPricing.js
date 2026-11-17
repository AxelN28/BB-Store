const pricesByProduct = {
  response: { '6.5': 193, '9.5': 176, '10': 175, '11.5': 185, '12': 197 },
  campus: { '6.5': 182, '9': 127, '9.5': 119, '10': 119, '10.5': 95, '11': 105, '11.5': 88, '12': 122 },
  forum: { '6.5': 819, '9.5': 1948, '10': 948, '10.5': 1500, '12': 1050 },
};

const usd = new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'USD', currencyDisplay: 'code', maximumFractionDigits: 0,
});

const cop = new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP', currencyDisplay: 'code', maximumFractionDigits: 0,
});

export function getSizePrice(productId, size) {
  return pricesByProduct[productId]?.[size] ?? null;
}

export function getStockxLink(url, size) {
  if (!size) return url;
  const link = new URL(url);
  link.searchParams.set('size', size);
  return link.href;
}

export function formatPrice(amount, currency = 'USD') {
  return (currency === 'COP' ? cop : usd).format(amount);
}
