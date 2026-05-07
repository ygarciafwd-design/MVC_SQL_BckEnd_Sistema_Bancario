import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../services/AuthContext';
import './Admin.css';

const UserManagement = () => {
  const { user: currentUser, isAdmin, isModerator } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    identityDocument: '', role_id: '', phone: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, rolesData] = await Promise.all([
        api.admin.getUsers(),
        api.admin.getRoles(),
      ]);
      setUsers(usersData.users);
      setRoles(rolesData.roles);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRoleId) => {
    try {
      await api.admin.updateUserRole(userId, newRoleId);
      setSuccess('Rol actualizado correctamente');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await api.admin.updateUserStatus(userId, newStatus);
      setSuccess(`Estado actualizado a "${newStatus}"`);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (userId, name) => {
    if (!window.confirm(`¿Estás seguro de eliminar a ${name}? Esta acción no se puede deshacer.`)) return;
    try {
      await api.admin.deleteUser(userId);
      setSuccess('Usuario eliminado correctamente');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.admin.createUser({
        ...createForm,
        role_id: createForm.role_id ? parseInt(createForm.role_id) : undefined
      });
      setSuccess('Usuario creado exitosamente');
      setShowCreateModal(false);
      setCreateForm({ firstName: '', lastName: '', email: '', password: '', identityDocument: '', role_id: '', phone: '' });
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="admin-loading">Cargando usuarios...</div>;

  return (
    <div className="admin-container animate-fade-in">
      <Link to="/admin" className="back-link">← Volver al panel</Link>

      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Gestión de Usuarios</h1>
          <p className="admin-subtitle">{users.length} usuarios registrados</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          + Nuevo Usuario
        </button>
      </div>

      {success && <div className="toast-success">{success}</div>}
      {error && <div className="error-msg">{error}</div>}

      <div className="glass-card admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Documento</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const isTargetAdmin = user.role?.name === 'admin';
              const canEdit = isAdmin || (isModerator && !isTargetAdmin);

              return (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.identityDocument}</td>
                  <td>
                    <select
                      className="admin-select"
                      value={user.role_id}
                      disabled={!canEdit}
                      onChange={(e) => handleRoleChange(user.id, parseInt(e.target.value))}
                    >
                      {roles.map(role => (
                        <option 
                          key={role.id} 
                          value={role.id}
                          disabled={isModerator && role.name === 'admin'}
                        >
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span className={`status-${user.status}`}>{user.status}</span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      {canEdit && (
                        <>
                          {user.status === 'active' ? (
                            <button className="btn-sm btn-danger" onClick={() => handleStatusChange(user.id, 'blocked')}>
                              Bloquear
                            </button>
                          ) : (
                            <button className="btn-sm btn-success" onClick={() => handleStatusChange(user.id, 'active')}>
                              Activar
                            </button>
                          )}
                          <button 
                            className="btn-sm btn-danger" 
                            disabled={user.id === currentUser.id}
                            onClick={() => handleDelete(user.id, `${user.firstName} ${user.lastName}`)}
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                      {!canEdit && <span className="text-muted" style={{ fontSize: '0.8rem' }}>Protegido</span>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Registrar Nuevo Usuario</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" required value={createForm.firstName}
                  onChange={e => setCreateForm({...createForm, firstName: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Apellido</label>
                <input type="text" required value={createForm.lastName}
                  onChange={e => setCreateForm({...createForm, lastName: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" required value={createForm.email}
                  onChange={e => setCreateForm({...createForm, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <input type="password" required minLength={6} value={createForm.password}
                  onChange={e => setCreateForm({...createForm, password: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Documento de Identidad</label>
                <input type="text" required value={createForm.identityDocument}
                  onChange={e => setCreateForm({...createForm, identityDocument: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Teléfono (opcional)</label>
                <input type="text" value={createForm.phone}
                  onChange={e => setCreateForm({...createForm, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Rol</label>
                <select className="admin-select" style={{ width: '100%', padding: '0.75rem' }}
                  value={createForm.role_id}
                  onChange={e => setCreateForm({...createForm, role_id: e.target.value})}>
                  <option value="">Seleccionar rol...</option>
                  {roles.map(role => (
                    <option 
                      key={role.id} 
                      value={role.id}
                      disabled={isModerator && role.name === 'admin'}
                    >
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Crear Usuario</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
