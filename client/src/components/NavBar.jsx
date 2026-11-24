import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ cartCount = 0, overWhiteStripe = false }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `nav-link ${isActive ? 'active' : ''}`;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className={`store-navbar ${overWhiteStripe ? 'has-stripe' : ''}`}>
      <div className="navbar-inner">

        <Link to="/home" className="navbar-logo">
          PARADOX
        </Link>

        <nav className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
          <NavLink to="/home" className={navClass} onClick={closeMobileMenu}>
            Home
          </NavLink>

          <NavLink to="/shop" className={navClass} onClick={closeMobileMenu}>
            Shop
          </NavLink>

          <NavLink to="/about" className={navClass} onClick={closeMobileMenu}>
            About
          </NavLink>

          <NavLink to="/contact" className={navClass} onClick={closeMobileMenu}>
            Contact
          </NavLink>
        </nav>

        <div className="navbar-actions">
          <button
            type="button"
            className="nav-icon-btn"
            aria-label="Search products"
            onClick={() => navigate('/shop')}
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
            onClick={() => navigate('/account')}
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
