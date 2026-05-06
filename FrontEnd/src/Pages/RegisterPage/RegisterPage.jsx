import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import '../LoginPage/LoginPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    identityDocument: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }

    setLoading(true);
    setError('');

    try {
      await api.auth.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        identityDocument: formData.identityDocument,
        password: formData.password
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-container animate-fade-in">
        <div className="glass-card login-card">
          <div className="success-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2>¡Registro Exitoso!</h2>
          <p className="subtitle">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container animate-fade-in">
      <div className="glass-card login-card" style={{ maxWidth: '500px' }}>
        <h2>Crear Cuenta</h2>
        <p className="subtitle">Únete a la banca del futuro</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Nombre</label>
              <input 
                type="text" 
                placeholder="Nombre"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input 
                type="text" 
                placeholder="Apellido"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="tu@correo.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Documento de Identidad (DNI/Pasaporte)</label>
            <input 
              type="text" 
              placeholder="12345678X"
              required
              value={formData.identityDocument}
              onChange={(e) => setFormData({...formData, identityDocument: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>

          <button type="submit" className="btn-primary login-submit" disabled={loading}>
            {loading ? 'Procesando...' : 'Registrarse'}
          </button>
          
          <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Inicia Sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
