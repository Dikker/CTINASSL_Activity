import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import ConfirmModal from '../components/ConfirmModal';
import { CART_KEY, ORDERS_KEY, LAST_ORDER_KEY, readStorage, saveStorage, money, cartTotal, cartCount } from '../data/commerce';
import './Commerce.css';

function createOrderRecord({ form, items, subtotal, shipping, total }) {
  const timestamp = Date.now();
  return {
    id: `PRDX-${timestamp.toString().slice(-8)}`,
    date: new Date(timestamp).toISOString(),
    status: 'Order Placed',
    customer: { ...form },
    items,
    subtotal,
    shipping,
    total,
  };
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = readStorage(CART_KEY, []);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', province: '', postalCode: '',
    payment: 'Cash on Delivery', notes: '',
  });
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const subtotal = cartTotal(items);
  const shipping = subtotal >= 2000 ? 0 : 100;
  const total = subtotal + shipping;

  const update = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });

  const handleCheckoutSubmit = (event) => {
    event.preventDefault();

    if (!items.length) {
      setError('Your cart is empty. Add a product before checking out.');
      return;
    }

    setError('');
    setConfirmOpen(true);
  };

  const finalizeOrder = () => {
    const order = createOrderRecord({
      form,
      items,
      subtotal,
      shipping,
      total,
    });

    const orders = readStorage(ORDERS_KEY, []);
    orders.unshift(order);
    saveStorage(ORDERS_KEY, orders);
    saveStorage(LAST_ORDER_KEY, order);
    saveStorage(CART_KEY, []);
    setConfirmOpen(false);
    navigate('/order-confirmation');
  };

  if (!items.length) {
    return (
      <main className="commerce-page">
        <Navbar />
        <section className="commerce-container commerce-empty">
          <p className="commerce-eyebrow">PARADOX / CHECKOUT</p>
          <h1 className="commerce-title">NOTHING TO CHECK OUT.</h1>
          <p>Your cart is currently empty.</p>
          <Link className="commerce-button" to="/shop">GO TO SHOP</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="commerce-page">
      <Navbar />
      <section className="commerce-container">
        <header className="commerce-heading">
          <p className="commerce-eyebrow">PARADOX / FINAL STEP</p>
          <h1 className="commerce-title">CHECKOUT</h1>
          <p className="commerce-subtitle">YOUR DETAILS. YOUR ORDER. ALMOST YOURS.</p>
        </header>

        <form className="checkout-layout" onSubmit={handleCheckoutSubmit}>
          <div className="checkout-main">
            <section className="checkout-section">
              <div className="checkout-section-heading">
                <span>01</span>
                <div><h2>CONTACT DETAILS</h2><p>How can we reach you?</p></div>
              </div>
              <div className="checkout-fields">
                <label>FIRST NAME<input name="firstName" value={form.firstName} onChange={update} required /></label>
                <label>LAST NAME<input name="lastName" value={form.lastName} onChange={update} required /></label>
                <label>EMAIL ADDRESS<input type="email" name="email" value={form.email} onChange={update} required /></label>
                <label>PHONE NUMBER<input type="tel" name="phone" value={form.phone} onChange={update} required /></label>
              </div>
            </section>

            <section className="checkout-section">
              <div className="checkout-section-heading">
                <span>02</span>
                <div><h2>DELIVERY ADDRESS</h2><p>Where should we send your order?</p></div>
              </div>
              <div className="checkout-fields">
                <label className="field-wide">STREET ADDRESS<input name="address" value={form.address} onChange={update} required /></label>
                <label>CITY<input name="city" value={form.city} onChange={update} required /></label>
                <label>PROVINCE<input name="province" value={form.province} onChange={update} required /></label>
                <label className="field-wide">POSTAL CODE<input name="postalCode" value={form.postalCode} onChange={update} required /></label>
              </div>
            </section>

            <section className="checkout-section">
              <div className="checkout-section-heading">
                <span>03</span>
                <div><h2>PAYMENT</h2><p>Choose how you'd like to pay.</p></div>
              </div>
              <div className="payment-options">
                <label className="payment-option">
                  <input type="radio" name="payment" value="Cash on Delivery" checked={form.payment === 'Cash on Delivery'} onChange={update} />
                  <span><strong>Cash on Delivery</strong><small>Pay when your order arrives.</small></span>
                </label>
                <label className="payment-option">
                  <input type="radio" name="payment" value="GCash (Demo)" checked={form.payment === 'GCash (Demo)'} onChange={update} />
                  <span><strong>GCash</strong><small>Demo option — no actual payment processed.</small></span>
                </label>
              </div>
              <label className="checkout-notes">ORDER NOTES <textarea name="notes" value={form.notes} onChange={update} rows="3" placeholder="Anything we should know? (Optional)" /></label>
            </section>

            {error && <p className="commerce-error">{error}</p>}
            <button className="commerce-button checkout-submit" type="submit">PLACE YOUR ORDER <span>→</span></button>
            <Link className="commerce-continue" to="/cart">← RETURN TO CART</Link>
          </div>

          <aside className="commerce-summary checkout-summary">
            <p className="commerce-eyebrow">PRDX / YOUR SELECTION</p>
            <h2>ORDER SUMMARY</h2>
            <div className="checkout-products">
              {items.map((item, index) => (
                <div className="checkout-product" key={`${item.id}-${item.size}-${index}`}>
                  <div className="checkout-product-image"><img src={item.image} alt={item.name} /></div>
                  <div className="checkout-product-info">
                    <strong>{item.name}</strong>
                    <span>SIZE {item.size} · QTY {item.quantity}</span>
                  </div>
                  <strong className="checkout-product-price">{money(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>
            <div className="summary-line"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
            <div className="summary-line"><span>Shipping</span><strong>{shipping === 0 ? 'FREE' : money(shipping)}</strong></div>
            <div className="commerce-total"><span>TOTAL</span><strong>{money(total)}</strong></div>
            <p className="commerce-note">Free shipping on orders worth ₱2,000 or more. This frontend demo does not process payments.</p>
          </aside>
        </form>
      </section>

      <ConfirmModal
        open={confirmOpen}
        eyebrow="PARADOX / ORDER VERIFICATION"
        title="PLACE ORDER?"
        message={`Confirm your order of ${cartCount(items)} item(s) totaling ${money(total)} via ${form.payment}?`}
        confirmLabel="CONFIRM ORDER"
        cancelLabel="REVIEW DETAILS"
        onConfirm={finalizeOrder}
        onCancel={() => setConfirmOpen(false)}
      />
    </main>
  );
}