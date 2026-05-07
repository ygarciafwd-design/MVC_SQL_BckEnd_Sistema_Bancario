import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../services/AuthContext';
import './Admin.css';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
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
        <h1>{isAdmin ? 'Panel de Administración' : 'Panel de Gestión'}</h1>
        <p className="admin-subtitle">
          {isAdmin 
            ? 'Gestiona usuarios, roles y permisos globales del sistema' 
            : 'Supervisa y gestiona el estado de los usuarios y clientes'}
        </p>
      </div>

      <div className="admin-stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-number">{stats.users}</span>
            <span className="stat-label">Usuarios registrados</span>
          </div>
        </div>
        {isAdmin && (
          <div className="glass-card stat-card">
            <div className="stat-icon">🛡️</div>
            <div className="stat-info">
              <span className="stat-number">{stats.roles}</span>
              <span className="stat-label">Roles del sistema</span>
            </div>
          </div>
        )}
      </div>

      <div className="admin-actions-grid">
        <Link to="/admin/users" className="glass-card action-card">
          <h3>👤 Gestión de Usuarios</h3>
          <p>
            {isAdmin 
              ? 'Control total: Registrar, editar roles, activar y eliminar cualquier usuario.' 
              : 'Gestión operativa: Supervisar clientes, activar cuentas y gestionar roles básicos.'}
          </p>
        </Link>
        
        {isAdmin && (
          <Link to="/admin/roles" className="glass-card action-card">
            <h3>🔑 Gestión de Roles</h3>
            <p>Crear, editar y eliminar roles. Controla la estructura de permisos del banco.</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
