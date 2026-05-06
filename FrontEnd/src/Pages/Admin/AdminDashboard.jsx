import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import './Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, roles: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [usersData, rolesData] = await Promise.all([
        api.admin.getUsers(),
        api.admin.getRoles(),
      ]);
      setStats({
        users: usersData.users.length,
        roles: rolesData.roles.length,
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Cargando panel...</div>;
  }

  return (
    <div className="admin-container animate-fade-in">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <p className="admin-subtitle">Gestiona usuarios, roles y permisos del sistema</p>
      </div>

      <div className="admin-stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-number">{stats.users}</span>
            <span className="stat-label">Usuarios registrados</span>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon">🛡️</div>
          <div className="stat-info">
            <span className="stat-number">{stats.roles}</span>
            <span className="stat-label">Roles del sistema</span>
          </div>
        </div>
      </div>

      <div className="admin-actions-grid">
        <Link to="/admin/users" className="glass-card action-card">
          <h3>👤 Gestión de Usuarios</h3>
          <p>Registrar, editar roles, activar/desactivar y eliminar usuarios del sistema.</p>
        </Link>
        <Link to="/admin/roles" className="glass-card action-card">
          <h3>🔑 Gestión de Roles</h3>
          <p>Crear, editar y eliminar roles. Controla qué permisos tiene cada tipo de usuario.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
