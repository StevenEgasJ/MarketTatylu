import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

// Imágenes de promoción estáticas
const promotions = [
  { id: 1, image: '/promo_navidad.jpg', title: 'Promoción Navideña', description: '¡Aprovecha nuestras ofertas de temporada!' },
  { id: 2, image: '/promo_navidad1.jpg', title: 'Ofertas Especiales', description: 'Descuentos increíbles en productos seleccionados' },
  { id: 3, image: '/promo_vegetales.jpg', title: 'Productos Frescos', description: 'Frutas y verduras frescas todos los días' },
  { id: 4, image: '/promo_carnes.jpeg', title: 'Carnes de Calidad', description: 'Las mejores carnes para tu familia' },
  { id: 5, image: '/promo_limpieza.jpg', title: 'Limpieza del Hogar', description: 'Todo lo que necesitas para tu hogar' },
];

const Home = () => {
  const [currentPromo, setCurrentPromo] = useState(0);

  // Auto-avance del carrusel cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promotions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextPromo = () => {
    setCurrentPromo((prev) => (prev + 1) % promotions.length);
  };

  const prevPromo = () => {
    setCurrentPromo((prev) => (prev - 1 + promotions.length) % promotions.length);
  };

  const goToPromo = (index) => {
    setCurrentPromo(index);
  };

  return (
    <main>
      {/* Banner Principal */}
      <section className="banner container-fluid p-0">
        <div className="content-banner text-center text-white py-5">
          <div className="container">
            <h2 className="display-4 animate__animated animate__fadeInDown site-title">
              Bienvenido a Tatylu
            </h2>
            <p className="lead animate__animated animate__fadeInUp">
              Tu minimarket de confianza en Sangolquí
            </p>
            <Link 
              to="/products" 
              className="btn btn-light btn-lg mt-3 animate__animated animate__fadeInUp"
            >
              Ver Productos <i className="fas fa-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <div className="services">
        <div className="services-content container">
          <h2 className="site-title text-center mb-4 animate__animated animate__slideInUp">
            ¿Te gustaría saber más de nosotros?
          </h2>
          
          <div className="services-group row justify-content-center">
            <div className="col-md-4 text-center mb-4">
              <div className="service-item p-4">
                <i className="fas fa-truck fa-3x text-primary mb-3"></i>
                <h5>Entrega Rápida</h5>
                <p className="text-muted">Recibe tus productos en la comodidad de tu hogar</p>
              </div>
            </div>
            <div className="col-md-4 text-center mb-4">
              <div className="service-item p-4">
                <i className="fas fa-shield-alt fa-3x text-success mb-3"></i>
                <h5>Productos de Calidad</h5>
                <p className="text-muted">Solo ofrecemos productos frescos y de primera</p>
              </div>
            </div>
            <div className="col-md-4 text-center mb-4">
              <div className="service-item p-4">
                <i className="fas fa-heart fa-3x text-danger mb-3"></i>
                <h5>Atención Personalizada</h5>
                <p className="text-muted">Servicio cercano y atención al cliente excepcional</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="lead">
              Descubre todo lo que tenemos para ti en nuestro minimarket local.
            </p>
            <Link to="/about" className="btn btn-primary">
              Información <i className="fa-solid fa-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* Promociones - Carrusel */}
      <section className="promotions py-5" aria-label="Promociones">
        <div className="container">
          <h2 className="text-center site-title mb-4">Promociones Especiales</h2>
          
          <div className="promo-carousel">
            {/* Botón anterior */}
            <button className="carousel-btn prev-btn" onClick={prevPromo}>
              <i className="fas fa-chevron-left"></i>
            </button>

            {/* Card de promoción actual */}
            <div className="promo-card-container">
              <article className="promo-card animate__animated animate__fadeIn">
                <img 
                  src={promotions[currentPromo].image} 
                  alt={promotions[currentPromo].title}
                  className="promo-image"
                  onError={(e) => { e.target.src = '/placeholder.svg'; }}
                />
                <div className="promo-overlay">
                  <h3>{promotions[currentPromo].title}</h3>
                  <p>{promotions[currentPromo].description}</p>
                  <Link to="/products" className="btn btn-light">
                    Ver productos <i className="fas fa-arrow-right ms-2"></i>
                  </Link>
                </div>
              </article>
            </div>

            {/* Botón siguiente */}
            <button className="carousel-btn next-btn" onClick={nextPromo}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          {/* Indicadores */}
          <div className="promo-indicators">
            {promotions.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentPromo ? 'active' : ''}`}
                onClick={() => goToPromo(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section py-5 bg-light">
        <div className="container text-center">
          <h2 className="site-title mb-3">¿Listo para comprar?</h2>
          <p className="lead mb-4">
            Explora nuestro catálogo completo y encuentra todo lo que necesitas
          </p>
          <Link to="/products" className="btn btn-primary btn-lg me-3">
            <i className="fas fa-shopping-bag me-2"></i>
            Ver Productos
          </Link>
          <Link to="/contact" className="btn btn-outline-secondary btn-lg">
            <i className="fas fa-phone me-2"></i>
            Contáctanos
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
