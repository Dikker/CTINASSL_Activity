import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Navbar from '../components/NavBar';
import './HomePage.css';

const HERO_SLIDES = [
  {
    index: '01',
    eyebrow: 'STREETWEAR REDEFINED',
    title: 'PARADOX',
    subtitle: 'WEAR THE DIFFERENCE.',
    highlight: 'all',
  },
  {
    index: '02',
    eyebrow: 'DROP 01 // HEAVYWEIGHT',
    title: 'PARADOX',
    subtitle: 'OVERSIZED GRAPHIC TEE.',
    highlight: 'tee',
  },
  {
    index: '03',
    eyebrow: 'DROP 02 // OUTERWEAR',
    title: 'PARADOX',
    subtitle: 'CORE ORBIT HOODIE.',
    highlight: 'hoodie',
  },
  {
    index: '04',
    eyebrow: 'DROP 03 // HEADWEAR',
    title: 'PARADOX',
    subtitle: 'STRUCTURED DAD CAP.',
    highlight: 'cap',
  },
];

const FEATURED_PRODUCTS = [
  {
    id: 'oversized-tee',
    name: 'Paradox Oversized Tee',
    variant: 'Washed Black',
    price: '₱799.00',
    type: 'tee-black',
  },
  {
    id: 'orbit-hoodie',
    name: 'Paradox Orbit Hoodie',
    variant: 'Jet Black',
    price: '₱1,499.00',
    type: 'hoodie-black',
  },
  {
    id: 'essential-white-tee',
    name: 'Paradox Essential Tee',
    variant: 'Optic White',
    price: '₱799.00',
    type: 'tee-white',
  },
  {
    id: 'tech-shorts',
    name: 'Paradox Tech Shorts',
    variant: 'Matte Black',
    price: '₱899.00',
    type: 'shorts-black',
  },
];

const PRODUCT_IMAGES = {
  'tee-black': '/images/shirt-front.png',
  'hoodie-black': '/images/hoodie-black.png',
  'tee-white': '/images/shirt-white.png',
  'cap-black': '/images/cap-black.png',
  'shorts-black': '/images/shorts-black.png',
};

function ApparelPlaceholder({ type, alt = 'Paradox Apparel' }) {
  return (
    <img
      src={PRODUCT_IMAGES[type] || '/images/shirt-front.png'}
      alt={alt}
      className="card-product-img"
    />
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [slideIdx, setSlideIdx] = useState(0);
  const currentSlide = HERO_SLIDES[slideIdx];

  const handlePrevSlide = () => {
    setSlideIdx((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setSlideIdx((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="home-page">
      {/* FULL-HEIGHT ANGLED WHITE DIAGONAL STRIPE */}
      <div className="hero-diagonal-stripe" aria-hidden="true" />

      {/* TOP NAVIGATION BAR */}
      <Navbar cartCount={0} overWhiteStripe={true} />

      {/* HERO SECTION */}
      <section className="hero-section">
        {/* Faint Left Background "R" Watermark */}
        <img
          src="/images/emblem-r.png"
          alt=""
          aria-hidden="true"
          className="hero-emblem-watermark"
        />

        <div className="hero-container">
          {/* LEFT HERO COPY & CONTROLS */}
          <div className="hero-left">
            <p className="hero-eyebrow">{currentSlide.eyebrow}</p>
            <h1 className="hero-title">{currentSlide.title}</h1>
            <p className="hero-subtitle">{currentSlide.subtitle}</p>

            <button
              type="button"
              className="hero-cta-btn"
              onClick={() => navigate('/product')}
            >
              <span>SHOP NOW</span>
              <ChevronRight size={16} strokeWidth={2.2} />
            </button>

            {/* SLIDE COUNTER & ARROWS (01 / 04) */}
            <div className="hero-slider-controls">
              <div className="slide-counter">
                <span className="slide-current">{currentSlide.index}</span>
                <span className="slide-total"> / 04</span>
              </div>

              <div className="slide-progress-track">
                <div
                  className="slide-progress-fill"
                  style={{ width: `${((slideIdx + 1) / 4) * 100}%` }}
                />
              </div>

              <div className="slide-arrows">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  aria-label="Previous slide"
                  className="slide-arrow-btn"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  aria-label="Next slide"
                  className="slide-arrow-btn"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT HERO LAYERED APPAREL COLLAGE */}
          <div className="hero-right">
            <div
              className={`collage-item collage-hoodie ${
                currentSlide.highlight === 'hoodie' ? 'is-focused' : ''
              }`}
              onClick={() => navigate('/product')}
            >
              <ApparelPlaceholder type="hoodie-black" alt="Paradox Orbit Hoodie" />
            </div>

            <div
              className={`collage-item collage-tee ${
                currentSlide.highlight === 'tee' ? 'is-focused' : ''
              }`}
              onClick={() => navigate('/product')}
            >
              <img
                src="/images/shirt-front.png"
                alt="Paradox Oversized Tee"
                className="collage-tee-img"
              />
            </div>

            <div
              className={`collage-item collage-cap ${
                currentSlide.highlight === 'cap' ? 'is-focused' : ''
              }`}
              onClick={() => navigate('/product')}
            >
              <ApparelPlaceholder type="cap-black" alt="Paradox Structured Dad Cap" />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section id="featured" className="featured-section">
        <div className="featured-header">
          {/* 4-Point Star Accent */}
          <svg
            className="featured-star-icon"
            viewBox="0 0 48 48"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M24 2 C25 18, 30 23, 46 24 C30 25, 25 30, 24 46 C23 30, 18 25, 2 24 C18 23, 23 18, 24 2 Z"
              fill="#555555"
            />
          </svg>

          <h2 className="featured-heading">FEATURED PRODUCTS</h2>

          <div className="featured-line" />

          <button
            type="button"
            className="view-all-btn"
            onClick={() => navigate('/product')}
          >
            <span>VIEW ALL</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* 4-COLUMN PRODUCT GRID */}
        <div className="featured-grid">
          {FEATURED_PRODUCTS.map((product) => (
            <article
              key={product.id}
              className="product-card"
              onClick={() => navigate('/product')}
            >
              <div className="product-card-media">
                <ApparelPlaceholder type={product.type} alt={product.name} />
              </div>

              <div className="product-card-info">
                <div className="product-card-meta">
                  <h3 className="product-card-title">{product.name}</h3>
                  <p className="product-card-variant">{product.variant}</p>
                </div>
                <span className="product-card-price">{product.price}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}