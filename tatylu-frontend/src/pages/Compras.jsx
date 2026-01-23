import { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import './Compras.css';

const Compras = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getUserOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error cargando órdenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'pendiente': 'bg-warning text-dark',
      'pending': 'bg-warning text-dark',
      'procesando': 'bg-info',
      'processing': 'bg-info',
      'enviado': 'bg-primary',
      'shipped': 'bg-primary',
      'entregado': 'bg-success',
      'delivered': 'bg-success',
      'cancelado': 'bg-danger',
      'cancelled': 'bg-danger'
    };
    return statusMap[status?.toLowerCase()] || 'bg-secondary';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Pendiente',
      'processing': 'Procesando',
      'shipped': 'Enviado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };
    return statusMap[status?.toLowerCase()] || status;
  };

  const getPaymentMethodText = (method) => {
    const methodMap = {
      'efectivo': 'Efectivo',
      'cash': 'Efectivo',
      'transferencia': 'Transferencia',
      'transfer': 'Transferencia',
      'tarjeta': 'Tarjeta',
      'card': 'Tarjeta'
    };
    return methodMap[method?.toLowerCase()] || method;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const viewOrderDetails = async (order) => {
    const items = order.items || order.productos || [];
    const itemsHtml = items.map(item => {
      const nombre = item.nombre || item.name;
      const precio = item.precio || item.price || 0;
      const qty = item.quantity || item.cantidad || 1;
      return `<tr>
        <td>${nombre}</td>
        <td class="text-center">${qty}</td>
        <td class="text-end">$${(precio * qty).toFixed(2)}</td>
      </tr>`;
    }).join('');

    await Swal.fire({
      title: `Orden #${order._id || order.id}`,
      html: `
        <div class="text-start">
          <p><strong>Fecha:</strong> ${formatDate(order.fecha || order.createdAt)}</p>
          <p><strong>Estado:</strong> <span class="badge ${getStatusBadgeClass(order.estado || order.status)}">${getStatusText(order.estado || order.status)}</span></p>
          <p><strong>Método de pago:</strong> ${getPaymentMethodText(order.metodoPago || order.paymentMethod)}</p>
          <hr>
          <table class="table table-sm">
            <thead>
              <tr>
                <th>Producto</th>
                <th class="text-center">Cant.</th>
                <th class="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr class="fw-bold">
                <td colspan="2">Total</td>
                <td class="text-end">$${(order.total || 0).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          ${order.direccion ? `<p><strong>Dirección:</strong> ${order.direccion}</p>` : ''}
          ${order.notas ? `<p><strong>Notas:</strong> ${order.notas}</p>` : ''}
        </div>
      `,
      width: '600px',
      confirmButtonText: 'Cerrar'
    });
  };

  const downloadInvoice = async (orderId) => {
    try {
      const response = await ordersAPI.getInvoice(orderId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `factura-${orderId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error descargando factura:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo descargar la factura'
      });
    }
  };

  return (
    <main className="container my-5">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mb-4 site-title">
            <i className="fas fa-shopping-bag me-2"></i>
            Mis Compras
          </h1>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3">Cargando historial de compras...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="card p-5 text-center">
              <i className="fas fa-box-open fa-4x text-muted mb-3"></i>
              <h4>No tienes compras aún</h4>
              <p className="text-muted">Cuando realices una compra, aparecerá aquí.</p>
              <a href="/products" className="btn btn-primary">
                <i className="fas fa-shopping-cart me-2"></i>
                Ir a comprar
              </a>
            </div>
          ) : (
            <div className="row">
              {orders.map(order => {
                const orderId = order._id || order.id;
                const fecha = order.fecha || order.createdAt;
                const estado = order.estado || order.status;
                const total = order.total || 0;
                const items = order.items || order.productos || [];

                return (
                  <div key={orderId} className="col-12 col-md-6 col-lg-4 mb-4">
                    <div className="card order-card h-100">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <span className="fw-bold">#{orderId?.slice(-8)}</span>
                        <span className={`badge ${getStatusBadgeClass(estado)}`}>
                          {getStatusText(estado)}
                        </span>
                      </div>
                      <div className="card-body">
                        <p className="text-muted small mb-2">
                          <i className="fas fa-calendar me-1"></i>
                          {formatDate(fecha)}
                        </p>
                        <p className="mb-2">
                          <strong>{items.length}</strong> producto(s)
                        </p>
                        <h5 className="text-primary mb-0">
                          Total: ${total.toFixed(2)}
                        </h5>
                      </div>
                      <div className="card-footer bg-transparent">
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-outline-primary btn-sm flex-grow-1"
                            onClick={() => viewOrderDetails(order)}
                          >
                            <i className="fas fa-eye me-1"></i>
                            Ver detalles
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => downloadInvoice(orderId)}
                            title="Descargar factura"
                          >
                            <i className="fas fa-file-pdf"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Compras;
