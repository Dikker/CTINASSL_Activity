
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

import Navbar from '../components/NavBar';
import { FEATURED_PRODUCTS, PRODUCT_IMAGES } from '../data/product';

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
    setSlideIdx((prev) =>
      prev === 0 ? HERO_SLIDES.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setSlideIdx((prev) =>
      prev === HERO_SLIDES.length - 1 ? 0 : prev + 1
    );
  };

  const scrollToProducts = () => {
    document.getElementById('featured')?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <div className="home-page">
      <div className="hero-diagonal-stripe" aria-hidden="true" />

      <Navbar cartCount={0} overWhiteStripe={true} />

      <section className="hero-section">
        <img
          src="/images/emblem-r.png"
          alt=""
          aria-hidden="true"
          className="hero-emblem-watermark"
        />

        <div className="hero-container">
          <div className="hero-left">
            <p className="hero-eyebrow">{currentSlide.eyebrow}</p>

            <h1 className="hero-title">{currentSlide.title}</h1>

            <p className="hero-subtitle">{currentSlide.subtitle}</p>

            <button
              type="button"
              className="hero-cta-btn"
              onClick={scrollToProducts}
            >
              <span>SHOP NOW</span>
              <ChevronRight size={16} strokeWidth={2.2} />
            </button>

            <div className="hero-slider-controls">
              <div className="slide-counter">
                <span className="slide-current">
                  {currentSlide.index}
                </span>
                <span className="slide-total"> / 04</span>
              </div>

              <div className="slide-progress-track">
                <div
                  className="slide-progress-fill"
                  style={{
                    width: `${((slideIdx + 1) / 4) * 100}%`,
                  }}
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

          <div className="hero-right">
            <div
              className={`collage-item collage-hoodie ${
                currentSlide.highlight === 'hoodie' ? 'is-focused' : ''
              }`}
              onClick={() => navigate('/product/orbit-hoodie')}
            >
              <ApparelPlaceholder
                type="hoodie-black"
                alt="Paradox Orbit Hoodie"
              />
            </div>

            <div
              className={`collage-item collage-tee ${
                currentSlide.highlight === 'tee' ? 'is-focused' : ''
              }`}
              onClick={() => navigate('/product/oversized-tee')}
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
            >
              <ApparelPlaceholder
                type="cap-black"
                alt="Paradox Structured Dad Cap"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="featured-section">
        <div className="featured-header">
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
            onClick={scrollToProducts}
          >
            <span>VIEW ALL</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="featured-grid">
          {FEATURED_PRODUCTS.map((product) => (
            <article
              key={product.id}
              className="product-card"
              onClick={() => navigate(`/product/${product.id}`)}
              role="link"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  navigate(`/product/${product.id}`);
                }
              }}
            >
              <div className="product-card-media">
                <ApparelPlaceholder
                  type={product.type}
                  alt={product.name}
                />
              </div>

              <div className="product-card-info">
                <div className="product-card-meta">
                  <h3 className="product-card-title">
                    {product.name}
                  </h3>

                  <p className="product-card-variant">
                    {product.variant}
                  </p>
                </div>

                <span className="product-card-price">
                  {product.price}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

