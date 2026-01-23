import { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/common/ProductCard';
import ProductDetailModal from '../components/common/ProductDetailModal';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll().catch(() => ({ data: [] }))
      ]);

      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => {
        const nombre = (product.nombre || product.name || '').toLowerCase();
        const descripcion = (product.descripcion || product.description || '').toLowerCase();
        return nombre.includes(term) || descripcion.includes(term);
      });
    }

    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(product => {
        const cat = product.categoria || product.category || '';
        return cat.toLowerCase() === selectedCategory.toLowerCase();
      });
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleAddToCart = async (product, quantity = 1) => {
    await addToCart(product, quantity);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  // Obtener categorías únicas de los productos
  const uniqueCategories = [...new Set(products.map(p => p.categoria || p.category).filter(Boolean))];

  return (
    <main>
      <div className="container py-4">
        <h1 className="text-center mb-4 site-title">Productos Tatylu</h1>

        {/* Barra de búsqueda y filtros */}
        <div className="row mb-4 align-items-center">
          <div className="col-12 col-md-8 mb-3 mb-md-0">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={handleSearch}
              />
              {searchTerm && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setSearchTerm('')}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>

          <div className="col-12 col-md-4">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">Todas las categorías</option>
              {uniqueCategories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Información de resultados */}
        <div className="mb-3 text-muted">
          Mostrando {filteredProducts.length} de {products.length} productos
          {searchTerm && ` para "${searchTerm}"`}
          {selectedCategory && ` en ${selectedCategory}`}
        </div>

        {/* Lista de productos */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3">Cargando productos...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="row" id="products-container">
            {filteredProducts.map(product => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <i className="fas fa-box-open fa-4x text-muted mb-3"></i>
            <h4>No se encontraron productos</h4>
            <p className="text-muted">
              {searchTerm || selectedCategory
                ? 'Intenta con otros términos de búsqueda o categoría'
                : 'No hay productos disponibles en este momento'}
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      <ProductDetailModal
        product={selectedProduct}
        show={showModal}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />
    </main>
  );
};

export default Products;
