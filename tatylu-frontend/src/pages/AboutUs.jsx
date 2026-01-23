import './AboutUs.css';

const AboutUs = () => {
  return (
    <main>
      {/* Frase principal */}
      <section className="phrase-container py-5 bg-light">
        <div className="container">
          <div className="phrase-info text-center">
            <p className="lead">
              En Minimarket Tatylu encontrarás todo lo que necesitas para el día a día: 
              productos frescos, abarrotes y artículos de uso cotidiano con atención cercana y rápida.
            </p>
          </div>
        </div>
      </section>

      <section id="aboutUs">
        {/* Historia */}
        <div className="section history py-5">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6 mb-4 mb-md-0">
                <img 
                  src="/history.jpg" 
                  alt="Historia de Tatylu" 
                  className="img-fluid rounded shadow"
                  onError={(e) => { e.target.src = '/history1.jpg'; }}
                />
              </div>
              <div className="col-md-6">
                <div className="aboutUs-information">
                  <h2 className="site-title mb-3">Nuestra Historia</h2>
                  <p>
                    Minimarket Tatylu nació en el corazón de Sangolquí con un sueño familiar: 
                    ofrecer a nuestros vecinos un lugar donde encontrar productos de calidad 
                    a precios justos, con la calidez y atención que caracteriza a nuestra comunidad.
                  </p>
                  <p>
                    Desde nuestros inicios, nos hemos comprometido con brindar productos frescos, 
                    variedad en abarrotes y artículos de primera necesidad, siempre con una 
                    sonrisa y el mejor servicio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Misión y Visión */}
        <div className="section mission-vision py-5 bg-light">
          <div className="container">
            <div className="row">
              <div className="col-md-6 mb-4 mb-md-0">
                <div className="card h-100 p-4 mission-card">
                  <h2 className="site-title mb-3">
                    <i className="fas fa-bullseye me-2"></i>
                    Misión
                  </h2>
                  <p>
                    Satisfacer las necesidades diarias de nuestra comunidad ofreciendo 
                    productos de abarrotes, frescos y de limpieza con variedad, calidad 
                    y precios justos, apoyando a las familias de Sangolquí con atención 
                    cercana y rápida.
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100 p-4 vision-card">
                  <h2 className="site-title mb-3">
                    <i className="fas fa-eye me-2"></i>
                    Visión
                  </h2>
                  <p>
                    Ser el minimarket de referencia en Sangolquí y sus alrededores, 
                    reconocido por la frescura de nuestros productos, la disponibilidad 
                    constante de artículos básicos y el servicio amable que facilita 
                    la vida diaria de nuestros clientes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Valores */}
        <div className="section values py-5">
          <div className="container">
            <h2 className="text-center site-title mb-5">Nuestros Valores</h2>
            <div className="row">
              <div className="col-md-3 col-6 text-center mb-4">
                <div className="value-item">
                  <i className="fas fa-heart fa-3x text-danger mb-3"></i>
                  <h5>Servicio</h5>
                  <p className="text-muted small">Atención cercana y personalizada</p>
                </div>
              </div>
              <div className="col-md-3 col-6 text-center mb-4">
                <div className="value-item">
                  <i className="fas fa-star fa-3x text-warning mb-3"></i>
                  <h5>Calidad</h5>
                  <p className="text-muted small">Productos frescos y de primera</p>
                </div>
              </div>
              <div className="col-md-3 col-6 text-center mb-4">
                <div className="value-item">
                  <i className="fas fa-handshake fa-3x text-success mb-3"></i>
                  <h5>Honestidad</h5>
                  <p className="text-muted small">Precios justos y transparentes</p>
                </div>
              </div>
              <div className="col-md-3 col-6 text-center mb-4">
                <div className="value-item">
                  <i className="fas fa-users fa-3x text-primary mb-3"></i>
                  <h5>Comunidad</h5>
                  <p className="text-muted small">Apoyamos a nuestros vecinos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="section show-products py-5 bg-primary text-white">
          <div className="container text-center">
            <h2 className="site-title mb-3">¡Visítanos!</h2>
            <p className="lead mb-4">
              Estamos ubicados en Sangolquí, listos para atenderte con la mejor disposición.
            </p>
            <a href="/products" className="btn btn-light btn-lg me-3">
              <i className="fas fa-shopping-bag me-2"></i>
              Ver Productos
            </a>
            <a href="/contact" className="btn btn-outline-light btn-lg">
              <i className="fas fa-map-marker-alt me-2"></i>
              Cómo Llegar
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
