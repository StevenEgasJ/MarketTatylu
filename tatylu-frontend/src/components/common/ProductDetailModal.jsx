import { useState, useEffect } from 'react';
import { reviewsAPI } from '../../services/api';
import './ProductDetailModal.css';

const ProductDetailModal = ({ product, show, onClose, onAddToCart }) => {
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && product) {
      loadReviews();
      setQuantity(1);
    }
  }, [show, product]);

  const loadReviews = async () => {
    if (!product?._id && !product?.id) return;
    
    try {
      setLoading(true);
      const response = await reviewsAPI.getByProduct(product._id || product.id);
      setReviews(response.data || []);
    } catch (error) {
      console.log('Error cargando reseñas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  const {
    nombre, name,
    precio, price,
    imagen, image,
    descripcion, description,
    stock,
    categoria, category
  } = product;

  const productName = nombre || name;
  const productPrice = precio || price;
  
  // Manejar URL de imagen - todas están en /public ahora
  const rawImage = imagen || image || '';
  const getImageUrl = (img) => {
    if (!img) return '/placeholder.svg';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (img.includes('/')) {
      const fileName = img.split('/').pop();
      return `/${fileName}`;
    }
    return `/${img}`;
  };
  const productImage = getImageUrl(rawImage);
  
  const productDescription = descripcion || description;
  const productStock = stock ?? 0;
  const productCategory = categoria || category;

  const isOutOfStock = productStock <= 0;

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= productStock) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, quantity);
      onClose();
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{productName}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="row">
              {/* Imagen */}
              <div className="col-md-5">
                <img
                  src={productImage}
                  alt={productName}
                  className="img-fluid rounded product-detail-image"
                  onError={(e) => { e.target.src = '/placeholder-product.png'; }}
                />
              </div>

              {/* Detalles */}
              <div className="col-md-7">
                {productCategory && (
                  <span className="badge bg-secondary mb-2">{productCategory}</span>
                )}

                <p className="product-detail-description">{productDescription}</p>

                <div className="product-detail-price mb-3">
                  ${productPrice?.toFixed(2)}
                </div>

                {/* Rating */}
                {reviews.length > 0 && (
                  <div className="mb-3">
                    <span className="text-warning">
                      {'★'.repeat(Math.round(averageRating))}
                      {'☆'.repeat(5 - Math.round(averageRating))}
                    </span>
                    <span className="ms-2 text-muted">
                      ({averageRating}) - {reviews.length} reseñas
                    </span>
                  </div>
                )}

                {/* Stock */}
                <div className="mb-3">
                  {isOutOfStock ? (
                    <span className="badge bg-danger">Agotado</span>
                  ) : (
                    <span className="text-success">
                      <i className="fas fa-check-circle me-1"></i>
                      {productStock} disponibles
                    </span>
                  )}
                </div>

                {/* Cantidad */}
                {!isOutOfStock && (
                  <div className="d-flex align-items-center mb-3">
                    <label className="me-3">Cantidad:</label>
                    <div className="input-group" style={{ width: '150px' }}>
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="form-control text-center"
                        value={quantity}
                        min="1"
                        max={productStock}
                        readOnly
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= productStock}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reseñas */}
            {reviews.length > 0 && (
              <div className="mt-4">
                <h6>Reseñas de clientes</h6>
                <div className="reviews-list">
                  {reviews.slice(0, 3).map((review, index) => (
                    <div key={index} className="review-item border-bottom py-2">
                      <div className="d-flex justify-content-between">
                        <strong>{review.userName || 'Anónimo'}</strong>
                        <span className="text-warning">
                          {'★'.repeat(review.rating)}
                          {'☆'.repeat(5 - review.rating)}
                        </span>
                      </div>
                      <p className="mb-0 small text-muted">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <i className="fas fa-cart-plus me-2"></i>
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
