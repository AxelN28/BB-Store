import { useEffect, useRef } from 'react';
import { products, sections } from './storeCatalog';
import ProductPurchase from './ProductPurchase';
import { productPriceText } from './productPricing';

export default function Catalog({ getPurchase, onViewProduct, onShowroom }) {
  const sectionRefs = useRef({});

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('catalog-section--visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.2 });

    Object.values(sectionRefs.current).forEach((section) => {
      if (section) observer.observe(section.querySelector('h2'));
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="catalog" aria-labelledby="page-title">
      <div className="catalog-heading">
        <h1 id="page-title" tabIndex={-1}>Coleccion</h1>
        <button className="catalog-button" type="button" onClick={onShowroom}>Ir a la exhibicion 3D ↗</button>
      </div>
      <nav className="catalog-sections" aria-label="Secciones del catalogo">
        {sections.map(({ id, label }) => (
          <button type="button" key={id} onClick={() => {
            const section = sectionRefs.current[id];
            section.scrollIntoView({ block: 'start' });
            section.querySelector('h2').focus({ preventScroll: true });
          }}>
            {label}
          </button>
        ))}
      </nav>
      {sections.map(({ id, label, products: ids }) => (
        <section className="catalog-section" key={id} aria-labelledby={`catalog-${id}`}
          ref={(section) => { sectionRefs.current[id] = section; }}>
          <h2 id={`catalog-${id}`} tabIndex={-1}>{label}</h2>
          <ul className="catalog-list">
            {ids.map((productId) => {
              const product = products[productId];
              const purchase = getPurchase(productId);
              return (
                <li className="catalog-row" key={productId}>
                  <div className="catalog-product">
                    <h3>{product.name}</h3>
                    <p className="product-color">{product.color}</p>
                    <p className="catalog-description">{product.description}</p>
                  </div>
                  <div className="catalog-actions">
                    <p className="catalog-price" aria-live="polite">{productPriceText(productId, product, purchase.size)}</p>
                    <button className="catalog-button" type="button" aria-label={`Ver en 3D · ${product.name}`}
                      onClick={() => onViewProduct(productId, id)}>Ver en 3D ↗</button>
                  </div>
                  <details className="catalog-purchase">
                    <summary>Elegir talla y agregar</summary>
                    <ProductPurchase productId={productId} product={product} {...purchase} showPrice={false} />
                  </details>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </section>
  );
}
