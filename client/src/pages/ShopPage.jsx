import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import Navbar from '../components/NavBar';
import { FEATURED_PRODUCTS, PRODUCT_IMAGES } from '../data/product';
import './ShopPage.css';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState('All Products');
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const categories = ['All Products', 'T-Shirts', 'Hoodies', 'Bottoms'];

  const getCategory = (type) => {
    if (type.includes('tee')) return 'T-Shirts';
    if (type.includes('hoodie')) return 'Hoodies';
    if (type.includes('shorts')) return 'Bottoms';
    return 'Accessories';
  };

  const filteredProducts = useMemo(() => {
    return FEATURED_PRODUCTS.filter((product) => {
      const matchesCategory =
        category === 'All Products' ||
        getCategory(product.type) === category;

      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.variant.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const handleSearch = (value) => {
    setSearch(value);
    setSearchParams(value ? { search: value } : {});
  };

  return (
    <main className="shop-page">
      <Navbar />

      <section className="shop-intro">
        <p className="shop-eyebrow">PARADOX / COLLECTION 01</p>
        <h1>THE COLLECTION</h1>
        <p>Discover the pieces that define the PARADOX identity.</p>
      </section>

      <section className="shop-content">
        <div className="shop-toolbar">
          <div className="shop-categories">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? 'selected' : ''}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="shop-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
            />
          </label>
        </div>

        <div className="shop-results">
          <span>ALL PRODUCTS</span>
          <span>{filteredProducts.length} PRODUCTS</span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="shop-product-grid">
            {filteredProducts.map((product) => (
              <Link
                to={`/product/${product.id}`}
                className="shop-card"
                key={product.id}
              >
                <div className="shop-card-image">
                  {PRODUCT_IMAGES[product.type] && (
                    <img
                      src={PRODUCT_IMAGES[product.type]}
                      alt={product.name}
                    />
                  )}
                  <span className="shop-card-overlay">
                    VIEW PRODUCT <ArrowRight size={16} />
                  </span>
                </div>

                <div className="shop-card-details">
                  <div>
                    <h2>{product.name}</h2>
                    <p>{product.variant}</p>
                  </div>
                  <strong>{product.price}</strong>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="shop-empty">
            <h2>No products found.</h2>
            <p>Try another search or category.</p>
          </div>
        )}
      </section>
    </main>
  );
}
