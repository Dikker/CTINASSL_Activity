import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
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
import Navbar from '../components/NavBar';
import { CART_KEY, readStorage, saveStorage, money } from '../data/commerce';
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
    colors: [
      { label: 'Washed Black', hex: '#111111' },
      { label: 'Optic White', hex: '#eeeeee' },
      { label: 'Charcoal', hex: '#777777' },
    ],
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
    colors: [
      { label: 'Jet Black', hex: '#111111' },
      { label: 'Optic White', hex: '#eeeeee' },
    ],
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
    colors: [
      { label: 'Optic White', hex: '#eeeeee' },
      { label: 'Jet Black', hex: '#111111' },
    ],
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
    colors: [
      { label: 'Matte Black', hex: '#111111' },
      { label: 'Slate Grey', hex: '#777777' },
    ],
    features: ['Lightweight Fabric', 'Relaxed Fit', 'Utility Style'],
  },
];

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

  const addItemToStorage = () => {
    const currentCart = readStorage(CART_KEY, []);
    const chosenColor = product.colors[selectedColor]?.label || product.color;

    const existingItem = currentCart.find(
      (item) =>
        item.id === product.id &&
        item.size === selectedSize &&
        item.color === chosenColor
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
        color: chosenColor,
        quantity,
      });
    }

    saveStorage(CART_KEY, currentCart);
  };

  const handleAddToCart = () => {
    addItemToStorage();
  };

  const handleBuyNow = () => {
    addItemToStorage();
    navigate('/checkout');
  };

  return (
    <div className="pd-page">
      <Navbar />

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
            {product.colors.map((colorObj, index) => (
              <button
                key={colorObj.label}
                className={selectedColor === index ? 'selected' : ''}
                style={{ backgroundColor: colorObj.hex }}
                onClick={() => setSelectedColor(index)}
                aria-label={`Select color ${colorObj.label}`}
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

          <button className="pd-add-cart" onClick={handleAddToCart}>
            <ShoppingCart />
            ADD TO CART
          </button>

          <button className="pd-buy-now" onClick={handleBuyNow}>
            BUY NOW <ArrowRight />
          </button>

          <div className="pd-accordions">
            {[
              { key: 'shipping', label: 'Shipping Information', Icon: Truck },
              { key: 'returns', label: 'Returns & Exchanges', Icon: RefreshCw },
            ].map(({ key, label, Icon }) => (
              <div className="pd-accordion" key={key}>
                <button onClick={() => setExpandedInfo(expandedInfo === key ? '' : key)}>
                  <Icon />
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