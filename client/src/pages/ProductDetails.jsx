
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  User,
  ArrowLeft,
  ArrowRight,
  Maximize,
  Truck,
  RefreshCw,
  Plus,
  Minus,
  ShoppingCart,
  Leaf,
  Shirt,
  Star,
} from 'lucide-react';
import './ProductDetails.css';

const products = [
  {
    id: 'oversized-tee',
    name: 'PARADOX OVERSIZED TEE',
    category: 'Tees',
    color: 'Washed Black',
    price: 799,
    image: '/images/shirt-front.png',
    description:
      'Step into the unknown. The Paradox Oversized Tee combines comfort and style, designed for those who wear more than just fashion - but a mindset.',
    colors: ['#111111', '#eeeeee', '#777777'],
    features: ['Premium Cotton', 'Oversized Fit', 'Long Lasting Print'],
  },
  {
    id: 'orbit-hoodie',
    name: 'PARADOX ORBIT HOODIE',
    category: 'Outerwear',
    color: 'Jet Black',
    price: 1499,
    image: '/images/hoodie-black.png',
    description:
      'A statement piece for everyday wear. The Paradox Orbit Hoodie brings together comfort, structure, and a distinct streetwear identity.',
    colors: ['#111111', '#eeeeee'],
    features: ['Premium Fabric', 'Relaxed Fit', 'Signature Graphic'],
  },
  {
    id: 'essential-white-tee',
    name: 'PARADOX ESSENTIAL TEE',
    category: 'Tees',
    color: 'Optic White',
    price: 799,
    image: '/images/shirt-white.png',
    description:
      'A clean essential built for everyday styling. Minimal in appearance, unmistakable in identity.',
    colors: ['#eeeeee', '#111111'],
    features: ['Soft Cotton', 'Regular Fit', 'Everyday Essential'],
  },
  {
    id: 'tech-shorts',
    name: 'PARADOX TECH SHORTS',
    category: 'Bottoms',
    color: 'Matte Black',
    price: 899,
    image: '/images/shorts-black.png',
    description:
      'Designed for movement and everyday comfort. The Paradox Tech Shorts complete your streetwear rotation.',
    colors: ['#111111', '#777777'],
    features: ['Lightweight Fabric', 'Relaxed Fit', 'Utility Style'],
  },
];

const money = (price) =>
  `\u20B1${price.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((item) => item.id === id) || products[0];
  const recommendations = products.filter((item) => item.id !== product.id);

  const [selectedSize, setSelectedSize] = useState('S');
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [expandedInfo, setExpandedInfo] = useState('');

  const galleryImages = [product.image, product.image, product.image, product.image];

  const addToCart = () => {
    const currentCart = JSON.parse(localStorage.getItem('paradox-cart') || '[]');

    const existingItem = currentCart.find(
      (item) =>
        item.id === product.id &&
        item.size === selectedSize &&
        item.color === product.colors[selectedColor]
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
        color: product.colors[selectedColor],
        quantity,
      });
    }

    localStorage.setItem('paradox-cart', JSON.stringify(currentCart));
    alert('Product added to your bag!');
  };

  return (
    <div className="pd-page">
      <header className="pd-header">
        <Link to="/home" className="pd-brand">PARADOX</Link>

        <nav className="pd-nav">
          <Link to="/home">Home</Link>
          <Link to="/shop" className="active">Shop</Link>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="pd-header-icons">
          <button aria-label="Search"><Search /></button>
          <button aria-label="Shopping bag" onClick={() => navigate('/cart')}>
            <ShoppingBag />
            <span className="pd-cart-count">
              {JSON.parse(localStorage.getItem('paradox-cart') || '[]')
                .reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </button>
          <button aria-label="Account" onClick={() => navigate('/')}>
            <User />
          </button>
        </div>
      </header>

      <div className="pd-breadcrumb">
        <Link to="/shop">Shop</Link>
        <span>{'\u203A'}</span>
        <span>{product.category}</span>
        <span>{'\u203A'}</span>
        <strong>{product.name.replace('PARADOX ', 'Paradox ')}</strong>
      </div>

      <main className="pd-main">
        <section className="pd-gallery">
          <div className="pd-thumbnails">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                className={selectedImage === index ? 'selected' : ''}
                onClick={() => setSelectedImage(index)}
                aria-label={`View product image ${index + 1}`}
              >
                <img src={image} alt={`${product.name} view ${index + 1}`} />
              </button>
            ))}
          </div>

          <div className="pd-main-image">
            <img src={galleryImages[selectedImage]} alt={product.name} />
            <button
              className="pd-expand"
              aria-label="View image"
              onClick={() => setSelectedImage((selectedImage + 1) % galleryImages.length)}
            >
              <Maximize />
            </button>
          </div>
        </section>

        <section className="pd-info">
          <div className="pd-decor-star">{'\u2726'}</div>

          <p className="pd-overline">PARADOX</p>
          <h1>{product.name}</h1>
          <p className="pd-price">{money(product.price)}</p>

          <div className="pd-divider" />

          <p className="pd-description">{product.description}</p>

          <div className="pd-features">
            <div><Leaf /><span>{product.features[0]}</span></div>
            <div><Shirt /><span>{product.features[1]}</span></div>
            <div><Star /><span>{product.features[2]}</span></div>
          </div>

          <div className="pd-divider" />

          <div className="pd-option-title">Color</div>
          <div className="pd-colors">
            {product.colors.map((color, index) => (
              <button
                key={color}
                className={selectedColor === index ? 'selected' : ''}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(index)}
                aria-label={`Select color ${index + 1}`}
              />
            ))}
          </div>

          <div className="pd-option-title">Size</div>
          <div className="pd-sizes">
            {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <button
                key={size}
                className={selectedSize === size ? 'selected' : ''}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="pd-quantity">
            <span>Quantity</span>
            <div>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus />
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>
                <Plus />
              </button>
            </div>
          </div>

          <button className="pd-add-cart" onClick={addToCart}>
            <ShoppingCart />
            ADD TO CART
          </button>

          <button className="pd-buy-now" onClick={addToCart}>
            BUY NOW <ArrowRight />
          </button>

          <div className="pd-accordions">
            {[
              ['shipping', 'Shipping Information', <Truck />],
              ['returns', 'Returns & Exchanges', <RefreshCw />],
            ].map(([key, label, icon]) => (
              <div className="pd-accordion" key={key}>
                <button onClick={() => setExpandedInfo(expandedInfo === key ? '' : key)}>
                  {icon}
                  <span>{label}</span>
                  <Plus className={expandedInfo === key ? 'rotated' : ''} />
                </button>
                {expandedInfo === key && (
                  <p>
                    {key === 'shipping'
                      ? 'Shipping arrangements and delivery timelines will be provided during checkout.'
                      : 'For returns and exchanges, please contact the PARADOX team.'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <section className="pd-recommendations">
        <div className="pd-section-heading">
          <h2>YOU MAY ALSO LIKE</h2>
          <span />
        </div>

        <div className="pd-recommendation-grid">
          {recommendations.map((item) => (
            <Link
              to={`/product/${item.id}`}
              className="pd-recommendation-card"
              key={item.id}
            >
              <div className="pd-recommendation-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="pd-recommendation-details">
                <span>{item.name}</span>
                <strong>{money(item.price)}</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="pd-side-star">{'\u2726'}</div>
    </div>
  );
}

