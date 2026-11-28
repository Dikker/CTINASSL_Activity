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
  Lock,
  Edit3,
  Eye,
  EyeOff,
} from 'lucide-react';
import Navbar from '../components/NavBar';
import ConfirmModal from '../components/ConfirmModal';
import OtpVerificationModal from '../components/OtpVerificationModal';
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
  const [signOutOpen, setSignOutOpen] = useState(false);

  const [profile, setProfile] = useState(() => {
    const stored = readStorage(USER_KEY, null);
    return {
      fullName: stored?.fullName || '',
      email: stored?.email || '',
      phone: stored?.phone || '',
      memberSince: stored?.memberSince || '2026',
    };
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState(profile);
  const [profileError, setProfileError] = useState('');

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
  const [showPass, setShowPass] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState('');

  const [otpChallenge, setOtpChallenge] = useState({
    open: false,
    mode: null,
  });

  const orders = readStorage(ORDERS_KEY, []);
  const cartItems = readStorage(CART_KEY, []);

  const flashNotice = (message) => {
    setSavedNotice(message);
    setTimeout(() => setSavedNotice(''), 3500);
  };

  const startProfileEdit = () => {
    setProfileDraft(profile);
    setProfileError('');
    setIsEditingProfile(true);
  };

  const cancelProfileEdit = () => {
    setProfileDraft(profile);
    setProfileError('');
    setIsEditingProfile(false);
  };

  const handleProfileDraftChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numeric = value.replace(/\D/g, '').slice(0, 11);
      setProfileDraft((prev) => ({ ...prev, phone: numeric }));
      return;
    }
    setProfileDraft((prev) => ({ ...prev, [name]: value }));
  };

  const requestProfileSave = (e) => {
    e.preventDefault();
    setProfileError('');

    if (!profileDraft.fullName.trim()) {
      setProfileError('Full name cannot be empty.');
      return;
    }

    if (!profileDraft.email.trim() || !profileDraft.email.includes('@')) {
      setProfileError('Enter a valid registered email address.');
      return;
    }

    if (profileDraft.phone && !/^09\d{9}$/.test(profileDraft.phone)) {
      setProfileError('Phone number must be 11 digits starting with 09.');
      return;
    }

    const hasChanges =
      profileDraft.fullName.trim() !== profile.fullName ||
      profileDraft.email.trim() !== profile.email ||
      profileDraft.phone !== profile.phone;

    if (!hasChanges) {
      setIsEditingProfile(false);
      return;
    }

    setOtpChallenge({ open: true, mode: 'profile' });
  };

  const passwordRules = {
    length: passwords.next.length >= 8,
    upper: /[A-Z]/.test(passwords.next),
    number: /\d/.test(passwords.next),
    special: /[^A-Za-z0-9]/.test(passwords.next),
  };

  const allPasswordRulesMet =
    passwordRules.length &&
    passwordRules.upper &&
    passwordRules.number &&
    passwordRules.special;

  const requestPasswordUpdate = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!passwords.current.trim()) {
      setPasswordError('Enter your current password to continue.');
      return;
    }

    if (!allPasswordRulesMet) {
      setPasswordError('New password does not meet all security requirements.');
      return;
    }

    if (passwords.current === passwords.next) {
      setPasswordError('New password must be different from your current password.');
      return;
    }

    if (passwords.next !== passwords.confirm) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setOtpChallenge({ open: true, mode: 'password' });
  };

  const handleOtpVerified = () => {
    if (otpChallenge.mode === 'profile') {
      const updated = {
        ...profileDraft,
        fullName: profileDraft.fullName.trim(),
        email: profileDraft.email.trim(),
      };
      setProfile(updated);
      setProfileDraft(updated);
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      setIsEditingProfile(false);
      setOtpChallenge({ open: false, mode: null });
      flashNotice('IDENTITY VERIFIED — PROFILE INFORMATION UPDATED.');
      return;
    }

    if (otpChallenge.mode === 'password') {
      setPasswords({ current: '', next: '', confirm: '' });
      setOtpChallenge({ open: false, mode: null });
      flashNotice('IDENTITY VERIFIED — ACCOUNT PASSWORD UPDATED.');
    }
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
              onClick={() => setSignOutOpen(true)}
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

                  {!isEditingProfile ? (
                    <button
                      type="button"
                      className="module-edit-btn"
                      onClick={startProfileEdit}
                    >
                      <Edit3 size={13} />
                      <span>UNLOCK & EDIT</span>
                    </button>
                  ) : (
                    <span className="module-tag is-unlocked">OTP REQUIRED TO SAVE</span>
                  )}
                </div>

                <div className="security-notice-bar">
                  <Lock size={14} />
                  <span>
                    {isEditingProfile
                      ? 'EDIT MODE ACTIVE. SAVING CHANGES REQUIRES A 6-DIGIT OTP SENT TO YOUR REGISTERED ACCOUNT.'
                      : 'FIELDS ARE LOCKED BY DEFAULT TO PROTECT YOUR REGISTERED IDENTITY.'}
                  </span>
                </div>

                <form className="account-form" onSubmit={requestProfileSave}>
                  <div className="account-form-grid">
                    <label className="account-field">
                      <span>FULL NAME</span>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={isEditingProfile ? profileDraft.fullName : profile.fullName}
                        onChange={handleProfileDraftChange}
                        disabled={!isEditingProfile}
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
                        value={isEditingProfile ? profileDraft.phone : profile.phone}
                        onChange={handleProfileDraftChange}
                        disabled={!isEditingProfile}
                      />
                    </label>

                    <label className="account-field field-span-2">
                      <span>REGISTERED EMAIL ADDRESS</span>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={isEditingProfile ? profileDraft.email : profile.email}
                        onChange={handleProfileDraftChange}
                        disabled={!isEditingProfile}
                        required
                      />
                    </label>
                  </div>

                  {profileError && (
                    <p className="account-error">{profileError}</p>
                  )}

                  {isEditingProfile && (
                    <div className="account-form-actions">
                      <button
                        type="button"
                        className="account-secondary-btn"
                        onClick={cancelProfileEdit}
                      >
                        CANCEL
                      </button>
                      <button type="submit" className="account-primary-btn">
                        VERIFY OTP & SAVE
                      </button>
                    </div>
                  )}
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
                  <span className="module-tag is-unlocked">2FA PROTECTED</span>
                </div>

                <div className="security-notice-bar">
                  <ShieldCheck size={14} />
                  <span>
                    CHANGING YOUR PASSWORD REQUIRES CURRENT CREDENTIALS, STRONG
                    PASSWORD COMPLIANCE, AND OTP VERIFICATION.
                  </span>
                </div>

                <form className="account-form" onSubmit={requestPasswordUpdate}>
                  <div className="account-form-grid">
                    <label className="account-field field-span-2">
                      <span>CURRENT PASSWORD</span>
                      <div className="account-password-wrap">
                        <input
                          type={showPass.current ? 'text' : 'password'}
                          value={passwords.current}
                          onChange={(e) =>
                            setPasswords((p) => ({ ...p, current: e.target.value }))
                          }
                          required
                        />
                        <button
                          type="button"
                          className="account-eye-btn"
                          aria-label="Toggle current password"
                          onClick={() =>
                            setShowPass((s) => ({ ...s, current: !s.current }))
                          }
                        >
                          {showPass.current ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      </div>
                    </label>

                    <label className="account-field">
                      <span>NEW PASSWORD</span>
                      <div className="account-password-wrap">
                        <input
                          type={showPass.next ? 'text' : 'password'}
                          value={passwords.next}
                          onChange={(e) =>
                            setPasswords((p) => ({ ...p, next: e.target.value }))
                          }
                          required
                        />
                        <button
                          type="button"
                          className="account-eye-btn"
                          aria-label="Toggle new password"
                          onClick={() =>
                            setShowPass((s) => ({ ...s, next: !s.next }))
                          }
                        >
                          {showPass.next ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      </div>
                    </label>

                    <label className="account-field">
                      <span>CONFIRM NEW PASSWORD</span>
                      <div className="account-password-wrap">
                        <input
                          type={showPass.confirm ? 'text' : 'password'}
                          value={passwords.confirm}
                          onChange={(e) =>
                            setPasswords((p) => ({ ...p, confirm: e.target.value }))
                          }
                          required
                        />
                        <button
                          type="button"
                          className="account-eye-btn"
                          aria-label="Toggle confirm password"
                          onClick={() =>
                            setShowPass((s) => ({ ...s, confirm: !s.confirm }))
                          }
                        >
                          {showPass.confirm ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      </div>
                    </label>
                  </div>

                  <div className="password-policy-grid">
                    <span className={passwordRules.length ? 'met' : ''}>
                      {passwordRules.length ? '✓' : '•'} MINIMUM 8 CHARACTERS
                    </span>
                    <span className={passwordRules.upper ? 'met' : ''}>
                      {passwordRules.upper ? '✓' : '•'} AT LEAST 1 UPPERCASE LETTER
                    </span>
                    <span className={passwordRules.number ? 'met' : ''}>
                      {passwordRules.number ? '✓' : '•'} AT LEAST 1 NUMBER
                    </span>
                    <span className={passwordRules.special ? 'met' : ''}>
                      {passwordRules.special ? '✓' : '•'} AT LEAST 1 SPECIAL CHARACTER
                    </span>
                  </div>

                  {passwordError && (
                    <p className="account-error">{passwordError}</p>
                  )}

                  <div className="account-form-actions">
                    <button type="submit" className="account-primary-btn">
                      VERIFY OTP & UPDATE PASSWORD
                    </button>
                  </div>
                </form>
              </div>
            )}
          </section>
        </div>
      </section>

      <OtpVerificationModal
        open={otpChallenge.open}
        title={
          otpChallenge.mode === 'profile'
            ? 'VERIFY PROFILE CHANGE'
            : 'VERIFY PASSWORD CHANGE'
        }
        actionLabel={
          otpChallenge.mode === 'profile'
            ? 'updating your registered identity details'
            : 'updating your account password'
        }
        registeredEmail={profile.email}
        registeredPhone={profile.phone}
        onVerified={handleOtpVerified}
        onCancel={() => setOtpChallenge({ open: false, mode: null })}
      />

      <ConfirmModal
        open={signOutOpen}
        eyebrow="PARADOX / SESSION"
        title="SIGN OUT?"
        message="Are you sure you want to sign out of your PARADOX account?"
        confirmLabel="SIGN OUT"
        cancelLabel="CANCEL"
        danger
        onConfirm={() => {
          setSignOutOpen(false);
          navigate('/');
        }}
        onCancel={() => setSignOutOpen(false)}
      />
    </main>
  );
}