import { useState, useEffect } from 'react';
import { 
  productsAPI, 
  usersAPI, 
  ordersAPI, 
  reportsAPI,
  suppliersAPI,
  reviewsAPI 
} from '../services/api';
import Swal from 'sweetalert2';
import './Admin.css';

const Admin = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [productsRes, usersRes, ordersRes] = await Promise.all([
        productsAPI.getAll().catch(() => ({ data: [] })),
        usersAPI.getAll().catch(() => ({ data: [] })),
        ordersAPI.getAll().catch(() => ({ data: [] }))
      ]);

      const productsData = productsRes.data || [];
      const usersData = usersRes.data || [];
      const ordersData = ordersRes.data || [];

      setProducts(productsData);
      setUsers(usersData);
      setOrders(ordersData);

      // Calcular estadísticas
      const totalRevenue = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);
      setStats({
        totalProducts: productsData.length,
        totalUsers: usersData.length,
        totalOrders: ordersData.length,
        totalRevenue
      });
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSuppliers = async () => {
    try {
      const response = await suppliersAPI.getAll();
      setSuppliers(response.data || []);
    } catch (error) {
      console.error('Error cargando proveedores:', error);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await reviewsAPI.getAll();
      setReviews(response.data || []);
    } catch (error) {
      console.error('Error cargando reseñas:', error);
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (section === 'suppliers') loadSuppliers();
    if (section === 'reviews') loadReviews();
  };

  const handleDeleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await productsAPI.delete(productId);
        setProducts(products.filter(p => p._id !== productId));
        Swal.fire('Eliminado', 'El producto ha sido eliminado', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      setOrders(orders.map(o => 
        o._id === orderId ? { ...o, estado: newStatus, status: newStatus } : o
      ));
      Swal.fire({
        icon: 'success',
        title: 'Estado actualizado',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard' },
    { id: 'products', icon: 'fa-box', label: 'Productos' },
    { id: 'orders', icon: 'fa-shopping-cart', label: 'Pedidos' },
    { id: 'users', icon: 'fa-users', label: 'Usuarios' },
    { id: 'suppliers', icon: 'fa-truck', label: 'Proveedores' },
    { id: 'reviews', icon: 'fa-star', label: 'Reseñas' },
    { id: 'reports', icon: 'fa-chart-bar', label: 'Reportes' }
  ];

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando panel de administración...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 admin-sidebar p-0">
          <nav className="nav flex-column py-3">
            {menuItems.map(item => (
              <button
                key={item.id}
                className={`nav-link text-start ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => handleSectionChange(item.id)}
              >
                <i className={`fas ${item.icon} me-2`}></i>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-4">
          {/* Dashboard */}
          {activeSection === 'dashboard' && (
            <div>
              <h2 className="mb-4">Dashboard</h2>
              <div className="row">
                <div className="col-md-3 mb-4">
                  <div className="card bg-primary text-white p-4">
                    <i className="fas fa-box fa-2x mb-2"></i>
                    <h3>{stats.totalProducts}</h3>
                    <p className="mb-0">Productos</p>
                  </div>
                </div>
                <div className="col-md-3 mb-4">
                  <div className="card bg-success text-white p-4">
                    <i className="fas fa-users fa-2x mb-2"></i>
                    <h3>{stats.totalUsers}</h3>
                    <p className="mb-0">Usuarios</p>
                  </div>
                </div>
                <div className="col-md-3 mb-4">
                  <div className="card bg-info text-white p-4">
                    <i className="fas fa-shopping-cart fa-2x mb-2"></i>
                    <h3>{stats.totalOrders}</h3>
                    <p className="mb-0">Pedidos</p>
                  </div>
                </div>
                <div className="col-md-3 mb-4">
                  <div className="card bg-warning text-dark p-4">
                    <i className="fas fa-dollar-sign fa-2x mb-2"></i>
                    <h3>${stats.totalRevenue.toFixed(2)}</h3>
                    <p className="mb-0">Ingresos</p>
                  </div>
                </div>
              </div>

              {/* Últimos pedidos */}
              <div className="card mt-4">
                <div className="card-header">
                  <h5 className="mb-0">Últimos Pedidos</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Cliente</th>
                          <th>Total</th>
                          <th>Estado</th>
                          <th>Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map(order => (
                          <tr key={order._id}>
                            <td>#{order._id?.slice(-6)}</td>
                            <td>{order.cliente?.email || order.userEmail}</td>
                            <td>${(order.total || 0).toFixed(2)}</td>
                            <td>
                              <span className={`badge ${
                                order.estado === 'entregado' ? 'bg-success' :
                                order.estado === 'pendiente' ? 'bg-warning text-dark' :
                                'bg-info'
                              }`}>
                                {order.estado || order.status}
                              </span>
                            </td>
                            <td>{new Date(order.fecha || order.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Section */}
          {activeSection === 'products' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Productos</h2>
                <button className="btn btn-primary">
                  <i className="fas fa-plus me-2"></i>
                  Nuevo Producto
                </button>
              </div>
              
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Imagen</th>
                          <th>Nombre</th>
                          <th>Precio</th>
                          <th>Stock</th>
                          <th>Categoría</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => (
                          <tr key={product._id}>
                            <td>
                              <img 
                                src={product.imagen || product.image || '/placeholder-product.png'} 
                                alt={product.nombre}
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                className="rounded"
                              />
                            </td>
                            <td>{product.nombre || product.name}</td>
                            <td>${(product.precio || product.price || 0).toFixed(2)}</td>
                            <td>
                              <span className={`badge ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                                {product.stock}
                              </span>
                            </td>
                            <td>{product.categoria || product.category}</td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary me-1">
                                <i className="fas fa-edit"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteProduct(product._id)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders Section */}
          {activeSection === 'orders' && (
            <div>
              <h2 className="mb-4">Pedidos</h2>
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Cliente</th>
                          <th>Productos</th>
                          <th>Total</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order._id}>
                            <td>#{order._id?.slice(-6)}</td>
                            <td>{order.cliente?.email || order.userEmail}</td>
                            <td>{(order.items || order.productos || []).length}</td>
                            <td>${(order.total || 0).toFixed(2)}</td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                value={order.estado || order.status}
                                onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              >
                                <option value="pendiente">Pendiente</option>
                                <option value="procesando">Procesando</option>
                                <option value="enviado">Enviado</option>
                                <option value="entregado">Entregado</option>
                                <option value="cancelado">Cancelado</option>
                              </select>
                            </td>
                            <td>
                              <button className="btn btn-sm btn-outline-info">
                                <i className="fas fa-eye"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Section */}
          {activeSection === 'users' && (
            <div>
              <h2 className="mb-4">Usuarios</h2>
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Email</th>
                          <th>Rol</th>
                          <th>Registro</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user._id}>
                            <td>{user.nombre || user.name} {user.apellido || ''}</td>
                            <td>{user.email}</td>
                            <td>
                              <span className={`badge ${user.rol === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                                {user.rol || user.role || 'cliente'}
                              </span>
                            </td>
                            <td>{new Date(user.fechaRegistro || user.createdAt).toLocaleDateString()}</td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary me-1">
                                <i className="fas fa-edit"></i>
                              </button>
                              <button className="btn btn-sm btn-outline-danger">
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other sections placeholder */}
          {['suppliers', 'reviews', 'reports'].includes(activeSection) && (
            <div>
              <h2 className="mb-4">{menuItems.find(m => m.id === activeSection)?.label}</h2>
              <div className="card p-5 text-center">
                <i className={`fas ${menuItems.find(m => m.id === activeSection)?.icon} fa-4x text-muted mb-3`}></i>
                <p className="text-muted">Sección en desarrollo</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
