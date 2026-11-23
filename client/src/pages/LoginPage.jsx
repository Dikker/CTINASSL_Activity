import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import './LoginPage.css';

/* Exact Custom PARADOX Display Wordmark SVG */
function ParadoxWordmark({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 118"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="PARADOX"
    >
      {/* P (Extended left stem + sharp geometric bowl) */}
      <path
        d="M14 112V8H66L78 20V56L66 68H27V112H14ZM27 56H60L65 51V25L60 20H27V56Z"
        fill="currentColor"
      />
      {/* A (Sharp triangle without crossbar) */}
      <path
        d="M96 96L134 18L172 96H157L134 47L111 96H96Z"
        fill="currentColor"
      />
      {/* R (Sharp geometric bowl + angled leg) */}
      <path
        d="M192 96V18H242L254 30V54L242 66H226L255 96H238L211 66H205V96H192ZM205 55H236L241 50V34L236 29H205V55Z"
        fill="currentColor"
      />
      {/* A (Sharp triangle without crossbar) */}
      <path
        d="M274 96L312 18L350 96H335L312 47L289 96H274Z"
        fill="currentColor"
      />
      {/* D (Sharp angular outer corners) */}
      <path
        d="M372 96V18H418L436 36V78L418 96H372ZM385 84H413L423 74V40L413 30H385V84Z"
        fill="currentColor"
      />
      {/* o (Geometric lowercase ring) */}
      <path
        d="M475 38H495L509 52V82L495 96H475L461 82V52L475 38ZM480 49L473 56V78L480 85H490L497 78V56L490 49H480Z"
        fill="currentColor"
      />
      {/* X (Bold geometric cross) */}
      <path
        d="M528 18L555 55L527 96H543L563 66L583 96H599L571 55L598 18H582L563 45L544 18H528Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* Crisp Vector Barcode + Title Case "Paradox" Lockup */
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

export default function LoginPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="login-page">
      {/* LEFT / TOP DIAGONAL BLACK PANEL */}
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

      {/* FOREGROUND T-SHIRT CUTOUT (Positioned low across the bottom seam) */}
      <img
        src="/images/shirt-front.png"
        alt="Paradox Oversized Tee"
        className="foreground-shirt"
      />

      {/* RIGHT / BOTTOM LIGHT FORM PANEL */}
      <div className="login-right-panel">
        {/* Top-Left Angled HUD Line emerging from the diagonal seam */}
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

        {/* Top-Right Crosshairs */}
        <div className="crosshairs-top-right" aria-hidden="true">
          <span>+</span>
          <span>+</span>
        </div>

        {/* Subtle 4-Point Star Watermarks */}
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

        {/* Bottom-Right Thick Light-Grey Tech Line */}
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

        {/* Bottom-Right Barcode */}
        <ParadoxBarcode className="barcode-bottom-right" />

        {/* CENTERED FORM CONTAINER */}
        <div className="login-form-wrapper">
          <ParadoxWordmark className="brand-wordmark" />

          <form className="login-form" onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="input-group">
                <label className="input-label">
                  <span className="label-slash" />
                  FULL NAME
                </label>
                <div className="input-box">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            <div className="input-group">
              <label className="input-label">
                <span className="label-slash" />
                EMAIL
              </label>
              <div className="input-box">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
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
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            <div className="button-stack">
              <button type="submit" className="btn-primary">
                {isSignUp ? 'Create Account' : 'Login'}
              </button>

              <div className="divider-or">
                <span className="divider-line" />
                <span className="divider-text">OR</span>
                <span className="divider-line" />
              </div>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsSignUp((prev) => !prev)}
              >
                {isSignUp ? 'Back to Login' : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}