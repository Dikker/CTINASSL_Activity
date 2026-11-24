import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Navbar from '../components/NavBar';
import { LAST_ORDER_KEY, readStorage, money } from '../data/commerce';
import './Commerce.css';

export default function OrderConfirmation() {
  const order = readStorage(LAST_ORDER_KEY, null);

  if (!order) {
    return (
      <main className="commerce-page">
        <Navbar />
        <section className="commerce-container commerce-empty">
          <p className="commerce-eyebrow">PARADOX / ORDER STATUS</p>
          <h1 className="commerce-title">NO RECENT ORDER</h1>
          <p>There is no order confirmation to display.</p>
          <Link className="commerce-button" to="/shop">EXPLORE SHOP</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="commerce-page">
      <Navbar />
      <section className="commerce-container confirmation-page">
        <div className="confirmation-top">
          <CheckCircle2 size={43} strokeWidth={1.2} />
          <p className="commerce-eyebrow">PARADOX / ORDER RECEIVED</p>
          <h1 className="commerce-title">THANK YOU.</h1>
          <p>Your order has been recorded. Here's your order reference.</p>
          <div className="confirmation-number">
            <span>ORDER NUMBER</span>
            <strong>{order.id}</strong>
          </div>
          <Link className="commerce-button confirmation-track" to={`/track?order=${order.id}`}>TRACK YOUR ORDER <span>→</span></Link>
        </div>

        <section className="confirmation-details">
          <div className="confirmation-details-heading">
            <div><p className="commerce-eyebrow">PRDX / DETAILS</p><h2>ORDER SUMMARY</h2></div>
            <span>{order.status}</span>
          </div>
          {order.items.map((item, index) => (
            <div className="confirmation-row" key={`${item.id}-${index}`}>
              <span>{item.name} / {item.size} × {item.quantity}</span>
              <strong>{money(item.price * item.quantity)}</strong>
            </div>
          ))}
          <div className="confirmation-row"><span>Shipping</span><strong>{order.shipping === 0 ? 'FREE' : money(order.shipping)}</strong></div>
          <div className="commerce-total"><span>TOTAL PAID / DUE</span><strong>{money(order.total)}</strong></div>
          <div className="confirmation-delivery">
            <div><span>PAYMENT METHOD</span><strong>{order.customer.payment}</strong></div>
            <div><span>DELIVER TO</span><strong>{order.customer.address}, {order.customer.city}, {order.customer.province}</strong></div>
          </div>
        </section>
        <Link className="commerce-continue" to="/shop">← CONTINUE SHOPPING</Link>
      </section>
    </main>
  );
}
