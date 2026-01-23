import { useState } from 'react';
import { publicAPI } from '../services/api';
import Swal from 'sweetalert2';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = 'El mensaje es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await publicAPI.sendContactForm(formData);
      
      await Swal.fire({
        icon: 'success',
        title: '¡Mensaje enviado!',
        text: 'Nos pondremos en contacto contigo pronto.',
        timer: 3000
      });

      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar el mensaje. Intenta nuevamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="container py-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold site-title">¡Contáctanos!</h2>
        </div>

        <div className="row g-4">
          {/* Formulario de Contacto */}
          <div className="col-lg-6 d-flex">
            <div className="card p-4 flex-grow-1 shadow-sm">
              <h4 className="mb-4">
                <i className="fas fa-envelope me-2"></i>
                Envíanos un mensaje
              </h4>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
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

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email *</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="telefono" className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="0999999999"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="mensaje" className="form-label">Mensaje *</label>
                  <textarea
                    className={`form-control ${errors.mensaje ? 'is-invalid' : ''}`}
                    id="mensaje"
                    name="mensaje"
                    rows="4"
                    value={formData.mensaje}
                    onChange={handleChange}
                    placeholder="¿En qué podemos ayudarte?"
                  ></textarea>
                  {errors.mensaje && (
                    <div className="invalid-feedback">{errors.mensaje}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane me-2"></i>
                      Enviar mensaje
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="col-lg-6 d-flex flex-column">
            <div className="card p-4 shadow-sm mb-4">
              <h4 className="mb-4">
                <i className="fas fa-info-circle me-2"></i>
                Información de Contacto
              </h4>

              <div className="contact-info">
                <div className="d-flex mb-3">
                  <i className="fas fa-map-marker-alt fa-lg text-primary me-3 mt-1"></i>
                  <div>
                    <strong>Dirección</strong>
                    <p className="mb-0 text-muted">Sangolquí, Ecuador</p>
                  </div>
                </div>

                <div className="d-flex mb-3">
                  <i className="fas fa-phone fa-lg text-success me-3 mt-1"></i>
                  <div>
                    <strong>Teléfono</strong>
                    <p className="mb-0">
                      <a href="tel:+593999999999" className="text-muted">+593 99 999 9999</a>
                    </p>
                  </div>
                </div>

                <div className="d-flex mb-3">
                  <i className="fas fa-envelope fa-lg text-danger me-3 mt-1"></i>
                  <div>
                    <strong>Email</strong>
                    <p className="mb-0">
                      <a href="mailto:villacreses.tati1977@gmail.com" className="text-muted">
                        villacreses.tati1977@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="d-flex">
                  <i className="fas fa-clock fa-lg text-warning me-3 mt-1"></i>
                  <div>
                    <strong>Horario de Atención</strong>
                    <p className="mb-0 text-muted">
                      Lunes a Sábado: 7:00 AM - 9:00 PM<br />
                      Domingo: 8:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Redes sociales */}
              <div className="mt-4 pt-3 border-top">
                <h6>Síguenos en redes</h6>
                <div className="social-links">
                  <a 
                    href="https://www.facebook.com/share/1AJVbvMWzj/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary me-2"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a 
                    href="https://vm.tiktok.com/ZMA43cKEe/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline-dark me-2"
                  >
                    <i className="fab fa-tiktok"></i>
                  </a>
                  <a 
                    href="https://wa.me/593999999999" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline-success"
                  >
                    <i className="fab fa-whatsapp"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Mapa */}
            <div className="card p-0 shadow-sm flex-grow-1 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15959.538461621992!2d-78.45!3d-0.33!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d5a2c70eb3f3e5%3A0x5d8d6b7c5e8f9a0b!2sSangolqu%C3%AD!5e0!3m2!1ses!2sec!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '300px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Tatylu"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
