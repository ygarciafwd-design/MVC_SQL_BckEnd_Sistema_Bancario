import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">
          <span className="logo-icon">🏦</span>
          <span className="logo-text">BancoPro</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/login" className="btn-primary login-btn">Iniciar Sesión</Link>
        </div>
      </div>

      <style>{`
        .navbar {
          height: 80px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid var(--border);
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text);
        }
        .logo-icon {
          font-size: 2rem;
        }
        .logo-text {
          background: linear-gradient(to right, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .nav-link {
          color: var(--text-muted);
          font-weight: 500;
          transition: color 0.3s ease;
        }
        .nav-link:hover {
          color: var(--primary);
        }
        .login-btn {
          padding: 0.5rem 1.25rem;
          font-size: 0.9rem;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
