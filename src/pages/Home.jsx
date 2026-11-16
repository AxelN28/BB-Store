import StoreScene from '../showroom/StoreScene';

export default function Home() {
  return (
    <main className="store">

      {/* Showroom 3D */}
      <div className="scene">
        <StoreScene />
      </div>

      {/* Navigation */}
      <header className="navbar">

        <a href="#" className="logo">
          BENITO<span>.</span>
        </a>

        <nav>
          <a href="#collection">COLLECTION</a>
          <a href="#showroom">SHOWROOM</a>
          <a href="#about">ABOUT</a>
        </nav>

        <button className="cart-button">
          BAG (0)
        </button>

      </header>

      {/* Hero section */}
      <section className="hero">

        <p className="eyebrow">
          THE ART OF STREETWEAR — 001
        </p>

        <h1>
          BENITO
          <br />
          <span>STORE.</span>
        </h1>

        <p className="description">
          Beyond fashion. Beyond boundaries.
          A space where music, culture and
          streetwear become one experience.
        </p>

        <button className="explore-button">
          EXPLORE COLLECTION
          <span>→</span>
        </button>

      </section>

      {/* Footer */}
      <footer className="footer">
        <span>BENITO STORE © 2026</span>
        <span>BUILT FOR CULTURE.</span>
        <span>BOGOTÁ, COLOMBIA</span>
      </footer>

    </main>
  );
}
