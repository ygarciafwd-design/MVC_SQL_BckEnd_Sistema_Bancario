import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import './Admin.css';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [createForm, setCreateForm] = useState({ name: '', description: '' });

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const data = await api.admin.getRoles();
      setRoles(data.roles);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.admin.createRole(createForm);
      setSuccess('Rol creado exitosamente');
      setShowCreateModal(false);
      setCreateForm({ name: '', description: '' });
      loadRoles();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.admin.updateRole(editingRole.id, {
        name: editingRole.name,
        description: editingRole.description
      });
      setSuccess('Rol actualizado exitosamente');
      setShowEditModal(false);
      setEditingRole(null);
      loadRoles();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (role) => {
    if (!window.confirm(`¿Estás seguro de eliminar el rol "${role.name}"?`)) return;
    try {
      await api.admin.deleteRole(role.id);
      setSuccess('Rol eliminado correctamente');
      loadRoles();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const openEdit = (role) => {
    setEditingRole({ ...role });
    setShowEditModal(true);
  };

  if (loading) return <div className="admin-loading">Cargando roles...</div>;

  return (
    <div className="admin-container animate-fade-in">
      <Link to="/admin" className="back-link">← Volver al panel</Link>

      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Gestión de Roles</h1>
          <p className="admin-subtitle">{roles.length} roles configurados</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          + Nuevo Rol
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
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(role => (
              <tr key={role.id}>
                <td>{role.id}</td>
                <td>
                  <span className="role-badge" style={{ fontSize: '0.85rem', padding: '0.25rem 0.75rem' }}>
                    {role.name}
                  </span>
                </td>
                <td>{role.description || '—'}</td>
                <td>
                  <div className="admin-actions">
                    <button className="btn-sm btn-edit" onClick={() => openEdit(role)}>
                      Editar
                    </button>
                    {!['admin', 'client'].includes(role.name) && (
                      <button className="btn-sm btn-danger" onClick={() => handleDelete(role)}>
                        Eliminar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Crear Nuevo Rol</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Nombre del Rol</label>
                <input type="text" required placeholder="ej: manager, auditor..."
                  value={createForm.name}
                  onChange={e => setCreateForm({...createForm, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <input type="text" placeholder="Descripción del rol"
                  value={createForm.description}
                  onChange={e => setCreateForm({...createForm, description: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Crear Rol</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditModal && editingRole && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Editar Rol: {editingRole.name}</h3>
            <form onSubmit={handleEdit}>
              <div className="form-group">
                <label>Nombre del Rol</label>
                <input type="text" required value={editingRole.name}
                  disabled={['admin', 'client'].includes(editingRole.name)}
                  onChange={e => setEditingRole({...editingRole, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <input type="text" value={editingRole.description || ''}
                  onChange={e => setEditingRole({...editingRole, description: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
