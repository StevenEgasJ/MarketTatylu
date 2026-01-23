import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loyaltyAPI } from '../services/api';
import Swal from 'sweetalert2';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    cedula: '',
    photo: ''
  });
  const [loading, setLoading] = useState(false);
  const [loyalty, setLoyalty] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || user.name || '',
        apellido: user.apellido || '',
        telefono: user.telefono || user.phone || '',
        cedula: user.cedula || '',
        photo: user.photo || ''
      });
    }
    loadLoyalty();
  }, [user]);

  const loadLoyalty = async () => {
    try {
      const response = await loyaltyAPI.getPoints();
      setLoyalty(response.data);
    } catch (error) {
      console.log('Error cargando puntos:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convertir a base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData);
    } catch (error) {
      console.error('Error actualizando perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      await logout();
      navigate('/');
    }
  };

  const getPhotoSrc = () => {
    if (formData.photo && !formData.photo.includes('?text=')) {
      return formData.photo;
    }
    return '/default-avatar.png';
  };

  return (
    <main className="container py-4">
      <h1 className="mb-4 site-title">Mi Perfil</h1>

      <div className="row">
        <div className="col-12 col-lg-8">
          <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  maxLength="100"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Apellido</label>
                <input
                  type="text"
                  className="form-control"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  maxLength="100"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Teléfono</label>
                <input
                  type="tel"
                  className="form-control"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  maxLength="30"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Cédula</label>
                <input
                  type="text"
                  className="form-control"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  maxLength="30"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Foto de perfil</label>
              <div className="d-flex align-items-center gap-3">
                <img
                  src={getPhotoSrc()}
                  alt="Preview"
                  className="rounded-circle"
                  style={{ width: '64px', height: '64px', objectFit: 'cover', border: '2px solid #007bff' }}
                  onError={(e) => { e.target.src = '/default-avatar.png'; }}
                />
                <div className="flex-grow-1">
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control mb-2"
                    onChange={handleFileChange}
                  />
                  <input
                    type="text"
                    className="form-control"
                    name="photo"
                    value={formData.photo}
                    onChange={handleChange}
                    placeholder="O pega una URL"
                    maxLength="400"
                  />
                  <small className="text-muted">
                    Puedes subir una imagen o pegar una URL.
                  </small>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Guardando...
                  </>
                ) : (
                  'Guardar cambios'
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          </form>
        </div>

        {/* Panel de lealtad */}
        <div className="col-12 col-lg-4 mt-4 mt-lg-0">
          <div className="card p-4 shadow-sm loyalty-panel">
            <h5 className="mb-3">
              <i className="fas fa-star me-2 text-warning"></i>
              Programa de Lealtad
            </h5>
            
            {loyalty ? (
              <>
                <div className="mb-2">
                  Puntos disponibles: <strong>{loyalty.points || 0}</strong>
                </div>
                <div className="mb-2">
                  Nivel: <strong>{loyalty.tier || 'Bronze'}</strong>
                </div>
                <div className="mb-3">
                  Descuento disponible: <strong>${(loyalty.availableDiscount || 0).toFixed(2)}</strong>
                </div>
              </>
            ) : (
              <p className="text-muted">Cargando información...</p>
            )}

            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={loadLoyalty}
              >
                Actualizar
              </button>
              <a href="/loyalty" className="btn btn-sm btn-primary">
                Ver programa
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
