import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, RefreshCw, X, Lock } from 'lucide-react';
import './OtpVerificationModal.css';

function generateSixDigitCode() {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return String(100000 + (array[0] % 900000));
}

function maskDestination(email, phone) {
  if (email && email.includes('@')) {
    const [local, domain] = email.split('@');
    const visible = local.slice(0, 2);
    return `${visible}${'*'.repeat(Math.max(2, local.length - 2))}@${domain}`;
  }
  if (phone && phone.length >= 7) {
    return `${phone.slice(0, 4)}****${phone.slice(-3)}`;
  }
  return 'your registered account';
}

export default function OtpVerificationModal({
  open,
  title = 'VERIFY IDENTITY',
  actionLabel = 'account modification',
  registeredEmail = '',
  registeredPhone = '',
  onVerified,
  onCancel,
}) {
  const [channel, setChannel] = useState(registeredEmail ? 'email' : 'phone');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  const issueNewOtp = (targetChannel) => {
    const code = generateSixDigitCode();
    setGeneratedOtp(code);
    setDigits(['', '', '', '', '', '']);
    setSecondsLeft(60);
    setError('');
    setChannel(targetChannel);
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 40);
  };

  useEffect(() => {
    if (!open) return;
    const initialChannel = registeredEmail ? 'email' : 'phone';
    const code = generateSixDigitCode();
    const timer = setTimeout(() => {
      setChannel(initialChannel);
      setGeneratedOtp(code);
      setDigits(['', '', '', '', '', '']);
      setSecondsLeft(60);
      setAttemptsLeft(3);
      setError('');
      inputRefs.current[0]?.focus();
    }, 0);
    return () => clearTimeout(timer);
  }, [open, registeredEmail]);

  useEffect(() => {
    if (!open || secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [open, secondsLeft]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onCancel?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onCancel]);

  if (!open) return null;

  const destination =
    channel === 'email' && registeredEmail
      ? maskDestination(registeredEmail, '')
      : maskDestination('', registeredPhone);

  const handleDigitChange = (index, value) => {
    if (attemptsLeft <= 0) return;
    const clean = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    setError('');

    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    if (attemptsLeft <= 0) return;
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);
    if (!pasted) return;
    const next = ['', '', '', '', '', ''];
    pasted.split('').forEach((char, idx) => {
      next[idx] = char;
    });
    setDigits(next);
    setError('');
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleVerify = (e) => {
    e.preventDefault();

    if (attemptsLeft <= 0) {
      setError('Maximum verification attempts exceeded. Cancel and retry later.');
      return;
    }

    if (secondsLeft <= 0) {
      setError('Verification code expired. Request a new OTP.');
      return;
    }

    const entered = digits.join('');
    if (entered.length !== 6) {
      setError('Enter the complete 6-digit verification code.');
      return;
    }

    if (entered !== generatedOtp) {
      const remaining = attemptsLeft - 1;
      setAttemptsLeft(remaining);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      setError(
        remaining > 0
          ? `Invalid OTP code. ${remaining} attempt(s) remaining.`
          : 'Verification locked due to too many failed attempts.'
      );
      return;
    }

    onVerified?.();
  };

  return (
    <div
      className="otp-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="otp-modal-title"
      onClick={onCancel}
    >
      <div className="otp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="otp-top-bar">
          <span className="otp-eyebrow">PARADOX / 2-STEP VERIFICATION</span>
          <button
            type="button"
            className="otp-close-btn"
            aria-label="Close OTP verification"
            onClick={onCancel}
          >
            <X size={16} />
          </button>
        </div>

        <div className="otp-header">
          <div className="otp-shield">
            <ShieldCheck size={20} strokeWidth={1.8} />
          </div>
          <h2 id="otp-modal-title">{title}</h2>
          <p>
            To authorize <strong>{actionLabel}</strong>, enter the 6-digit
            One-Time Password sent to <strong>{destination}</strong>.
          </p>
        </div>

        {registeredEmail && registeredPhone && (
          <div className="otp-channel-switch">
            <button
              type="button"
              className={channel === 'email' ? 'active' : ''}
              onClick={() => issueNewOtp('email')}
            >
              VIA REGISTERED EMAIL
            </button>
            <button
              type="button"
              className={channel === 'phone' ? 'active' : ''}
              onClick={() => issueNewOtp('phone')}
            >
              VIA REGISTERED SMS
            </button>
          </div>
        )}

        <div className="otp-demo-banner" role="note">
          <Lock size={13} />
          <span>
            REGISTERED ACCOUNT OTP: <strong>{generatedOtp}</strong>
          </span>
        </div>

        <form onSubmit={handleVerify} className="otp-form">
          <div className="otp-inputs" onPaste={handlePaste}>
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={attemptsLeft <= 0}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                aria-label={`OTP digit ${idx + 1}`}
              />
            ))}
          </div>

          <div className="otp-meta-row">
            <span className="otp-timer">
              {secondsLeft > 0
                ? `EXPIRES IN 00:${String(secondsLeft).padStart(2, '0')}`
                : 'CODE EXPIRED'}
            </span>

            <button
              type="button"
              className="otp-resend-btn"
              disabled={secondsLeft > 30 || attemptsLeft <= 0}
              onClick={() => issueNewOtp(channel)}
            >
              <RefreshCw size={12} />
              <span>
                {secondsLeft > 30
                  ? `RESEND IN ${secondsLeft - 30}S`
                  : 'RESEND OTP'}
              </span>
            </button>
          </div>

          {error && <p className="otp-error">{error}</p>}

          <div className="otp-actions">
            <button
              type="button"
              className="otp-btn otp-btn-cancel"
              onClick={onCancel}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="otp-btn otp-btn-verify"
              disabled={attemptsLeft <= 0}
            >
              VERIFY & APPLY
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}