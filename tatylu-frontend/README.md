# Tatylu Frontend - React + Vite

Frontend moderno para el Minimarket Tatylu, construido con React y Vite.

## 🚀 Tecnologías

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router DOM** - Navegación SPA
- **Axios** - Cliente HTTP para consumir APIs
- **Bootstrap 5** - Framework CSS
- **SweetAlert2** - Alertas y notificaciones
- **Context API** - Manejo de estado global

## 📁 Estructura del Proyecto

```
tatylu-frontend/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── common/      # Componentes genéricos
│   │   └── layout/      # Header, Footer, Layout
│   ├── context/         # Context providers (Auth, Cart, Theme)
│   ├── pages/           # Páginas/vistas
│   ├── services/        # API services (axios)
│   ├── styles/          # Estilos globales
│   ├── App.jsx          # Componente principal con rutas
│   └── main.jsx         # Entry point
├── .env                 # Variables de entorno
├── package.json
└── vite.config.js
```

## 🛠️ Instalación

```bash
# Navegar al directorio
cd tatylu-frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🔧 Configuración

El archivo `.env` contiene las variables de entorno:

```env
VITE_API_URL=https://supermarkettatylu.onrender.com
VITE_APP_NAME=Tatylu
```

## 📱 Páginas Disponibles

| Ruta | Página | Protegida |
|------|--------|-----------|
| `/` | Home | No |
| `/login` | Iniciar Sesión | No |
| `/signup` | Registro | No |
| `/products` | Catálogo de Productos | No |
| `/cart` | Carrito de Compras | No |
| `/checkout` | Proceso de Pago | ✅ |
| `/compras` | Historial de Compras | ✅ |
| `/profile` | Perfil de Usuario | ✅ |
| `/loyalty` | Programa de Lealtad | ✅ |
| `/about` | Quiénes Somos | No |
| `/contact` | Contacto | No |
| `/admin` | Panel de Administración | ✅ Admin |

## 🔐 Autenticación

El sistema usa JWT tokens almacenados en `localStorage`. La autenticación se maneja mediante el `AuthContext` que provee:

- `login(email, password)` - Iniciar sesión
- `register(userData)` - Registrar usuario
- `logout()` - Cerrar sesión
- `updateProfile(data)` - Actualizar perfil
- `isAdmin()` - Verificar si es administrador

## 🛒 Carrito

El `CartContext` maneja el estado del carrito:

- `addToCart(product, quantity)` - Agregar producto
- `updateQuantity(productId, quantity)` - Actualizar cantidad
- `removeFromCart(productId)` - Eliminar producto
- `clearCart()` - Vaciar carrito
- `applyCoupon(code)` - Aplicar cupón de descuento

## 🌙 Tema Oscuro

El `ThemeContext` permite alternar entre tema claro y oscuro:

```jsx
const { theme, toggleTheme, isDark } = useTheme();
```

## 📡 API Services

Todos los servicios API están centralizados en `src/services/api.js`:

- `authAPI` - Autenticación
- `productsAPI` - Productos
- `cartAPI` - Carrito
- `ordersAPI` - Pedidos
- `usersAPI` - Usuarios (Admin)
- `categoriesAPI` - Categorías
- `reviewsAPI` - Reseñas
- `loyaltyAPI` - Programa de lealtad
- `publicAPI` - Endpoints públicos

## 🚀 Despliegue

Para desplegar en producción:

1. Crear build: `npm run build`
2. Subir contenido de `dist/` a tu hosting
3. Configurar redirecciones para SPA (todas las rutas a `index.html`)

### Vercel

```bash
npm i -g vercel
vercel
```

### Netlify

Crear archivo `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Verificar código con ESLint

## 👥 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto es privado para Minimarket Tatylu.
