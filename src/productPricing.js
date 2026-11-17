import { formatPrice, getSizePrice, getStockxLink } from './stockxPricing';

export function getProductPrice(productId, product, size) {
  if (product.kind) return product.price;
  return product.retailerUrl ? product.referencePriceUsd : getSizePrice(productId, size);
}

export function getProductLink(product, size) {
  if (product.kind) return product.sourceUrl;
  return product.retailerUrl ?? getStockxLink(product.stockxUrl, size);
}

export function formatSize(product, size) {
  if (size === 'Adjustable') return 'Ajustable';
  return product.kind || product.retailerUrl ? size : `US ${size}`;
}

export function productPriceText(productId, product, size) {
  if (!product.kind && !product.retailerUrl && !size) {
    return `Desde ${formatPrice(product.referencePriceUsd)}`;
  }

  const price = getProductPrice(productId, product, size);
  if (price !== null) return formatPrice(price, product.currency);
  return product.stockxUrl ? 'Consultar en StockX' : 'Precio no disponible';
}

