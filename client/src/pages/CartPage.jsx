import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import Navbar from '../components/NavBar';
import ConfirmModal from '../components/ConfirmModal';
import { CART_KEY, readStorage, saveStorage, money, cartTotal, cartCount } from '../data/commerce';
import './Commerce.css';

export default function CartPage() {
  const [items, setItems] = useState(() => readStorage(CART_KEY, []));
  const [itemToRemove, setItemToRemove] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const refresh = () => setItems(readStorage(CART_KEY, []));
    window.addEventListener('paradox-storage-update', refresh);
    return () => window.removeEventListener('paradox-storage-update', refresh);
  }, []);

  const updateCart = (next) => {
    setItems(next);
    saveStorage(CART_KEY, next);
  };

  const changeQuantity = (index, amount) => {
    const currentQty = Number(items[index].quantity);
    if (currentQty + amount < 1) {
      setItemToRemove({ index, item: items[index] });
      return;
    }
    const next = [...items];
    next[index] = { ...next[index], quantity: currentQty + amount };
    updateCart(next);
  };

  const confirmRemoveItem = () => {
    if (!itemToRemove) return;
    updateCart(items.filter((_, i) => i !== itemToRemove.index));
    setItemToRemove(null);
  };

  const subtotal = cartTotal(items);

  return (
    <main className="commerce-page">
      <Navbar cartCount={cartCount(items)} />
      <section className="commerce-container">
        <header className="commerce-heading">
          <p className="commerce-eyebrow">PARADOX / YOUR SELECTION</p>
          <h1 className="commerce-title">YOUR CART</h1>
          <p className="commerce-subtitle">{cartCount(items)} ITEM(S) IN YOUR BAG</p>
        </header>

        {items.length === 0 ? (
          <div className="commerce-empty">
            <span className="commerce-empty-mark">PRDX / 01</span>
            <h2>YOUR BAG IS EMPTY.</h2>
            <p>Nothing here just yet. Explore the collection and find your next piece.</p>
            <Link className="commerce-button" to="/shop">EXPLORE COLLECTION <ArrowRight size={15} /></Link>
          </div>
        ) : (
          <div className="commerce-layout">
            <section className="commerce-items">
              <div className="commerce-list-heading">
                <span>PRODUCT</span>
                <span>SUBTOTAL</span>
              </div>
              {items.map((item, index) => (
                <article className="commerce-item" key={`${item.id}-${item.size}-${item.color}`}>
                  <div className="commerce-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="commerce-item-info">
                    <h2>{item.name}</h2>
                    <p>{item.color} / SIZE {item.size}</p>
                    <strong className="commerce-item-unit">{money(item.price)}</strong>
                    <div className="commerce-item-controls">
                      <div className="commerce-quantity">
                        <button type="button" onClick={() => changeQuantity(index, -1)} aria-label="Decrease quantity"><Minus size={13} /></button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => changeQuantity(index, 1)} aria-label="Increase quantity"><Plus size={13} /></button>
                      </div>
                      <button
                        className="commerce-remove"
                        type="button"
                        onClick={() => setItemToRemove({ index, item })}
                      >
                        <Trash2 size={13} /> REMOVE
                      </button>
                    </div>
                  </div>
                  <strong className="commerce-item-subtotal">{money(item.price * item.quantity)}</strong>
                </article>
              ))}
              <Link className="commerce-continue" to="/shop">← CONTINUE SHOPPING</Link>
            </section>

            <aside className="commerce-summary">
              <p className="commerce-eyebrow">PRDX / SUMMARY</p>
              <h2>ORDER SUMMARY</h2>
              <div className="summary-line"><span>Items</span><span>{cartCount(items)}</span></div>
              <div className="summary-line"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
              <div className="summary-line"><span>Shipping</span><span>At checkout</span></div>
              <div className="commerce-total"><span>ESTIMATED TOTAL</span><strong>{money(subtotal)}</strong></div>
              <button className="commerce-button" onClick={() => navigate('/checkout')}>PROCEED TO CHECKOUT <ArrowRight size={15} /></button>
              <p className="commerce-note">Shipping fees are calculated during checkout.</p>
            </aside>
          </div>
        )}
      </section>

      <ConfirmModal
        open={Boolean(itemToRemove)}
        eyebrow="PARADOX / BAG"
        title="REMOVE ITEM?"
        message={
          itemToRemove
            ? `Remove "${itemToRemove.item.name}" (Size ${itemToRemove.item.size}) from your shopping bag?`
            : ''
        }
        confirmLabel="REMOVE"
        cancelLabel="KEEP ITEM"
        danger
        onConfirm={confirmRemoveItem}
        onCancel={() => setItemToRemove(null)}
      />
    </main>
  );
}