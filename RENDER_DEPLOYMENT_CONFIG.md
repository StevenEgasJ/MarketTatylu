# 🚀 Configuración de Microservicios en Render

## 📋 Pre-requisitos

1. Cuenta en [Render.com](https://render.com)
2. Cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (BD en la nube)
3. Los 3 repositorios en GitHub (o 1 monorepo)
4. Información de dominio personalizado (opcional)

---

## 🗄️ Paso 1: Configurar MongoDB Atlas

### 1. Crear cluster en MongoDB Atlas

```
1. Ir a https://www.mongodb.com/cloud/atlas
2. Crear nuevo proyecto "MarketTatylu"
3. Crear cluster (Shared Tier es gratis)
4. Esperar a que se cree (≈ 5 min)
```

### 2. Crear usuario de BD

```
1. Security → Database Access
2. Agregar nuevo usuario
   - Username: markettatylu_user
   - Password: [GENERAR PASSWORD FUERTE]
   - Copiar el string de conexión
```

### 3. Whitelist de IPs

```
1. Security → Network Access
2. Add IP Address
3. Agregar:
   - 0.0.0.0/0 (permite cualquier IP - para Render)
   - Alternativa: Obtener IPs de Render después de deployar
```

### 4. Obtener Connection String

```
La URL se verá así:
mongodb+srv://markettatylu_user:PASSWORD@cluster.mongodb.net/markettatylu?retryWrites=true&w=majority

Guardar esta URL con las variables:
- ${MONGODB_USER}
- ${MONGODB_PASSWORD}
- ${MONGODB_CLUSTER}
```

---

## 🎯 Paso 2: Crear los 3 Servicios en Render

### 📘 SERVICIO 1: CRUD API (:3001)

#### Configuración Básica
```
Name:                  markettatylu-crud-api
Environment:           Node
Build Command:         npm install
Start Command:         npm start
Region:                São Paulo (sudamérica más cercana)
Instance Type:         Free (o Starter si necesitas)
Branch:                main
```

#### Environment Variables

```
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://markettatylu_user:PASSWORD@cluster.mongodb.net/markettatylu?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-crud-production-12345
CORS_ORIGIN=https://tudominio.com,https://app.tudominio.com
```

#### Health Check
```
Render → Service → Health Check Settings
- Path: /health
- Port: 3001
- Check Interval: 60s
```

**URL de Render:** `https://markettatylu-crud-api.onrender.com`

---

### 🟩 SERVICIO 2: BUSINESS LOGIC (:3002)

#### Configuración Básica
```
Name:                  markettatylu-business-api
Environment:           Node
Build Command:         npm install
Start Command:         npm start
Region:                São Paulo
Instance Type:         Free (o Starter)
Branch:                main
```

#### Environment Variables

```
NODE_ENV=production
PORT=3002
MONGODB_URI=mongodb+srv://markettatylu_user:PASSWORD@cluster.mongodb.net/markettatylu?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-business-production-12345
CORS_ORIGIN=https://tudominio.com,https://app.tudominio.com

# URLs de los otros microservicios en Render
CRUD_API=https://markettatylu-crud-api.onrender.com
MATH_API=https://markettatylu-math-api.onrender.com
```

#### Health Check
```
Path: /health
Port: 3002
Check Interval: 60s
```

**URL de Render:** `https://markettatylu-business-api.onrender.com`

---

### 🟪 SERVICIO 3: MATH ENGINE (:3003)

#### Configuración Básica
```
Name:                  markettatylu-math-api
Environment:           Node
Build Command:         npm install
Start Command:         npm start
Region:                São Paulo
Instance Type:         Free (o Starter)
Branch:                main
```

#### Environment Variables

```
NODE_ENV=production
PORT=3003
MONGODB_URI=mongodb+srv://markettatylu_user:PASSWORD@cluster.mongodb.net/markettatylu?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-math-production-12345
```

#### Health Check
```
Path: /health
Port: 3003
Check Interval: 60s
```

**URL de Render:** `https://markettatylu-math-api.onrender.com`

---

## 🔐 Tabla de Configuración Completa

| Variable | CRUD (:3001) | BUSINESS (:3002) | MATH (:3003) |
|----------|---|---|---|
| NODE_ENV | production | production | production |
| PORT | 3001 | 3002 | 3003 |
| MONGODB_URI | mongodb+srv://...markettatylu... | Misma | Misma |
| JWT_SECRET | crud-secret-production | business-secret-production | math-secret-production |
| CORS_ORIGIN | https://tudominio.com | https://tudominio.com | https://tudominio.com |
| CRUD_API | - | https://markettatylu-crud-api.onrender.com | - |
| MATH_API | - | https://markettatylu-math-api.onrender.com | - |

---

## 📝 Variables de Entorno Detalladas

### NODE_ENV
```
Desarrollo:  development
Producción:  production

Afecta:
- Logging (más verbose en dev)
- CORS (más restrictivo en prod)
- Compresión
```

### JWT_SECRET
```
⚠️ CRÍTICO: Debe ser diferente para cada servicio
⚠️ Debe ser long y random (mínimo 32 caracteres)

Generar con:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Ejemplo:
a3f7c9e2b1d5f8g4h6i9j2k5l8m1n4o7p0q3r6s9t2u5v8w1x4y7z0a3b6c9d2
```

### MONGODB_URI
```
Local:      mongodb://localhost:27017/markettatylu
Producción: mongodb+srv://user:password@cluster.mongodb.net/db?retryWrites=true&w=majority

Estructura:
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority

Reemplazar:
- USERNAME: de MongoDB Atlas
- PASSWORD: encoded URL (% para caracteres especiales)
- CLUSTER: tu-cluster-name.mongodb.net
- DATABASE: markettatylu
```

### CORS_ORIGIN
```
Desarrollo:  http://localhost:5173,http://localhost:3000
Producción:  https://tudominio.com,https://app.tudominio.com,https://admin.tudominio.com

Si usas Netlify/Vercel:
https://miapp-123.netlify.app
https://miapp-123.vercel.app
```

### CRUD_API y MATH_API
```
Desarrollo:
CRUD_API=http://localhost:3001
MATH_API=http://localhost:3003

Producción (en BUSINESS SERVER):
CRUD_API=https://markettatylu-crud-api.onrender.com
MATH_API=https://markettatylu-math-api.onrender.com

⚠️ IMPORTANTE:
- Sin trailing slash
- HTTPS obligatorio en producción
- El servicio Business llama a estos URLs
```

---

## 🔄 Flujo de Comunicación en Render

```
FRONTEND (Vercel/Netlify)
    ↓
    └─→ API Gateway o Business Logic Server
            ↓
            ├─→ CRUD API (localhost:3001)
            │   ├─ Auth
            │   ├─ Products
            │   └─ Users
            │
            ├─→ MATH API (localhost:3003)
            │   ├─ Analytics
            │   └─ Calculations
            │
            └─→ MongoDB Atlas (BD compartida)
```

---

## 📋 Variables por Ambiente

### DESARROLLO (localhost)

```env
# server-crud/.env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/markettatylu
JWT_SECRET=dev-secret-crud-12345
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# server-business/.env
NODE_ENV=development
PORT=3002
MONGODB_URI=mongodb://localhost:27017/markettatylu
JWT_SECRET=dev-secret-business-12345
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
CRUD_API=http://localhost:3001
MATH_API=http://localhost:3003

# server-math/.env
NODE_ENV=development
PORT=3003
MONGODB_URI=mongodb://localhost:27017/markettatylu
JWT_SECRET=dev-secret-math-12345
```

### STAGING (Render Preview)

```env
# server-crud/.env
NODE_ENV=staging
PORT=3001
MONGODB_URI=mongodb+srv://user:password@staging-cluster.mongodb.net/markettatylu?retryWrites=true&w=majority
JWT_SECRET=staging-secret-crud-xyz
CORS_ORIGIN=https://markettatylu-staging.onrender.com

# server-business/.env
NODE_ENV=staging
PORT=3002
MONGODB_URI=mongodb+srv://user:password@staging-cluster.mongodb.net/markettatylu?retryWrites=true&w=majority
JWT_SECRET=staging-secret-business-xyz
CORS_ORIGIN=https://markettatylu-staging.onrender.com
CRUD_API=https://markettatylu-crud-api-staging.onrender.com
MATH_API=https://markettatylu-math-api-staging.onrender.com

# server-math/.env
NODE_ENV=staging
PORT=3003
MONGODB_URI=mongodb+srv://user:password@staging-cluster.mongodb.net/markettatylu?retryWrites=true&w=majority
JWT_SECRET=staging-secret-math-xyz
```

### PRODUCCIÓN (Render Main)

```env
# server-crud/.env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://user:password@prod-cluster.mongodb.net/markettatylu?retryWrites=true&w=majority
JWT_SECRET=prod-secret-crud-[RANDOM-32-CHARS]
CORS_ORIGIN=https://tudominio.com,https://app.tudominio.com,https://admin.tudominio.com

# server-business/.env
NODE_ENV=production
PORT=3002
MONGODB_URI=mongodb+srv://user:password@prod-cluster.mongodb.net/markettatylu?retryWrites=true&w=majority
JWT_SECRET=prod-secret-business-[RANDOM-32-CHARS]
CORS_ORIGIN=https://tudominio.com,https://app.tudominio.com,https://admin.tudominio.com
CRUD_API=https://markettatylu-crud-api.onrender.com
MATH_API=https://markettatylu-math-api.onrender.com

# server-math/.env
NODE_ENV=production
PORT=3003
MONGODB_URI=mongodb+srv://user:password@prod-cluster.mongodb.net/markettatylu?retryWrites=true&w=majority
JWT_SECRET=prod-secret-math-[RANDOM-32-CHARS]
```

---

## ✅ Pasos para Desplegar en Render

### 1️⃣ Preparar Repositorio GitHub

```bash
# Estructura recomendada:
MarketTatylu/
├── server-crud/
│   ├── package.json
│   ├── server.js
│   └── .env
├── server-business/
│   ├── package.json
│   ├── server.js
│   └── .env
└── server-math/
    ├── package.json
    ├── server.js
    └── .env

# Push a GitHub
git add .
git commit -m "Add microservices for Render deployment"
git push origin main
```

### 2️⃣ Conectar GitHub a Render

```
1. Ir a https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Conectar repositorio GitHub
4. Seleccionar rama: main
5. Dar permisos de acceso
```

### 3️⃣ Crear 3 Web Services

Para cada servicio (CRUD, BUSINESS, MATH):

```
1. New Web Service
2. Repository: tu-repo/MarketTatylu
3. Name: markettatylu-crud-api (o business/math)
4. Environment: Node
5. Build Command: npm install
6. Start Command: npm start
7. Root Directory: server-crud/ (o business/math)
8. Instance: Free (o Starter para producción)
```

### 4️⃣ Agregar Environment Variables

En cada servicio:

```
1. Environment → Environment Variables
2. Agregar todas las variables de la tabla anterior
3. Click "Save Changes"
4. El servicio se redeploya automáticamente
```

### 5️⃣ Verificar Health Checks

```
Monitoring → Health Checks
- Path: /health
- Port: 3001 (o 3002/3003)
- Check Interval: 60s
- Grace Period: 30s

Status debe ser GREEN
```

---

## 🔗 Configurar Inter-servicio en Render

### El Problema:
- Business Logic necesita llamar a CRUD API
- Pero cuando están en Render, las URLs cambian

### La Solución:

**En BUSINESS API (Environment Variables):**
```
CRUD_API=https://markettatylu-crud-api.onrender.com
MATH_API=https://markettatylu-math-api.onrender.com
```

**En el código (server-business/routes/checkout.js):**
```javascript
const crudUrl = process.env.CRUD_API; // Obtiene URL de variable
const mathUrl = process.env.MATH_API;

// Usar en axios:
axios.post(`${crudUrl}/api/products/validate`, {...})
axios.post(`${mathUrl}/api/calculations/loyalty-points`, {...})
```

---

## 🧪 Testing Post-Deployment

### Verificar que todos estén corriendo

```bash
# Health checks
curl https://markettatylu-crud-api.onrender.com/health
curl https://markettatylu-business-api.onrender.com/health
curl https://markettatylu-math-api.onrender.com/health

# Respuesta esperada:
# {"service":"crud-api","status":"running","mongodb":"connected"}
```

### Testing de endpoint

```bash
# Login en CRUD API
curl -X POST https://markettatylu-crud-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"123456"}'

# Checkout en BUSINESS API (con token del login)
curl -X POST https://markettatylu-business-api.onrender.com/api/checkout/process \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"items":[{"productId":"id","quantity":1}],"shippingOption":"standard"}'
```

### Ver logs en Render

```
1. Dashboard → Service → Logs
2. Ver cualquier error en tiempo real
3. Rebuild si hay cambios en código
```

---

## 🆘 Problemas Comunes y Soluciones

### ❌ "MongoDBSyntaxError" o BD no conecta

**Causa:** MongoDB URI incorrecta
**Solución:**
```
1. Verificar conexión string en MongoDB Atlas
2. Copiar completo: mongodb+srv://user:password@cluster...
3. Verificar caracteres especiales están encoded (%40 para @)
4. IP whitelist: agregar 0.0.0.0/0 en MongoDB Atlas
```

### ❌ "ECONNREFUSED: Connection refused to CRUD_API"

**Causa:** URLs inter-servicio incorrectas
**Solución:**
```
1. Verificar CRUD_API en BUSINESS tiene https://
2. Verificar URLs son exactas: markettatylu-crud-api.onrender.com
3. Esperar a que ambos servicios estén "running" (5-10 min)
4. Logs → buscar "CRUD_API" para ver URL que usa
```

### ❌ "JWT invalid or expired"

**Causa:** JWT_SECRET diferente entre entornos
**Solución:**
```
1. Cada servicio debe tener su JWT_SECRET único
2. En producción, usar claves diferentes a desarrollo
3. No compartir el mismo JWT_SECRET entre servicios
```

### ❌ CORS error en frontend

**Causa:** CORS_ORIGIN no incluye dominio del frontend
**Solución:**
```
1. Frontend en Vercel: https://myapp-123.vercel.app
2. Agregar en CORS_ORIGIN de TODOS los servicios:
   CORS_ORIGIN=https://myapp-123.vercel.app

3. Reload del navegador (Ctrl+Shift+Del cache)
```

---

## 📊 Tabla Resumen: URLs en Render

| Servicio | Puerto Local | URL Render | Variable |
|----------|---|---|---|
| CRUD API | 3001 | https://markettatylu-crud-api.onrender.com | `CRUD_API` |
| Business Logic | 3002 | https://markettatylu-business-api.onrender.com | `BUSINESS_API` |
| Math Engine | 3003 | https://markettatylu-math-api.onrender.com | `MATH_API` |

---

## 🔐 Seguridad en Producción

### ✅ Checklist de Seguridad

- [ ] JWT_SECRET es random y largo (32+ caracteres)
- [ ] MONGODB_URI usa contraseña fuerte
- [ ] MongoDB whitelist incluye Render IPs
- [ ] CORS_ORIGIN es específico (no * en producción)
- [ ] NODE_ENV=production en todos los servicios
- [ ] Logs no exponen credenciales
- [ ] HTTPS está habilitado (Render lo hace automáticamente)
- [ ] No hay .env subido a GitHub (usar .gitignore)

### Generador de Secretos

```bash
# Generar JWT_SECRET seguro
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Resultado: a3f7c9e2b1d5f8g4h6i9j2k5l8m1n4o7p0q3r6s9t2u5v8w1x4y7z0a3b6c9d2

# Hacer esto 3 veces (una por servicio)
```

---

## 🚀 Conclusión

Con esta configuración tu aplicación estará:

✅ **Desplegada en Render** con 3 microservicios independientes  
✅ **BD en la nube** con MongoDB Atlas  
✅ **Escalable** - cada servicio puede crecer por separado  
✅ **Segura** - HTTPS, JWT, variables secretas protegidas  
✅ **Monitoreada** - health checks automáticos  
✅ **Auto-redeploy** - cambios en GitHub actualizan automáticamente  

**¡Listo para producción! 🎉**
