import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer text-white py-4">
      <div className="container">
        {/* Row principal */}
        <div className="row text-center mb-3">
          <div className="col-12">
            <h3>Sobre Nosotros</h3>
            <p className="mb-2">
              Somos un minimarket local en Sangolquí dedicado a ofrecer productos de primera 
              necesidad: abarrotes, carnes, enlatados y artículos de limpieza a precios 
              accesibles y con atención cercana.
            </p>
          </div>
        </div>

        {/* Row para información de contacto y redes sociales */}
        <div className="row justify-content-center">
          {/* Columna de información de contacto */}
          <div className="col-md-5 text-center mb-2 mb-md-0 me-md-5">
            <h4 className="h5 mb-2">Información de Contacto</h4>
            <p className="mb-1">
              <i className="fa-solid fa-envelope me-2"></i>
              <a href="mailto:villacreses.tati1977@gmail.com" className="text-white">
                villacreses.tati1977@gmail.com
              </a>
            </p>
            <p className="mb-1">
              <i className="fa-solid fa-location-dot me-2"></i>
              Sangolquí, Ecuador
            </p>
            <p className="mb-1">
              <i className="fa-solid fa-phone me-2"></i>
              <a href="tel:+593999999999" className="text-white">+593 99 999 9999</a>
            </p>
          </div>

          {/* Columna de redes sociales */}
          <div className="col-md-4 text-center ms-md-5">
            <h4 className="h5 mb-2">Síguenos</h4>
            <div className="social-links">
              <a 
                href="https://www.facebook.com/share/1AJVbvMWzj/" 
                className="me-3" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook fa-2x"></i>
              </a>
              <a 
                href="https://vm.tiktok.com/ZMA43cKEe/" 
                className="me-3" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <i className="fab fa-tiktok fa-2x"></i>
              </a>
              <a 
                href="https://wa.me/593999999999" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <i className="fab fa-whatsapp fa-2x"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="row mt-4">
          <div className="col-12 text-center">
            <hr className="bg-light" />
            <p className="mb-0 small">
              © {new Date().getFullYear()} Minimarket Tatylu. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
