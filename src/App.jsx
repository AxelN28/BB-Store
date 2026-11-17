import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import Bag, { BagContents } from './Bag';
import Catalog from './Catalog';
import Contact from './Contact';
import ProductPurchase from './ProductPurchase';
import { apparelDisplays } from './apparelCatalog';
import { changeQuantity, loadBag, saveBag } from './bagState';
import { capDisplays } from './capCatalog';
import { products, sections } from './storeCatalog';
import cover from './assets/exhibicion.webp';
import SceneBoundary from './showroom/SceneBoundary';

const StoreScene = lazy(() => import('./showroom/StoreScene'));

function routeFromHash() {
  const hash = window.location.hash;
  if (hash.startsWith('#producto/') && Object.hasOwn(products, hash.slice(10))) {
    return hash.slice(1);
  }
  switch (hash) {
    case '#coleccion':
    case '#collection':
      return 'coleccion';
    case '#exhibicion':
      return 'exhibicion';
    case '#contacto':
      return 'contacto';
    case '#bolsa':
      return 'bolsa';
    case '#nosotros':
    case '#about':
      return 'nosotros';
    default:
      return 'inicio';
  }
}

function App() {
  const [view, setView] = useState(routeFromHash);
  const [section, setSection] = useState('sneakers');
  const [modelRequested, setModelRequested] = useState(null);
  const [sizesByProduct, setSizesByProduct] = useState({});
  const [flipped, setFlipped] = useState(false);
  const [bag, setBag] = useState(() => loadBag(products));
  const bagDialog = useRef(null);
  const store = useRef(null);
  const selectedProduct = view.startsWith('producto/') ? view.slice(9) : null;
  const entered = view === 'exhibicion' || (selectedProduct !== null && modelRequested === selectedProduct);
  const zone = selectedProduct
    ? sections.find(({ products: ids }) => ids.includes(selectedProduct)).id
    : section;
  const showProductBack = flipped !== Boolean(apparelDisplays[selectedProduct]?.showBack);

  useEffect(() => {
    const onHashChange = () => {
      setView(routeFromHash());
      setFlipped(false);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const element = store.current;
    element.scrollTop = 0;
    element.querySelector('#page-title, [data-view-title]')?.focus({ preventScroll: true });
  }, [view, entered]);

  useEffect(() => saveBag(bag), [bag]);
  const bagCount = bag.reduce((count, item) => count + item.quantity, 0);

  function navigate(nextView) {
    if (view !== nextView) setFlipped(false);
    setView(nextView);
    if (window.location.hash !== '#' + nextView) window.location.hash = nextView;
  }

  function selectProduct(productId) {
    setSection(zone);
    setModelRequested(productId);
    navigate(productId ? `producto/${productId}` : 'exhibicion');
  }

  function openShowroom(nextZone = 'sneakers', productId = null) {
    setSection(nextZone);
    setModelRequested(productId);
    navigate(productId ? `producto/${productId}` : 'exhibicion');
  }

  function updateBag(productId, itemSize, change) {
    setBag((items) => changeQuantity(items, productId, itemSize, change));
  }

  function getPurchase(productId) {
    const { sizes } = products[productId];
    const size = sizesByProduct[productId] ?? (sizes.length === 1 ? sizes[0] : '');
    return {
      size,
      quantity: bag.find((item) => item.productId === productId && item.size === size)?.quantity,
      onSizeChange: (nextSize) => setSizesByProduct((previous) => ({ ...previous, [productId]: nextSize })),
      onAdd: () => updateBag(productId, size, 1),
    };
  }

  const isDocument = !entered && view !== 'inicio';
  const selected = products[selectedProduct];
  const isApparel = Boolean(selected?.kind);
  const isCap = Boolean(selected?.retailerUrl);

  return (
    <main ref={store} className={`store${entered ? ' showroom-mode' : ''}${isDocument ? ' store--document' : ''}`}>
      {view === 'inicio' && <img className="hero-cover" src={cover} alt="" fetchPriority="high" width="1440" height="900" />}

      {entered && (
        <div className="scene">
          <SceneBoundary>
            <Suspense fallback={<p className="scene-status" role="status">Cargando exhibicion 3D...</p>}>
              <StoreScene entered selectedProduct={selectedProduct} onSelectProduct={selectProduct}
                zone={zone} showProductBack={showProductBack} />
            </Suspense>
          </SceneBoundary>
        </div>
      )}

      <header className="navbar">
        <a className="logo" href="#inicio" aria-label="Benito, inicio">BENITO<span>.</span></a>
        <nav aria-label="Menu principal">
          <a href="#coleccion" aria-current={view === 'coleccion' ? 'page' : undefined}>COLECCION</a>
          <a href="#nosotros" aria-current={view === 'nosotros' ? 'page' : undefined}>NOSOTROS</a>
          <a href="#contacto" aria-current={view === 'contacto' ? 'page' : undefined}>CONTACTO</a>
        </nav>
        <button className="cart-button" type="button" aria-haspopup="dialog" onClick={() => bagDialog.current.showModal()}>
          BOLSA <span className="bag-count" key={bagCount}>({bagCount})</span>
        </button>
      </header>

      {view === 'inicio' && (
        <section className="hero" aria-labelledby="hero-title">
          <p className="eyebrow">MODA, MUSICA Y CULTURA</p>
          <h1 id="hero-title" data-view-title tabIndex={-1}>ENTRA EN<br />LA CULTURA<span>.</span></h1>
          <p className="description">
            Explora una tienda virtual inspirada en Bad Bunny, sus giras y sus colaboraciones.
          </p>
          <button className="explore-button" type="button" onClick={() => openShowroom()}>
            EXPLORAR LA TIENDA <span>↗</span>
          </button>
        </section>
      )}

      {view === 'coleccion' && (
        <Catalog getPurchase={getPurchase}
          onViewProduct={(productId, productZone) => openShowroom(productZone, productId)}
          onShowroom={() => openShowroom()} />
      )}

      {view === 'nosotros' && (
        <section className="catalog about" aria-labelledby="page-title">
          <h1 id="page-title" tabIndex={-1}>Nosotros</h1>
          <p>Benito es una tienda conceptual creada como proyecto academico en Bogota, Colombia.</p>
          <p>La exhibicion 3D reune prendas, tenis y gorras inspirados en las giras y colaboraciones de Bad Bunny. La bolsa simula una compra.</p>
          <a className="catalog-button" href="#coleccion">Ver la coleccion ↗</a>
        </section>
      )}

      {view === 'contacto' && <Contact />}

      {view === 'bolsa' && (
        <section className="catalog bag-page" aria-labelledby="page-title">
          <div className="catalog-heading">
            <h1 id="page-title" tabIndex={-1}>Tu bolsa</h1>
            <a className="catalog-button" href="#coleccion">Seguir explorando la coleccion</a>
          </div>
          <BagContents items={bag} products={products} onChangeQuantity={updateBag} />
        </section>
      )}

      {view === 'exhibicion' && (
        <h1 className="visually-hidden" data-view-title tabIndex={-1}>Exhibicion 3D</h1>
      )}

      {entered && !isApparel && (
        <div className="showroom-label">
          <span>{zone === 'caps' ? 'NEW ERA · NUEVAYoL' : zone === 'apparel' ? 'ROPA' : 'EXHIBICION BENITO'}</span>
          {zone === 'caps' ? (
            <a className="showroom-collection-link" href="https://frshcompany.com/collections/bad-bunny-new-era"
              target="_blank" rel="noopener noreferrer">Ver la coleccion de New Era ↗</a>
          ) : <span>{zone === 'apparel' ? 'ELIGE UNA PRENDA' : 'ELIGE UN PAR DE TENIS'}</span>}
        </div>
      )}

      {entered && zone === 'caps' && !selected && (
        <nav className="display-product-controls" aria-label="Gorras en exhibicion">
          {Object.entries(capDisplays).map(([id, cap]) => (
            <button key={id} type="button" onClick={() => selectProduct(id)}>
              {cap.team === 'METS' ? 'Mets' : 'Yankees'} {cap.silhouette}
            </button>
          ))}
        </nav>
      )}

      {entered && zone === 'apparel' && !selected && (
        <nav className="display-product-controls display-product-controls--apparel" aria-label="Prendas en exhibicion">
          {Object.entries(apparelDisplays).map(([id, garment]) => (
            <button key={id} type="button" onClick={() => selectProduct(id)}>{garment.label}</button>
          ))}
        </nav>
      )}

      {entered && zone === 'sneakers' && !selected && (
        <nav className="display-product-controls" aria-label="Tenis en exhibicion">
          {sections.find(({ id }) => id === zone).products.map((id) => (
            <button key={id} type="button" onClick={() => selectProduct(id)}>{products[id].name}</button>
          ))}
        </nav>
      )}

      {entered && !selected && (
        <nav className="showroom-zones" aria-label="Secciones de la exhibicion">
          {sections.map(({ id, label }) => (
            <button key={id} type="button" aria-pressed={zone === id} onClick={() => openShowroom(id)}>{label}</button>
          ))}
        </nav>
      )}

      {selected && (
        <section className={!entered ? 'catalog detail-summary' :
          isCap || isApparel ? 'product-panel product-panel--wearable' : 'product-panel'}
          key={selectedProduct} aria-labelledby="detail-title">
          {entered && (
            <button className="close-product" type="button" aria-label="Cerrar ficha" onClick={() => selectProduct(null)}>
              ✕
            </button>
          )}
          <p className="eyebrow">
            {isApparel ? selected.source : isCap ? 'NEW ERA × BAD BUNNY × FRSH' : 'COLECCION BENITO'}
          </p>
          <h1 id="detail-title" data-view-title tabIndex={-1}>{selected.name}</h1>
          <p className="product-color">{selected.color}</p>
          {!isApparel && !isCap && <p className="product-description">{selected.description}</p>}
          {entered && (isCap || isApparel) && (
            <button className="product-view-button" type="button" onClick={() => setFlipped((back) => !back)}>
              {showProductBack ? 'Ver frente' : 'Ver parte trasera'}
            </button>
          )}
          <ProductPurchase productId={selectedProduct} product={selected} {...getPurchase(selectedProduct)} />
          {(isCap || isApparel) && <p className="product-description">{selected.description}</p>}
          {!entered && (
            <div className="detail-summary-links">
              <button className="catalog-button" type="button" onClick={() => setModelRequested(selectedProduct)}>
                Ver modelo en 3D
              </button>
              <a className="catalog-button" href="#coleccion">Volver a la coleccion</a>
            </div>
          )}
        </section>
      )}

      <Bag dialogRef={bagDialog} items={bag} products={products} onChangeQuantity={updateBag} />

      <footer className="footer">
        <span>BOGOTA, COLOMBIA</span>
        <span>TIENDA CONCEPTUAL · 2026</span>
        <a href="#contacto">CONTACTO</a>
      </footer>
    </main>
  );
}

export default App;
