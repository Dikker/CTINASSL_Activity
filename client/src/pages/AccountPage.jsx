import Navbar from '../components/NavBar';

export default function AccountPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#090909', color: 'white' }}>
      <Navbar />
      <section style={{ padding: '100px 8%', textAlign: 'center' }}>
        <p style={{ letterSpacing: '5px', color: '#999' }}>YOUR PROFILE</p>
        <h1 style={{ fontSize: '48px', letterSpacing: '5px' }}>MY ACCOUNT</h1>
        <p style={{ color: '#aaa', marginTop: '20px' }}>
          Account features coming soon.
        </p>
      </section>
    </main>
  );
}
