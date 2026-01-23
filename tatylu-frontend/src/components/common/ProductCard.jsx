import './ProductCard.css';

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const {
    _id,
    id,
    nombre,
    name,
    precio,
    price,
    imagen,
    image,
    descripcion,
    description,
    stock,
    categoria,
    category
  } = product;

  const productId = _id || id;
  const productName = nombre || name;
  const productPrice = precio || price;
  
  // Manejar la URL de la imagen - Ahora todas las imágenes están en /public
  const rawImage = imagen || image || '';
  const getImageUrl = (img) => {
    if (!img) return '/placeholder.svg';
    // Si ya es una URL completa, usarla
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    // Si tiene ruta con static/img o ./, extraer solo el nombre del archivo
    if (img.includes('/')) {
      const fileName = img.split('/').pop();
      return `/${fileName}`;
    }
    // Si es solo el nombre del archivo, usarlo directamente
    return `/${img}`;
  };
  
  const productImage = getImageUrl(rawImage);
  const productDescription = descripcion || description;
  const productStock = stock ?? 0;
  const productCategory = categoria || category;

  const isOutOfStock = productStock <= 0;

  const handleImageError = (e) => {
    e.target.src = '/placeholder.svg';
  };

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className={`card product-card h-100 ${isOutOfStock ? 'out-of-stock' : ''}`}>
        {/* Badge de stock */}
        {isOutOfStock && (
          <span className="badge bg-danger stock-badge">Agotado</span>
        )}
        {productStock > 0 && productStock <= 5 && (
          <span className="badge bg-warning text-dark stock-badge">
            ¡Últimas {productStock}!
          </span>
        )}

        {/* Imagen del producto */}
        <div className="product-image-container">
          <img
            src={productImage}
            className="card-img-top product-image"
            alt={productName}
            onError={handleImageError}
          />
          <div className="product-overlay">
            <button
              className="btn btn-light btn-sm"
              onClick={() => onViewDetails && onViewDetails(product)}
            >
              <i className="fas fa-eye me-1"></i>
              Ver más
            </button>
          </div>
        </div>

        {/* Cuerpo de la tarjeta */}
        <div className="card-body d-flex flex-column">
          {/* Categoría */}
          {productCategory && (
            <span className="badge bg-secondary mb-2 align-self-start">
              {productCategory}
            </span>
          )}

          {/* Nombre */}
          <h5 className="card-title product-name">{productName}</h5>

          {/* Descripción */}
          {productDescription && (
            <p className="card-text product-description text-muted small">
              {productDescription.length > 60 
                ? `${productDescription.substring(0, 60)}...` 
                : productDescription}
            </p>
          )}

          {/* Precio y botón */}
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center">
              <span className="product-price">
                ${productPrice?.toFixed(2)}
              </span>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onAddToCart && onAddToCart(product)}
                disabled={isOutOfStock}
              >
                <i className="fas fa-cart-plus me-1"></i>
                {isOutOfStock ? 'Agotado' : 'Agregar'}
              </button>
            </div>

            {/* Stock disponible */}
            {!isOutOfStock && (
              <small className="text-muted d-block mt-2">
                Stock: {productStock} unidades
              </small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
