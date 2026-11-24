import Navbar from '../components/NavBar';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <main className="about-page">
      <Navbar />

      <section className="about-hero">
        <div className="about-meta">
          <span>PARADOX® — INDEPENDENT STREETWEAR</span>
          <span>PHILIPPINES / COLLECTION 001</span>
        </div>

        <div className="about-hero-main">
          <div className="about-hero-copy">
            <p className="about-kicker">A STUDY IN CONTRAST</p>
            <h1>NOT ONE<br />THING OR<br /><span>THE OTHER.</span></h1>
            <p className="about-intro">
              Somewhere between what is expected and what is different,
              there is room to be something entirely your own.
            </p>
          </div>

          <div className="about-hero-art">
            <img src="/images/emblem-r.png" alt="PARADOX brand emblem" />
            <span className="about-art-caption">PRDX / 001</span>
          </div>
        </div>

        <div className="about-hero-bottom">
          <span>CONTRADICTION IS THE POINT.</span>
          <span>SCROLL TO EXPLORE ↓</span>
        </div>
      </section>

      <section className="about-concept">
        <div className="about-label">
          <span>01 — THE CONCEPT</span>
          <span>WHAT IS PARADOX?</span>
        </div>

        <div className="about-concept-content">
          <p className="about-small-heading">TWO SIDES. ONE IDENTITY.</p>
          <h2>
            A PARADOX IS<br />
            NOT A PROBLEM<br />
            TO <span>SOLVE.</span>
          </h2>
          <div className="about-concept-description">
            <p>
              It is the coexistence of things that should not make sense
              together, yet somehow do. That tension is where PARADOX finds
              its identity.
            </p>
            <p>
              We are interested in the space between opposites: simplicity
              and expression, order and disruption, the familiar and the
              unexpected. Not everything needs to fit into one definition.
            </p>
          </div>
        </div>
      </section>

      <section className="about-statement">
        <span className="about-statement-index">02 — OUR APPROACH</span>
        <p>
          LESS ABOUT<br />
          FITTING IN.<br />
          MORE ABOUT<br />
          <span>MAKING IT YOURS.</span>
        </p>
        <span className="about-statement-foot">
          WEAR WHAT YOU ARE. NOT WHAT YOU ARE EXPECTED TO BE.
        </span>
      </section>

      <section className="about-direction">
        <div className="about-label">
          <span>03 — THE DIRECTION</span>
          <span>BUILT WITH INTENTION</span>
        </div>

        <div className="about-direction-grid">
          <div>
            <span className="about-direction-number">A / 01</span>
            <h3>EVERYDAY<br />UNIFORM.</h3>
            <p>
              Pieces designed to become part of your rotation. Wearable,
              versatile, and made to work beyond a single moment.
            </p>
          </div>

          <div>
            <span className="about-direction-number">B / 02</span>
            <h3>QUIETLY<br />DISTINCT.</h3>
            <p>
              No need to overstate. We lean into considered details,
              understated graphics, and a visual identity that speaks
              without asking for attention.
            </p>
          </div>

          <div>
            <span className="about-direction-number">C / 03</span>
            <h3>ALWAYS<br />EVOLVING.</h3>
            <p>
              PARADOX is an ongoing exploration, not a fixed formula.
              Each collection is another interpretation of the same idea.
            </p>
          </div>
        </div>
      </section>

      <section className="about-ending">
        <img src="/images/emblem-r.png" alt="" />
        <p>THE OPPOSITE CAN ALSO BE TRUE.</p>
        <h2>THIS IS<br />PARADOX<span>®</span></h2>
        <a href="/shop">EXPLORE THE COLLECTION ↗</a>
      </section>

      <footer className="about-footer">
        <span>PARADOX®</span>
        <span>INDEPENDENTLY BUILT / PHILIPPINES</span>
        <span>© 2026</span>
      </footer>
    </main>
  );
}
