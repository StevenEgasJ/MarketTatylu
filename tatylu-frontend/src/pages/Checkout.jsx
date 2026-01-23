import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { checkoutAPI, ordersAPI } from '../services/api';
import Swal from 'sweetalert2';
import './Checkout.css';

const Checkout = () => {
  const { items, subtotal, discount, total, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    direccion: '',
    ciudad: '',
    telefono: '',
    metodoPago: 'efectivo',
    notas: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Pre-llenar datos del usuario
    if (user) {
      setFormData(prev => ({
        ...prev,
        telefono: user.telefono || user.phone || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    // Si el carrito está vacío, redirigir
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

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

    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }

    if (!formData.ciudad.trim()) {
      newErrors.ciudad = 'La ciudad es requerida';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Preparar datos de la orden
      const orderData = {
        items: items.map(item => ({
          productId: item.productId || item._id,
          nombre: item.nombre || item.name,
          precio: item.precio || item.price,
          quantity: item.quantity
        })),
        subtotal,
        discount,
        total,
        coupon: coupon?.code,
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        telefono: formData.telefono,
        metodoPago: formData.metodoPago,
        notas: formData.notas,
        cliente: {
          email: user.email,
          nombre: user.nombre || user.name,
          apellido: user.apellido || ''
        }
      };

      // Crear la orden
      const response = await ordersAPI.create(orderData);

      // Limpiar carrito
      await clearCart();

      // Mostrar confirmación
      await Swal.fire({
        icon: 'success',
        title: '¡Pedido realizado!',
        html: `
          <p>Tu pedido ha sido procesado exitosamente.</p>
          <p><strong>Número de orden:</strong> ${response.data.orderId || response.data._id}</p>
          <p>Recibirás un correo con los detalles de tu compra.</p>
        `,
        confirmButtonText: 'Ver mis compras'
      });

      // Redirigir a historial de compras
      navigate('/compras');

    } catch (error) {
      console.error('Error procesando orden:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo procesar tu pedido. Intenta nuevamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-fluid py-4">
      <div className="row">
        {/* Formulario de envío */}
        <div className="col-12 col-lg-7">
          <div className="card p-4 mb-4">
            <h4 className="mb-4">
              <i className="fas fa-shipping-fast me-2"></i>
              Información de Envío
            </h4>

            <form onSubmit={handleSubmit}>
              {/* Dirección */}
              <div className="mb-3">
                <label htmlFor="direccion" className="form-label">Dirección *</label>
                <input
                  type="text"
                  className={`form-control ${errors.direccion ? 'is-invalid' : ''}`}
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Calle principal, número, referencias"
                />
                {errors.direccion && (
                  <div className="invalid-feedback">{errors.direccion}</div>
                )}
              </div>

              {/* Ciudad */}
              <div className="mb-3">
                <label htmlFor="ciudad" className="form-label">Ciudad *</label>
                <input
                  type="text"
                  className={`form-control ${errors.ciudad ? 'is-invalid' : ''}`}
                  id="ciudad"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  placeholder="Sangolquí, Quito, etc."
                />
                {errors.ciudad && (
                  <div className="invalid-feedback">{errors.ciudad}</div>
                )}
              </div>

              {/* Teléfono */}
              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">Teléfono de contacto *</label>
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

              {/* Método de pago */}
              <div className="mb-3">
                <label className="form-label">Método de Pago *</label>
                <div className="row">
                  <div className="col-6 col-md-4 mb-2">
                    <div className={`form-check payment-option p-3 border rounded ${formData.metodoPago === 'efectivo' ? 'border-primary bg-light' : ''}`}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="metodoPago"
                        id="efectivo"
                        value="efectivo"
                        checked={formData.metodoPago === 'efectivo'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="efectivo">
                        <i className="fas fa-money-bill-wave me-2"></i>
                        Efectivo
                      </label>
                    </div>
                  </div>
                  <div className="col-6 col-md-4 mb-2">
                    <div className={`form-check payment-option p-3 border rounded ${formData.metodoPago === 'transferencia' ? 'border-primary bg-light' : ''}`}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="metodoPago"
                        id="transferencia"
                        value="transferencia"
                        checked={formData.metodoPago === 'transferencia'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="transferencia">
                        <i className="fas fa-university me-2"></i>
                        Transferencia
                      </label>
                    </div>
                  </div>
                  <div className="col-6 col-md-4 mb-2">
                    <div className={`form-check payment-option p-3 border rounded ${formData.metodoPago === 'tarjeta' ? 'border-primary bg-light' : ''}`}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="metodoPago"
                        id="tarjeta"
                        value="tarjeta"
                        checked={formData.metodoPago === 'tarjeta'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="tarjeta">
                        <i className="fas fa-credit-card me-2"></i>
                        Tarjeta
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div className="mb-4">
                <label htmlFor="notas" className="form-label">Notas adicionales (opcional)</label>
                <textarea
                  className="form-control"
                  id="notas"
                  name="notas"
                  rows="3"
                  value={formData.notas}
                  onChange={handleChange}
                  placeholder="Instrucciones especiales de entrega, etc."
                ></textarea>
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                className="btn btn-order w-100 py-3"
                disabled={loading || items.length === 0}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Procesando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check me-2"></i>
                    Confirmar Pedido - ${total.toFixed(2)}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="col-12 col-lg-5">
          <div className="card p-4 summary-card sticky-top" style={{ top: '20px' }}>
            <h5 className="mb-3">
              <i className="fas fa-receipt me-2"></i>
              Resumen del Pedido
            </h5>

            {/* Lista de productos */}
            <div className="checkout-items mb-3">
              {items.map(item => {
                const nombre = item.nombre || item.name;
                const precio = item.precio || item.price || 0;
                return (
                  <div key={item.productId || item._id} className="d-flex justify-content-between mb-2">
                    <span>
                      {nombre} x{item.quantity}
                    </span>
                    <span>${(precio * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <hr className="summary-hr" />

            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="d-flex justify-content-between mb-2 discount-line">
                <span>Descuento ({coupon?.code}):</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="d-flex justify-content-between mb-2">
              <span>Envío:</span>
              <span className="text-success">Gratis</span>
            </div>

            <hr className="summary-hr" />

            <div className="d-flex justify-content-between">
              <strong className="fs-5">Total:</strong>
              <strong className="fs-4">${total.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
