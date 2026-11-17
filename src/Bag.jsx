import { formatSize, getProductLink, getProductPrice } from './productPricing';
import { formatPrice } from './stockxPricing';

export default function Bag({ dialogRef, items, products, onChangeQuantity }) {
  return (
    <dialog ref={dialogRef} className="bag-dialog" aria-labelledby="bag-title">
      <header className="bag-header">
        <h2 id="bag-title">TU BOLSA</h2>
        <form method="dialog">
          <button className="bag-close" aria-label="Cerrar bolsa">✕</button>
        </form>
      </header>
      <BagContents items={items} products={products} onChangeQuantity={onChangeQuantity} />
      <a className="catalog-button bag-page-link" href="#bolsa" onClick={() => dialogRef.current.close()}>
        Abrir pagina de la bolsa
      </a>
    </dialog>
  );
}

export function BagContents({ items, products, onChangeQuantity }) {
  const lines = items.map((item) => {
    const product = products[item.productId];
    return { ...item, product, price: getProductPrice(item.productId, product, item.size) };
  });
  const subtotals = new Map();
  const hasUnpricedItems = lines.some(({ price }) => price === null);
  for (const { price, product, quantity } of lines) {
    if (price === null) continue;
    const currency = product.currency ?? 'USD';
    subtotals.set(currency, (subtotals.get(currency) ?? 0) + price * quantity);
  }

  return (
    <>

      {items.length === 0 ? (
        <p className="bag-empty">Tu bolsa esta vacia.</p>
      ) : (
        <>
          <ul className="bag-items">
            {lines.map(({ productId, size, quantity, product, price }) => {
              const { name, color } = product;
              const labelSize = formatSize(product, size);
              const referenceLink = getProductLink(product, size);
              const itemLabel = `${name}, ${labelSize}`;
              return (
                <li className="bag-item" key={`${productId}-${size}`}>
                  <div>
                    <h3>{name}</h3>
                    <p>{color} · {labelSize}</p>
                  </div>
                  <div className="bag-line-price">
                    {price === null ? (
                      referenceLink ? (
                        <a className="stockx-link" href={referenceLink} target="_blank" rel="noopener noreferrer">
                          Consultar en StockX
                        </a>
                      ) : <p>Precio no disponible</p>
                    ) : <p>{formatPrice(price * quantity, product.currency)}</p>}
                  </div>
                  <div className="bag-quantity">
                    <button type="button" aria-label={`Reducir cantidad de ${itemLabel}`}
                      onClick={() => onChangeQuantity(productId, size, -1)}>−</button>
                    <span aria-label="Cantidad">{quantity}</span>
                    <button type="button" aria-label={`Aumentar cantidad de ${itemLabel}`}
                      onClick={() => onChangeQuantity(productId, size, 1)}>+</button>
                  </div>
                  <button type="button" className="bag-remove" aria-label={`Quitar ${itemLabel}`}
                    onClick={() => onChangeQuantity(productId, size, -quantity)}>Quitar</button>
                </li>
              );
            })}
          </ul>
          {[...subtotals].map(([currency, amount]) => (
            <div className="bag-subtotal" key={currency}>
              <span>{hasUnpricedItems ? 'Subtotal de articulos con precio' : 'Subtotal de referencia'}</span>
              <strong>{formatPrice(amount, currency)}</strong>
            </div>
          ))}
          <p className="product-price-note">
            {hasUnpricedItems ? 'El subtotal solo incluye articulos con precio de referencia.'
              : 'Bolsa simulada. Los subtotales se muestran por moneda.'}
          </p>
        </>
      )}
    </>
  );
}
