import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import './SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    cedula: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const { confirmPassword, ...userData } = formData;
      const result = await register(userData);
      
      if (result.success) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error en registro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-main d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-11 col-md-9 col-lg-8 col-xl-7">
            <div className="register-container card shadow-lg border-0 rounded-3">
              <div className="card-body p-4 p-md-5">
                <h2 className="text-center mb-4 site-title">Crear Cuenta</h2>

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Nombre */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="nombre" className="form-label">Nombre *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                      />
                      {errors.nombre && (
                        <div className="invalid-feedback">{errors.nombre}</div>
                      )}
                    </div>

                    {/* Apellido */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="apellido" className="form-label">Apellido *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
                        id="apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        placeholder="Tu apellido"
                      />
                      {errors.apellido && (
                        <div className="invalid-feedback">{errors.apellido}</div>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo Electrónico *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ejemplo@correo.com"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="row">
                    {/* Teléfono */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="telefono" className="form-label">Teléfono *</label>
                      <input
                        type="tel"
                        className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        placeholder="0999999999"
                      />
                      {errors.telefono && (
                        <div className="invalid-feedback">{errors.telefono}</div>
                      )}
                    </div>

                    {/* Cédula */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="cedula" className="form-label">Cédula (opcional)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="cedula"
                        name="cedula"
                        value={formData.cedula}
                        onChange={handleChange}
                        placeholder="1234567890"
                      />
                    </div>
                  </div>

                  <div className="row">
                    {/* Password */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="password" className="form-label">Contraseña *</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Mínimo 6 caracteres"
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                        {errors.password && (
                          <div className="invalid-feedback">{errors.password}</div>
                        )}
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña *</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repite tu contraseña"
                      />
                      {errors.confirmPassword && (
                        <div className="invalid-feedback">{errors.confirmPassword}</div>
                      )}
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 mt-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Registrando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus me-2"></i>
                        Crear Cuenta
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-decoration-none fw-bold">
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
