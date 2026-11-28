import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import OtpVerificationModal from '../components/OtpVerificationModal';
import './LoginPage.css';

function ParadoxWordmark({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 118"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="PARADOX"
    >
      <path
        d="M14 112V8H66L78 20V56L66 68H27V112H14ZM27 56H60L65 51V25L60 20H27V56Z"
        fill="currentColor"
      />
      <path
        d="M96 96L134 18L172 96H157L134 47L111 96H96Z"
        fill="currentColor"
      />
      <path
        d="M192 96V18H242L254 30V54L242 66H226L255 96H238L211 66H205V96H192ZM205 55H236L241 50V34L236 29H205V55Z"
        fill="currentColor"
      />
      <path
        d="M274 96L312 18L350 96H335L312 47L289 96H274Z"
        fill="currentColor"
      />
      <path
        d="M372 96V18H418L436 36V78L418 96H372ZM385 84H413L423 74V40L413 30H385V84Z"
        fill="currentColor"
      />
      <path
        d="M475 38H495L509 52V82L495 96H475L461 82V52L475 38ZM480 49L473 56V78L480 85H490L497 78V56L490 49H480Z"
        fill="currentColor"
      />
      <path
        d="M528 18L555 55L527 96H543L563 66L583 96H599L571 55L598 18H582L563 45L544 18H528Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ParadoxBarcode({ className }) {
  const bars = [
    { x: 0, w: 6 },
    { x: 10, w: 3 },
    { x: 17, w: 8 },
    { x: 29, w: 3 },
    { x: 36, w: 5 },
    { x: 46, w: 2 },
    { x: 52, w: 7 },
    { x: 63, w: 3 },
    { x: 70, w: 10 },
    { x: 84, w: 3 },
    { x: 91, w: 5 },
    { x: 100, w: 2 },
    { x: 107, w: 6 },
    { x: 117, w: 3 },
    { x: 125, w: 9 },
    { x: 138, w: 3 },
    { x: 145, w: 7 },
    { x: 156, w: 2 },
    { x: 162, w: 5 },
  ];

  return (
    <div className={`barcode-lockup ${className || ''}`}>
      <svg
        viewBox="0 0 167 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="barcode-svg"
        aria-hidden="true"
      >
        {bars.map((bar, idx) => (
          <rect
            key={idx}
            x={bar.x}
            y="0"
            width={bar.w}
            height="44"
            fill="currentColor"
          />
        ))}
      </svg>
      <div className="barcode-letters" aria-hidden="true">
        <span>P</span>
        <span>a</span>
        <span>r</span>
        <span>a</span>
        <span>d</span>
        <span>o</span>
        <span>x</span>
      </div>
    </div>
  );
}

function GmailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M20 18h-2V9.25L12 13 6 9.25V18H4V6h1.2l6.8 4.25L18.8 6H20v12z"
      />
      <path fill="#4285F4" d="M4 6h2v12H4z" />
      <path fill="#34A853" d="M18 6h2v12h-2z" />
      <path
        fill="#FBBC05"
        d="M6 9.25 4 6h1.2L12 10.25 18.8 6H20l-2 3.25-6 3.75z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="#1877F2"
        d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [otpOpen, setOtpOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });

  const passwordRules = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };

  const allPasswordRulesMet =
    passwordRules.length &&
    passwordRules.upper &&
    passwordRules.number &&
    passwordRules.special;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthError('');
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 11);
      setFormData((prev) => ({ ...prev, phone: numericValue }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const finalizeRegistration = () => {
    const existingUser = JSON.parse(localStorage.getItem('paradox-user') || '{}');
    localStorage.setItem(
      'paradox-user',
      JSON.stringify({
        fullName:
          formData.fullName.trim() ||
          existingUser.fullName ||
          formData.email.split('@')[0],
        email: formData.email.trim(),
        phone: formData.phone || existingUser.phone || '',
        memberSince: existingUser.memberSince || '2026',
      })
    );
    setOtpOpen(false);
    navigate('/home');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    if (!formData.email.trim() || !formData.password.trim()) {
      setAuthError('Please fill in all required fields.');
      return;
    }

    if (isSignUp) {
      if (!formData.fullName.trim()) {
        setAuthError('Full name is required.');
        return;
      }

      if (!/^09\d{9}$/.test(formData.phone)) {
        setAuthError('Phone number must be 11 digits starting with 09.');
        return;
      }

      if (!allPasswordRulesMet) {
        setAuthError('Password must meet all security requirements.');
        return;
      }

      setOtpOpen(true);
      return;
    }

    finalizeRegistration();
  };

  const handleSocialAuth = (provider) => {
    const existingUser = JSON.parse(localStorage.getItem('paradox-user') || '{}');
    localStorage.setItem(
      'paradox-user',
      JSON.stringify({
        fullName: existingUser.fullName || `PARADOX ${provider} Member`,
        email: existingUser.email || `member@${provider.toLowerCase()}.com`,
        phone: existingUser.phone || '',
        memberSince: existingUser.memberSince || '2026',
      })
    );
    navigate('/home');
  };

  return (
    <div className="login-page">
      <div className="login-left-panel">
        <ParadoxBarcode className="barcode-top-left" />

        <img
          src="/images/emblem-r.png"
          alt=""
          aria-hidden="true"
          className="emblem-watermark-left"
        />

        <div className="crosshairs-bottom-left" aria-hidden="true">
          <span>+</span>
          <span>+</span>
          <div className="bottom-left-line" />
        </div>
      </div>

      <img
        src="/images/shirt-front.png"
        alt="Paradox Oversized Tee"
        className="foreground-shirt"
      />

      <div className="login-right-panel">
        <svg
          className="hud-line-top"
          viewBox="0 0 360 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M18 158L108 68H268L348 2"
            stroke="#1A1A1A"
            strokeWidth="2"
          />
        </svg>

        <div className="crosshairs-top-right" aria-hidden="true">
          <span>+</span>
          <span>+</span>
        </div>

        <svg
          className="star-watermark star-mid"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <path d="M50 0 C52 38, 62 48, 100 50 C62 52, 52 62, 50 100 C48 62, 38 52, 0 50 C38 48, 48 38, 50 0 Z" />
        </svg>
        <svg
          className="star-watermark star-top-right"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <path d="M50 0 C52 38, 62 48, 100 50 C62 52, 52 62, 50 100 C48 62, 38 52, 0 50 C38 48, 48 38, 50 0 Z" />
        </svg>

        <svg
          className="hud-line-bottom"
          viewBox="0 0 260 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M258 4L145 118V255L52 358"
            stroke="#E1E1E1"
            strokeWidth="12"
            strokeLinecap="square"
          />
        </svg>

        <ParadoxBarcode className="barcode-bottom-right" />

        <div className={`login-form-wrapper ${isSignUp ? 'is-signup' : ''}`}>
          <ParadoxWordmark className="brand-wordmark" />

          <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
            {isSignUp && (
              <div className="signup-fields-grid">
                <div className="input-group">
                  <label className="input-label">
                    <span className="label-slash" />
                    FULL NAME
                  </label>
                  <div className="input-box">
                    <User size={17} className="input-icon" />
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      autoComplete="one-time-code"
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">
                    <span className="label-slash" />
                    PHONE NUMBER
                  </label>
                  <div className="input-box">
                    <Phone size={17} className="input-icon" />
                    <input
                      type="tel"
                      name="phone"
                      inputMode="numeric"
                      pattern="[0-9]{11}"
                      maxLength={11}
                      placeholder="09XXXXXXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                      autoComplete="one-time-code"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="input-group">
              <label className="input-label">
                <span className="label-slash" />
                EMAIL
              </label>
              <div className="input-box">
                <Mail size={17} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="one-time-code"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span className="label-slash" />
                PASSWORD
              </label>
              <div className="input-box">
                <Lock size={17} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="signup-policy-grid">
                <span className={passwordRules.length ? 'met' : ''}>
                  {passwordRules.length ? '✓' : '•'} 8+ CHARACTERS
                </span>
                <span className={passwordRules.upper ? 'met' : ''}>
                  {passwordRules.upper ? '✓' : '•'} 1 UPPERCASE
                </span>
                <span className={passwordRules.number ? 'met' : ''}>
                  {passwordRules.number ? '✓' : '•'} 1 NUMBER
                </span>
                <span className={passwordRules.special ? 'met' : ''}>
                  {passwordRules.special ? '✓' : '•'} 1 SPECIAL CHAR
                </span>
              </div>
            )}

            {authError && <p className="login-error-msg">{authError}</p>}

            <div className="button-stack">
              <button type="submit" className="btn-primary">
                {isSignUp ? 'Verify & Create Account' : 'Login'}
              </button>

              {isSignUp && (
                <>
                  <div className="divider-or">
                    <span className="divider-line" />
                    <span className="divider-text">SIGN UP WITH</span>
                    <span className="divider-line" />
                  </div>

                  <div className="social-auth-row">
                    <button
                      type="button"
                      className="btn-social"
                      onClick={() => handleSocialAuth('Gmail')}
                    >
                      <GmailIcon />
                      <span>Gmail</span>
                    </button>
                    <button
                      type="button"
                      className="btn-social"
                      onClick={() => handleSocialAuth('Facebook')}
                    >
                      <FacebookIcon />
                      <span>Facebook</span>
                    </button>
                  </div>
                </>
              )}

              <div className="divider-or">
                <span className="divider-line" />
                <span className="divider-text">OR</span>
                <span className="divider-line" />
              </div>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setIsSignUp((prev) => !prev);
                  setAuthError('');
                  setFormData({ fullName: '', email: '', phone: '', password: '' });
                }}
              >
                {isSignUp ? 'Back to Login' : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <OtpVerificationModal
        open={otpOpen}
        title="VERIFY NEW ACCOUNT"
        actionLabel="completing your PARADOX member registration"
        registeredEmail={formData.email}
        registeredPhone={formData.phone}
        onVerified={finalizeRegistration}
        onCancel={() => setOtpOpen(false)}
      />
    </div>
  );
}