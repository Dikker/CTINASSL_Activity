import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ cartCount = 0, overWhiteStripe = false }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={`store-navbar ${overWhiteStripe ? 'has-stripe' : ''}`}>
      <div className="navbar-inner">
        {/* LEFT: BRAND WORDMARK */}
        <Link to="/home" className="navbar-logo">
          PARADOX
        </Link>

        {/* CENTER: NAVIGATION LINKS */}
        <nav className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/product"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            Shop
          </NavLink>
          <a
            href="#featured"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </a>
          <a
            href="#featured"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </a>
        </nav>

        {/* RIGHT: UTILITY ICONS */}
        <div className="navbar-actions">
          <button
            type="button"
            className="nav-icon-btn"
            aria-label="Search products"
            onClick={() => navigate('/product')}
          >
            <Search size={18} strokeWidth={1.8} />
          </button>

          <button
            type="button"
            className="nav-icon-btn cart-btn"
            aria-label="Shopping cart"
            onClick={() => navigate('/cart')}
          >
            <ShoppingBag size={18} strokeWidth={1.8} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          <button
            type="button"
            className="nav-icon-btn"
            aria-label="Account"
            onClick={() => navigate('/')}
          >
            <User size={18} strokeWidth={1.8} />
          </button>

          <button
            type="button"
            className="nav-icon-btn mobile-menu-toggle"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}