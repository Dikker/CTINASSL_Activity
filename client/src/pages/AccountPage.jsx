import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  ShieldCheck,
  LogOut,
  ArrowUpRight,
  Check,
  ShoppingBag,
} from 'lucide-react';
import Navbar from '../components/NavBar';
import { ORDERS_KEY, CART_KEY, readStorage, money, cartCount } from '../data/commerce';
import './AccountPage.css';

const USER_KEY = 'paradox-user';
const ADDRESS_KEY = 'paradox-address';

const TABS = [
  { id: 'profile', label: 'PROFILE', index: '01', icon: User },
  { id: 'orders', label: 'ORDER HISTORY', index: '02', icon: Package },
  { id: 'address', label: 'DELIVERY ADDRESS', index: '03', icon: MapPin },
  { id: 'security', label: 'SECURITY', index: '04', icon: ShieldCheck },
];

export default function AccountPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [savedNotice, setSavedNotice] = useState('');

  const [profile, setProfile] = useState(() => {
    const stored = readStorage(USER_KEY, null);
    return {
      fullName: stored?.fullName || '',
      email: stored?.email || '',
      phone: stored?.phone || '',
      memberSince: stored?.memberSince || '2026',
    };
  });

  const [address, setAddress] = useState(() => {
    const stored = readStorage(ADDRESS_KEY, null);
    return {
      street: stored?.street || '',
      city: stored?.city || '',
      province: stored?.province || '',
      postalCode: stored?.postalCode || '',
    };
  });

  const [passwords, setPasswords] = useState({
    current: '',
    next: '',
    confirm: '',
  });
  const [passwordError, setPasswordError] = useState('');

  const orders = readStorage(ORDERS_KEY, []);
  const cartItems = readStorage(CART_KEY, []);

  const flashNotice = (message) => {
    setSavedNotice(message);
    setTimeout(() => setSavedNotice(''), 3000);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numeric = value.replace(/\D/g, '').slice(0, 11);
      setProfile((prev) => ({ ...prev, phone: numeric }));
      return;
    }
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    flashNotice('PROFILE DETAILS UPDATED.');
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    if (name === 'postalCode') {
      const numeric = value.replace(/\D/g, '').slice(0, 4);
      setAddress((prev) => ({ ...prev, postalCode: numeric }));
      return;
    }
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const saveAddress = (e) => {
    e.preventDefault();
    localStorage.setItem(ADDRESS_KEY, JSON.stringify(address));
    flashNotice('DEFAULT DELIVERY ADDRESS SAVED.');
  };

  const savePassword = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwords.next.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswords({ current: '', next: '', confirm: '' });
    flashNotice('PASSWORD UPDATED.');
  };

  const handleSignOut = () => {
    navigate('/');
  };

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  return (
    <main className="account-page">
      <Navbar cartCount={cartCount(cartItems)} />

      <section className="account-container">
        <header className="account-header">
          <div>
            <p className="account-eyebrow">PARADOX / MEMBER PORTAL</p>
            <h1 className="account-title">MY ACCOUNT</h1>
            <p className="account-subtitle">
              {profile.fullName
                ? `WELCOME BACK, ${profile.fullName.toUpperCase()}`
                : 'MANAGE YOUR IDENTITY, ORDERS, AND DELIVERY DETAILS.'}
            </p>
          </div>

          <div className="account-stats">
            <div className="account-stat-box">
              <span>ORDERS</span>
              <strong>{orders.length}</strong>
            </div>
            <div className="account-stat-box">
              <span>BAG ITEMS</span>
              <strong>{cartCount(cartItems)}</strong>
            </div>
            <div className="account-stat-box">
              <span>TOTAL SPENT</span>
              <strong>{money(totalSpent)}</strong>
            </div>
          </div>
        </header>

        {savedNotice && (
          <div className="account-toast" role="status">
            <Check size={15} />
            <span>{savedNotice}</span>
          </div>
        )}

        <div className="account-layout">
          <aside className="account-sidebar" aria-label="Account sections">
            <div className="account-member-card">
              <div className="account-avatar">
                {(profile.fullName || 'PRDX').slice(0, 2).toUpperCase()}
              </div>
              <div className="account-member-meta">
                <strong>{profile.fullName || 'PARADOX MEMBER'}</strong>
                <span>{profile.email || 'NO EMAIL SET'}</span>
                <small>MEMBER / {profile.memberSince}</small>
              </div>
            </div>

            <nav className="account-tabs">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={`account-tab-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="tab-index">{tab.index}</span>
                    <Icon size={16} />
                    <span className="tab-label">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            <button
              type="button"
              className="account-signout-btn"
              onClick={handleSignOut}
            >
              <LogOut size={15} />
              <span>SIGN OUT</span>
            </button>
          </aside>

          <section className="account-panel">
            {activeTab === 'profile' && (
              <div className="account-module">
                <div className="module-header">
                  <div>
                    <span className="module-index">01 / IDENTITY</span>
                    <h2>PERSONAL INFORMATION</h2>
                  </div>
                  <span className="module-tag">PRDX ID</span>
                </div>

                <form className="account-form" onSubmit={saveProfile}>
                  <div className="account-form-grid">
                    <label className="account-field">
                      <span>FULL NAME</span>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={profile.fullName}
                        onChange={handleProfileChange}
                        required
                      />
                    </label>

                    <label className="account-field">
                      <span>PHONE NUMBER (11 DIGITS)</span>
                      <input
                        type="tel"
                        name="phone"
                        inputMode="numeric"
                        pattern="[0-9]{11}"
                        maxLength={11}
                        placeholder="09XXXXXXXXX"
                        value={profile.phone}
                        onChange={handleProfileChange}
                      />
                    </label>

                    <label className="account-field field-span-2">
                      <span>EMAIL ADDRESS</span>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={profile.email}
                        onChange={handleProfileChange}
                        required
                      />
                    </label>
                  </div>

                  <div className="account-form-actions">
                    <button type="submit" className="account-primary-btn">
                      SAVE CHANGES
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="account-module">
                <div className="module-header">
                  <div>
                    <span className="module-index">02 / ARCHIVE</span>
                    <h2>ORDER HISTORY</h2>
                  </div>
                  <Link to="/track" className="module-link">
                    TRACK ORDER <ArrowUpRight size={14} />
                  </Link>
                </div>

                {orders.length === 0 ? (
                  <div className="account-empty">
                    <ShoppingBag size={28} strokeWidth={1.4} />
                    <h3>NO ORDERS RECORDED YET.</h3>
                    <p>
                      Once you complete a checkout, your PARADOX order receipts
                      and tracking references will appear here.
                    </p>
                    <Link to="/shop" className="account-primary-btn">
                      EXPLORE COLLECTION
                    </Link>
                  </div>
                ) : (
                  <div className="account-orders-list">
                    {orders.map((order) => (
                      <article className="account-order-card" key={order.id}>
                        <div className="order-card-top">
                          <div>
                            <span className="order-ref-label">ORDER REFERENCE</span>
                            <strong>{order.id}</strong>
                          </div>
                          <div>
                            <span className="order-ref-label">DATE</span>
                            <strong>
                              {new Date(order.date).toLocaleDateString('en-PH', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </strong>
                          </div>
                          <div>
                            <span className="order-ref-label">STATUS</span>
                            <span className="order-status-pill">{order.status}</span>
                          </div>
                          <div>
                            <span className="order-ref-label">TOTAL</span>
                            <strong>{money(order.total)}</strong>
                          </div>
                        </div>

                        <div className="order-card-items">
                          {order.items.map((item, idx) => (
                            <div className="order-mini-item" key={`${item.id}-${idx}`}>
                              <img src={item.image} alt={item.name} />
                              <div>
                                <span>{item.name}</span>
                                <small>
                                  SIZE {item.size} · QTY {item.quantity}
                                </small>
                              </div>
                              <strong>{money(item.price * item.quantity)}</strong>
                            </div>
                          ))}
                        </div>

                        <div className="order-card-footer">
                          <span>PAYMENT: {order.customer?.payment || 'COD'}</span>
                          <Link
                            to={`/track?order=${order.id}`}
                            className="order-track-link"
                          >
                            TRACK SHIPMENT <ArrowUpRight size={14} />
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'address' && (
              <div className="account-module">
                <div className="module-header">
                  <div>
                    <span className="module-index">03 / LOGISTICS</span>
                    <h2>DEFAULT DELIVERY ADDRESS</h2>
                  </div>
                  <span className="module-tag">PH SHIPPING</span>
                </div>

                <form className="account-form" onSubmit={saveAddress}>
                  <div className="account-form-grid">
                    <label className="account-field field-span-2">
                      <span>STREET ADDRESS / UNIT / BARANGAY</span>
                      <input
                        type="text"
                        name="street"
                        placeholder="House No., Street, Barangay"
                        value={address.street}
                        onChange={handleAddressChange}
                        required
                      />
                    </label>

                    <label className="account-field">
                      <span>CITY / MUNICIPALITY</span>
                      <input
                        type="text"
                        name="city"
                        placeholder="e.g. Manila"
                        value={address.city}
                        onChange={handleAddressChange}
                        required
                      />
                    </label>

                    <label className="account-field">
                      <span>PROVINCE / REGION</span>
                      <input
                        type="text"
                        name="province"
                        placeholder="e.g. Metro Manila"
                        value={address.province}
                        onChange={handleAddressChange}
                        required
                      />
                    </label>

                    <label className="account-field">
                      <span>POSTAL CODE</span>
                      <input
                        type="text"
                        name="postalCode"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="e.g. 1008"
                        value={address.postalCode}
                        onChange={handleAddressChange}
                        required
                      />
                    </label>
                  </div>

                  <div className="account-form-actions">
                    <button type="submit" className="account-primary-btn">
                      SAVE ADDRESS
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="account-module">
                <div className="module-header">
                  <div>
                    <span className="module-index">04 / CREDENTIALS</span>
                    <h2>PASSWORD & SECURITY</h2>
                  </div>
                  <span className="module-tag">ENCRYPTED</span>
                </div>

                <form className="account-form" onSubmit={savePassword}>
                  <div className="account-form-grid">
                    <label className="account-field field-span-2">
                      <span>CURRENT PASSWORD</span>
                      <input
                        type="password"
                        value={passwords.current}
                        onChange={(e) =>
                          setPasswords((p) => ({ ...p, current: e.target.value }))
                        }
                        required
                      />
                    </label>

                    <label className="account-field">
                      <span>NEW PASSWORD</span>
                      <input
                        type="password"
                        value={passwords.next}
                        onChange={(e) =>
                          setPasswords((p) => ({ ...p, next: e.target.value }))
                        }
                        required
                      />
                    </label>

                    <label className="account-field">
                      <span>CONFIRM NEW PASSWORD</span>
                      <input
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) =>
                          setPasswords((p) => ({ ...p, confirm: e.target.value }))
                        }
                        required
                      />
                    </label>
                  </div>

                  {passwordError && (
                    <p className="account-error">{passwordError}</p>
                  )}

                  <div className="account-form-actions">
                    <button type="submit" className="account-primary-btn">
                      UPDATE PASSWORD
                    </button>
                  </div>
                </form>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}