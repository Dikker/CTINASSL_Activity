import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PackageCheck, ClipboardList, Truck, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/NavBar';
import { ORDERS_KEY, readStorage, money } from '../data/commerce';
import './Commerce.css';

export default function TrackOrder() {
  const [params] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(params.get('order') || '');
  const [searched, setSearched] = useState(Boolean(params.get('order')));
  const [order, setOrder] = useState(() => {
    const id = params.get('order');
    return id ? readStorage(ORDERS_KEY, []).find(item => item.id.toLowerCase() === id.toLowerCase()) || null : null;
  });

  const searchOrder = (event) => {
    event.preventDefault();
    const found = readStorage(ORDERS_KEY, []).find(
      item => item.id.toLowerCase() === orderNumber.trim().toLowerCase()
    );
    setOrder(found || null);
    setSearched(true);
  };

  const steps = [
    { label: 'Order Placed', icon: ClipboardList },
    { label: 'Processing', icon: PackageCheck },
    { label: 'Shipped', icon: Truck },
    { label: 'Delivered', icon: CheckCircle2 },
  ];

  const currentStep = order
    ? Math.max(0, steps.findIndex(step => step.label === order.status))
    : -1;

  return (
    <main className="commerce-page">
      <Navbar />
      <section className="commerce-container tracking-page">
        <header className="commerce-heading">
          <p className="commerce-eyebrow">PARADOX / DELIVERY</p>
          <h1 className="commerce-title">TRACK YOUR ORDER</h1>
          <p className="commerce-subtitle">CHECK THE STATUS OF YOUR PARADOX ORDER.</p>
        </header>

        <form className="tracking-search" onSubmit={searchOrder}>
          <label htmlFor="tracking-number">ORDER NUMBER</label>
          <div className="tracking-search-controls">
            <input id="tracking-number" value={orderNumber} onChange={event => setOrderNumber(event.target.value)} placeholder="PRDX-12345678" required />
            <button className="commerce-button" type="submit">LOOK UP ORDER <span>→</span></button>
          </div>
        </form>

        {searched && !order && (
          <p className="commerce-error">We couldn't find that order number in this browser. Please check the number and try again.</p>
        )}

        {order && (
          <section className="tracking-result">
            <div className="tracking-result-heading">
              <div><span>ORDER REFERENCE</span><strong>{order.id}</strong></div>
              <div><span>ORDER TOTAL</span><strong>{money(order.total)}</strong></div>
              <div><span>CURRENT STATUS</span><strong>{order.status}</strong></div>
            </div>

            <div className="tracking-timeline">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div className={`tracking-step ${index <= currentStep ? 'completed' : ''}`} key={step.label}>
                    <div className="tracking-step-icon"><Icon size={18} /></div>
                    <strong>{step.label}</strong>
                  </div>
                );
              })}
            </div>

            <p className="commerce-note">This is a local demo tracking timeline. Live shipping updates require backend and courier integration.</p>

            <div className="tracking-items-heading"><h2>ITEMS IN THIS ORDER</h2><span>{order.items.length} PRODUCT(S)</span></div>
            {order.items.map((item, index) => (
              <div className="tracking-item" key={`${item.id}-${index}`}>
                <div className="tracking-item-image"><img src={item.image} alt={item.name} /></div>
                <div><strong>{item.name}</strong><span>SIZE {item.size} · QTY {item.quantity}</span></div>
                <strong>{money(item.price * item.quantity)}</strong>
              </div>
            ))}
          </section>
        )}

        <Link className="commerce-continue" to="/shop">← BACK TO SHOP</Link>
      </section>
    </main>
  );
}
