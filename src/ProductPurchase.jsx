import { useId, useState } from 'react';
import { formatSize, getProductLink, productPriceText } from './productPricing';

function PriceReference({ product, size }) {
  const link = getProductLink(product, size);
  let source;
  let action;

  if (product.stockxUrl) {
    source = <>Referencia de StockX · <time dateTime="2026-11-16">16 de noviembre de 2026</time></>;
    action = 'Ver precio en StockX';
  } else if (product.retailerUrl) {
    source = 'Precio publicado por FRSH Company';
    action = 'Ver en FRSH Company';
  } else if (link) {
    source = `Precio publicado por ${product.source}`;
    action = 'Ver referencia oficial';
  } else {
    source = 'Precio de referencia sin verificar';
  }

  return (
    <>
      <p className="product-price-note">{source}</p>
      {link && (
        <a className="stockx-link" href={link} target="_blank" rel="noopener noreferrer">{action} ↗</a>
      )}
    </>
  );
}

export default function ProductPurchase({ productId, product, size, quantity, onSizeChange, onAdd, showPrice = true }) {
  const fieldId = useId();
  const [added, setAdded] = useState(false);

  function submit(event) {
    event.preventDefault();
    if (!product.sizes.includes(size)) return;
    onAdd();
    setAdded(true);
  }

  return (
    <>
      <div className="product-pricing">
        {showPrice && <p className="product-price">{productPriceText(productId, product, size)}</p>}
        <PriceReference product={product} size={size} />
      </div>
      <form className="product-purchase" onSubmit={submit}>
        <label htmlFor={fieldId}>{product.stockxUrl ? 'Talla US' : 'Talla'}</label>
        <select id={fieldId} value={size} required onChange={(event) => {
          onSizeChange(event.target.value);
          setAdded(false);
        }}>
          <option value="" disabled>Selecciona una talla</option>
          {product.sizes.map((option) => (
            <option key={option} value={option}>{formatSize(product, option)}</option>
          ))}
        </select>
        <button className="product-button" type="submit" disabled={!size}>Agregar a la bolsa</button>
        <p className="bag-feedback" role="status">
          {added && quantity ? `${quantity} de talla ${formatSize(product, size)} en tu bolsa.` : ''}
        </p>
      </form>
    </>
  );
}
