# 🚀 MarketTatylu - Microservicios Backend

## ✅ IMPLEMENTACIÓN COMPLETA DEL BACKEND

Los 3 servidores están **listos para usar**:

### 📁 Estructura Creada

```
MarketTatylu/
├── shared/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Review.js
│   │   └── Category.js
│   └── middleware/
│       └── auth.js
│
├── server-crud/ (Puerto :3001)
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── routes/
│       ├── auth.js ................. Registro y Login
│       ├── products.js ............. CRUD Productos
│       ├── users.js ................ CRUD Usuarios
│       ├── categories.js ........... CRUD Categorías
│       └── reviews.js .............. CRUD Reviews
│
├── server-business/ (Puerto :3002)
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── routes/
│       ├── checkout.js ............ Procesar compras
│       ├── cart.js ................ Cálculos de carrito
│       ├── orders.js .............. Gestión de órdenes
│       ├── loyalty.js ............. Programa de lealtad
│       └── shipping.js ............ Cálculo de envíos
│
└── server-math/ (Puerto :3003)
    ├── server.js
    ├── package.json
    ├── .env
    └── routes/
        ├── analytics.js ........... Ventas y top productos
        ├── calculations.js ........ Cálculos de puntos
        ├── reports.js ............ Reportes financieros
        ├── predictions.js ........ Análisis de churn
        └── metrics.js ........... Métricas de conversión
```

---

## 🏃 PASOS PARA EJECUTAR

### 1️⃣ Instalar dependencias

```bash
# Servidor CRUD
cd server-crud
npm install

# Servidor Business
cd ../server-business
npm install

# Servidor Math
cd ../server-math
npm install
```

### 2️⃣ Verificar MongoDB

```bash
# MongoDB debe estar corriendo localmente
# En Windows: net start MongoDB
# En Mac: brew services start mongodb-community
# En Linux: sudo systemctl start mongod
```

### 3️⃣ Ejecutar los 3 servidores (en terminales separadas)

**Terminal 1 - CRUD API (:3001)**
```bash
cd server-crud
npm start
# Verás: 🚀 [CRUD] Server running on port 3001
```

**Terminal 2 - Business Logic (:3002)**
```bash
cd server-business
npm start
# Verás: 🚀 [BUSINESS] Server running on port 3002
```

**Terminal 3 - Math Engine (:3003)**
```bash
cd server-math
npm start
# Verás: 🚀 [MATH] Server running on port 3003
```

### 4️⃣ Verificar que todos estén corriendo

```bash
# En otra terminal:
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health

# Respuesta esperada:
# {"service":"crud-api","status":"running","mongodb":"connected"}
```

---

## 📌 ENDPOINTS IMPLEMENTADOS

### 🟦 CRUD API (:3001)

#### Autenticación
```
POST /api/auth/register          { email, password, nombre }
POST /api/auth/login             { email, password }
```

#### Productos
```
GET    /api/products              List products
GET    /api/products/:id          Get one product
POST   /api/products              Create product (auth)
PUT    /api/products/:id          Update product (auth)
DELETE /api/products/:id          Delete product (auth)
```

#### Usuarios
```
GET    /api/users                 List users (auth)
GET    /api/users/:id             Get user (auth)
PUT    /api/users/:id             Update user (auth)
DELETE /api/users/:id             Delete user (auth)
```

#### Categorías
```
GET    /api/categories            List categories
POST   /api/categories            Create category (auth)
PUT    /api/categories/:id        Update category (auth)
```

#### Reviews
```
GET    /api/reviews               List reviews
POST   /api/reviews               Create review (auth)
```

---

### 🟩 BUSINESS LOGIC (:3002)

#### Checkout
```
POST   /api/checkout/validate     Validate cart before checkout
POST   /api/checkout/process      Process complete checkout
```

**POST /api/checkout/process**
```json
Body:
{
  "items": [
    { "productId": "123", "quantity": 2 }
  ],
  "shippingOption": "standard",
  "couponCode": "PROMO10"
}

Response:
{
  "success": true,
  "orderId": "625a8c3d",
  "order": {...},
  "loyaltyPoints": 25
}
```

#### Carrito
```
POST   /api/cart/calculate-totals Calculate cart totals
POST   /api/cart/apply-coupon     Apply coupon code
```

#### Órdenes
```
GET    /api/orders/business       Get user orders (auth)
GET    /api/orders/business/:id   Get one order (auth)
PATCH  /api/orders/business/:id/status Update order status (auth)
```

#### Lealtad
```
GET    /api/loyalty/user/:userId  Get loyalty points (auth)
POST   /api/loyalty/calculate-points Calculate and save points
```

#### Envío
```
POST   /api/shipping/calculate    Calculate shipping cost
POST   /api/shipping/estimate-time Estimate delivery time
```

---

### 🟪 MATH ENGINE (:3003)

#### Analytics
```
GET    /api/analytics/sales-summary Get sales data by day/month
GET    /api/analytics/top-products  Get top selling products
```

**GET /api/analytics/sales-summary**
```
Query: ?startDate=2024-01-01&endDate=2024-01-31&groupBy=day

Response:
{
  "period": {...},
  "data": [
    {
      "_id": "2024-01-15",
      "totalVentas": 450.50,
      "cantidadOrdenes": 5,
      "totalItems": 12
    }
  ],
  "totalRevenue": 5500,
  "totalOrders": 45
}
```

#### Cálculos
```
POST   /api/calculations/loyalty-points Calculate points for order
```

#### Reportes
```
GET    /api/reports/financial     Financial report
```

#### Predicciones
```
POST   /api/predictions/churn-risk Analyze user churn risk
```

#### Métricas
```
GET    /api/metrics/conversion    Conversion rate
GET    /api/metrics/retention     Retention rate
```

---

## 🧪 TESTING CON CURL

### 1. Registrar usuario
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"123456","nombre":"Juan"}'
```

### 2. Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"123456"}'

# Guardar el token de la respuesta
TOKEN="eyJhbGciOiJIUzI1NiIs..."
```

### 3. Crear producto
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nombre":"Laptop",
    "precio":999.99,
    "stock":10,
    "categoria":"Electrónica"
  }'

# Guardar el productId de la respuesta
PRODUCT_ID="625a8c3d"
```

### 4. Procesar checkout
```bash
curl -X POST http://localhost:3002/api/checkout/process \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "items": [{"productId":"'$PRODUCT_ID'","quantity":1}],
    "shippingOption":"standard",
    "couponCode":"PROMO10"
  }'
```

### 5. Ver reporte de ventas
```bash
curl "http://localhost:3003/api/analytics/sales-summary?days=30"
```

---

## 🔑 Características Implementadas

### ✅ CRUD API
- [x] Autenticación con JWT
- [x] Registro y Login
- [x] CRUD de Productos
- [x] CRUD de Usuarios
- [x] CRUD de Categorías
- [x] CRUD de Reviews
- [x] Validación de datos

### ✅ Business Logic
- [x] Checkout completo (validación → cálculo → orden)
- [x] Validación de stock
- [x] Cálculo de totales (subtotal, IVA, envío, descuento)
- [x] Aplicación de cupones
- [x] Gestión de órdenes
- [x] Programa de lealtad (puntos)
- [x] Cálculo de envío inteligente
- [x] Integración con CRUD API
- [x] Integración con Math Engine

### ✅ Math Engine
- [x] Analytics de ventas
- [x] Productos top vendidos
- [x] Reportes financieros
- [x] Cálculo de puntos de lealtad
- [x] Predicciones de churn
- [x] Métricas de conversión
- [x] Métricas de retención

---

## 🔄 Flujo Completo de Compra

```
1. Usuario registra (CRUD:3001)
   POST /api/auth/register

2. Usuario hace login (CRUD:3001)
   POST /api/auth/login → Token

3. Usuario agrega productos al carrito (Frontend)
   localStorage.setItem('carrito', [...])

4. Usuario valida carrito (BUSINESS:3002)
   POST /api/checkout/validate

5. Usuario procesa checkout (BUSINESS:3002)
   POST /api/checkout/process
   ├─ Valida stock (llama CRUD:3001)
   ├─ Crea orden (llama CRUD:3001)
   ├─ Calcula puntos (llama MATH:3003)
   ├─ Actualiza stock (llama CRUD:3001)
   └─ Retorna confirmación

6. Admin ve ventas (MATH:3003)
   GET /api/analytics/sales-summary
```

---

## 🐛 Solución de Problemas

### Error: "Connection refused on port 3001"
**Solución:** Verifica que no hay otro proceso en ese puerto
```bash
# En Windows
netstat -ano | findstr :3001

# En Mac/Linux
lsof -i :3001
```

### Error: "MongoDB connection error"
**Solución:** Inicia MongoDB
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Error: "CRUD_API is not reachable"
**Solución:** Verifica que todos los 3 servidores estén corriendo
```bash
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
```

---

## 🚀 Próximos Pasos

1. **Conectar Frontend:** Usa `API_CLIENT_MICROSERVICES.js` en tu frontend
2. **Agregar autenticación admin:** Validar isAdmin en rutas protegidas
3. **Implementar email:** Configurar SMTP para confirmaciones
4. **Deploy:** Usar Docker Compose para producción
5. **Monitoring:** Agregar logging centralizado

---

## 📊 Estructura de Datos (MongoDB)

### Collection: users
```json
{
  "_id": ObjectId,
  "email": "user@email.com",
  "password": "hashed",
  "nombre": "Juan",
  "loyaltyPoints": 150,
  "loyaltyTier": "GOLD"
}
```

### Collection: products
```json
{
  "_id": ObjectId,
  "nombre": "Laptop",
  "precio": 999.99,
  "stock": 10,
  "categoria": "Electrónica"
}
```

### Collection: orders
```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "items": [{productId, nombre, precio, cantidad}],
  "resumen": {subtotal, descuento, iva, envio, total},
  "estado": "confirmed",
  "fecha": Date
}
```

---

## ✨ ¡Listo para Usar!

Los 3 servidores están **completamente implementados** y **funcionales**. Solo necesitas:

1. ✅ Instalar dependencias (`npm install` en cada carpeta)
2. ✅ Iniciar MongoDB
3. ✅ Ejecutar los 3 servidores
4. ✅ Conectar tu frontend con el cliente actualizado

**¡A disfrutar de tu arquitectura de microservicios! 🎉**
