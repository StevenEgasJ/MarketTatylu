import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import './Cart.css';

const Cart = () => {
  const { 
    items, 
    subtotal, 
    discount, 
    total, 
    coupon,
    updateQuantity, 
    removeFromCart, 
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemove = async (productId, productName) => {
    const result = await Swal.fire({
      title: '¿Eliminar producto?',
      text: `¿Estás seguro de eliminar "${productName}" del carrito?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      removeFromCart(productId);
    }
  };

  const handleClearCart = async () => {
    const result = await Swal.fire({
      title: '¿Vaciar carrito?',
      text: 'Se eliminarán todos los productos del carrito',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      clearCart();
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      const result = await Swal.fire({
        title: 'Inicia sesión',
        text: 'Necesitas iniciar sesión para continuar con la compra',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Iniciar sesión',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        navigate('/login', { state: { from: { pathname: '/checkout' } } });
      }
      return;
    }

    if (items.length === 0) {
      await Swal.fire({
        title: 'Carrito vacío',
        text: 'Agrega productos antes de continuar',
        icon: 'warning'
      });
      return;
    }

    navigate('/checkout');
  };

  const handleApplyCoupon = async () => {
    const { value: code } = await Swal.fire({
      title: 'Aplicar cupón',
      input: 'text',
      inputPlaceholder: 'Ingresa tu código de cupón',
      showCancelButton: true,
      confirmButtonText: 'Aplicar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Por favor ingresa un código';
        }
      }
    });

    if (code) {
      await applyCoupon(code);
    }
  };

  return (
    <main>
      <div className="container-fluid py-4">
        <div className="row cart-layout-row">
          <div className="col-12">
            <h1 className="text-center mb-4 site-title">
              <i className="fas fa-shopping-cart me-2"></i>
              Carrito de Compras
            </h1>

            <div className="row">
              {/* Lista de productos */}
              <div className="col-12 col-lg-8 mb-4">
                {items.length === 0 ? (
                  <div className="card p-5 text-center">
                    <i className="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
                    <h4>Tu carrito está vacío</h4>
                    <p className="text-muted">¡Agrega productos para comenzar!</p>
                    <Link to="/products" className="btn btn-primary">
                      <i className="fas fa-shopping-bag me-2"></i>
                      Ver Productos
                    </Link>
                  </div>
                ) : (
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <span>
                        <strong>{items.length}</strong> producto(s) en el carrito
                      </span>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={handleClearCart}
                      >
                        <i className="fas fa-trash me-1"></i>
                        Vaciar carrito
                      </button>
                    </div>
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Producto</th>
                              <th className="text-center">Precio</th>
                              <th className="text-center">Cantidad</th>
                              <th className="text-center">Subtotal</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map(item => {
                              const productId = item.productId || item._id;
                              const nombre = item.nombre || item.name;
                              const precio = item.precio || item.price || 0;
                              const imagen = item.imagen || item.image;
                              const itemSubtotal = precio * item.quantity;

                              return (
                                <tr key={productId}>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <img
                                        src={imagen || '/placeholder-product.png'}
                                        alt={nombre}
                                        className="cart-item-image me-3"
                                        onError={(e) => { e.target.src = '/placeholder-product.png'; }}
                                      />
                                      <div>
                                        <strong>{nombre}</strong>
                                        {item.stock && (
                                          <small className="d-block text-muted">
                                            Stock: {item.stock}
                                          </small>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="text-center align-middle">
                                    ${precio.toFixed(2)}
                                  </td>
                                  <td className="text-center align-middle">
                                    <div className="input-group input-group-sm justify-content-center" style={{ width: '120px', margin: '0 auto' }}>
                                      <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => handleQuantityChange(productId, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                      >
                                        -
                                      </button>
                                      <input
                                        type="number"
                                        className="form-control text-center"
                                        value={item.quantity}
                                        min="1"
                                        max={item.stock || 99}
                                        onChange={(e) => handleQuantityChange(productId, parseInt(e.target.value) || 1)}
                                      />
                                      <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => handleQuantityChange(productId, item.quantity + 1)}
                                        disabled={item.stock && item.quantity >= item.stock}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </td>
                                  <td className="text-center align-middle fw-bold">
                                    ${itemSubtotal.toFixed(2)}
                                  </td>
                                  <td className="text-center align-middle">
                                    <button
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => handleRemove(productId, nombre)}
                                      title="Eliminar"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Resumen */}
              <div className="col-12 col-lg-4">
                <div className="card summary-card">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fas fa-receipt me-2"></i>
                      Resumen del Pedido
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>

                    {coupon && (
                      <div className="d-flex justify-content-between mb-2 text-success">
                        <span>
                          Descuento ({coupon.code}):
                          <button
                            className="btn btn-link btn-sm text-danger p-0 ms-2"
                            onClick={removeCoupon}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}

                    <hr className="summary-hr" />

                    <div className="d-flex justify-content-between mb-3">
                      <strong>Total:</strong>
                      <strong className="fs-4">${total.toFixed(2)}</strong>
                    </div>

                    {/* Cupón */}
                    {!coupon && items.length > 0 && (
                      <div className="mb-3">
                        <button
                          className="btn btn-outline-secondary w-100"
                          onClick={handleApplyCoupon}
                        >
                          <i className="fas fa-tag me-2"></i>
                          Aplicar cupón
                        </button>
                      </div>
                    )}

                    <button
                      className="btn btn-order w-100 py-2"
                      onClick={handleCheckout}
                      disabled={items.length === 0}
                    >
                      <i className="fas fa-credit-card me-2"></i>
                      Proceder al Pago
                    </button>

                    <Link to="/products" className="btn btn-link w-100 mt-2">
                      <i className="fas fa-arrow-left me-2"></i>
                      Seguir comprando
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
