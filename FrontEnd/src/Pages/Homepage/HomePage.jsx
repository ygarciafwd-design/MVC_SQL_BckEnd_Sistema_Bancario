import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import './homepage.css';

const HomePage = () => {
  const [message, setMessage] = useState('Conectando con el servidor...');

  useEffect(() => {
    // Test API connection
    api.request('')
      .then(data => setMessage(data.message))
      .catch(err => setMessage('Error al conectar con el servidor.'));
  }, []);

  return (
    <div className="home-container animate-fade-in">
      <header className="hero">
        <h1>Tu Futuro Financiero, <br /><span className="gradient-text">Simplificado.</span></h1>
        <p className="hero-subtitle">
          Gestiona tus cuentas, realiza transferencias y controla tus finanzas con la tecnología más avanzada y segura.
        </p>
        <div className="status-badge">
          <span className={`status-dot ${message.includes('Welcome') ? 'online' : 'offline'}`}></span>
          Status del Servidor: {message}
        </div>
      </header>

      <div className="features-grid">
        <div className="glass-card feature-card">
          <h3>Seguridad Total</h3>
          <p>Protegemos tus datos con los más altos estándares de cifrado bancario.</p>
        </div>
        <div className="glass-card feature-card">
          <h3>Rapidez</h3>
          <p>Transferencias instantáneas y acceso en tiempo real a tus movimientos.</p>
        </div>
        <div className="glass-card feature-card">
          <h3>Control</h3>
          <p>Herramientas intuitivas para que siempre sepas a dónde va tu dinero.</p>
        </div>
      </div>

      
    </div>
  );
};

export default HomePage;
