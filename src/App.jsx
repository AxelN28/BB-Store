import { useState } from 'react';
import StoreScene from './showroom/StoreScene';

const products = {
  response: {
    name: 'ADIDAS RESPONSE CL',
    color: 'TRIPLE BLACK',
    price: 'COP $—',
    description: 'A bold silhouette built for everyday street culture.'
  },
  campus: {
    name: 'ADIDAS CAMPUS',
    color: 'BAD BUNNY CHULKY BROWN',
    price: 'COP $—',
    description: 'An expressive collaboration with a distinctive brown finish.'
  },
  forum: {
    name: 'ADIDAS FORUM LOW',
    color: 'BROWN',
    price: 'COP $—',
    description: 'A classic basketball silhouette reimagined.'
  }
};

function App() {
  const [entered, setEntered] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const selected = selectedProduct
    ? products[selectedProduct]
    : null;

  return (
    <main className={`store ${entered ? 'showroom-mode' : ''}`}>

      <div className="scene">
        <StoreScene
          entered={entered}
          selectedProduct={selectedProduct}
          onSelectProduct={setSelectedProduct}
        />
      </div>

      <header className="navbar">
        <a className="logo" href="#" onClick={(e) => {
          e.preventDefault();
          setSelectedProduct(null);
          setEntered(false);
        }}>
          BENITO<span>.</span>
        </a>

        <nav>
          <a href="#collection" onClick={() => {
            setEntered(true);
            setSelectedProduct(null);
          }}>COLLECTION</a>

          <a href="#about">ABOUT</a>
        </nav>

        <button className="cart-button">
          BAG (0)
        </button>
      </header>

      {!entered && (
        <section className="hero" id="explore">

          <p className="eyebrow">
            AN IMMERSIVE SNEAKER EXPERIENCE
          </p>

          <h1>
            STEP INTO
            <br />
            THE CULTURE<span>.</span>
          </h1>

          <p className="description">
            Explore the intersection of streetwear,
            music and sneaker culture.
          </p>

          <button
            className="explore-button"
            onClick={() => setEntered(true)}
          >
            EXPLORE THE STORE <span>↗</span>
          </button>

        </section>
      )}

      {entered && (
        <div className="showroom-label">
          <span>BENITO SHOWROOM</span>
          <span>SELECT A SNEAKER TO EXPLORE</span>
        </div>
      )}

      {selected && (
        <section className="product-panel">

          <button
            className="close-product"
            onClick={() => setSelectedProduct(null)}
          >
            ✕
          </button>

          <p className="eyebrow">BENITO COLLECTION / 001</p>

          <h2>{selected.name}</h2>

          <p className="product-color">{selected.color}</p>

          <p className="product-description">
            {selected.description}
          </p>

          <p className="product-price">{selected.price}</p>

          <button className="product-button">
            ADD TO BAG
          </button>

        </section>
      )}

      <footer className="footer">
        <span>BOGOTÁ, COLOMBIA</span>
        <span>CONCEPT STORE · 2026</span>
        <span>
          {entered ? 'INTERACTIVE SHOWROOM' : 'SCROLL TO EXPLORE ↓'}
        </span>
      </footer>

    </main>
  );
}

export default App;
