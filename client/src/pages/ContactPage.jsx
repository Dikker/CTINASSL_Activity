import Navbar from '../components/NavBar';

import './ContactPage.css';

const founders = [
  {
    name: 'Evan Daniel S. Dizon',
    role: 'CO-FOUNDER',
    instagram: 'evn.srge',
    instagramUrl: 'https://www.instagram.com/evn.srge/',
    github: 'surge-cmd',
    githubUrl: 'https://github.com/surge-cmd',
  },
  {
    name: 'Benedict T. Pascua',
    role: 'CO-FOUNDER',
    instagram: 'bene_dikker',
    instagramUrl: 'https://www.instagram.com/bene_dikker/',
    github: 'Dikker',
    githubUrl: 'https://github.com/Dikker',
  },
];

export default function ContactPage() {
  return (
    <main className="contact-page">
      <Navbar />

      <section className="contact-heading">
        <p className="contact-eyebrow">PARADOX / THE PEOPLE</p>
        <h1>GET IN<br /><span>TOUCH.</span></h1>
        <p>Connect with the people behind PARADOX.</p>
      </section>

      <section className="founders-section">
        <div className="founders-label">
          <span>THE FOUNDERS</span>
          <span>02 PEOPLE / 01 VISION</span>
        </div>

        <div className="founders-grid">
          {founders.map((founder, index) => (
            <article className="founder-card" key={founder.github}>
              <span className="founder-number">0{index + 1}</span>
              <p className="founder-role">{founder.role}</p>
              <h2>{founder.name}</h2>

              <div className="founder-links">
                <a href={founder.instagramUrl} target="_blank" rel="noreferrer">
                  <span className="social-icon">IG</span>
                  <span>{founder.instagram}</span>
                </a>
                <a href={founder.githubUrl} target="_blank" rel="noreferrer">
                  <span className="social-icon">GH</span>
                  <span>{founder.github}</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="contact-footer">
        <span>PARADOX®</span>
        <span>INDEPENDENTLY BUILT.</span>
        <span>© 2026</span>
      </footer>
    </main>
  );
}


