# 🔧 Tu Configuración Actual → Distribuida en 3 Microservicios

## 📊 Lo que Tienes Ahora

```env
EMAIL_FROM=Tatylu <tanyluofficial@gmail.com>
GOOGLE_CLIENT_ID=870598618606-329k2jm6rmh4p7lej329jp1l91ainkds.apps.googleusercontent.com
JWT_SECRET=bjEu2ZmcZqZTh2DR
MONGODB_URI=mongodb+srv://juhuh3001_db_user:Espe123@cluster0.olchaay.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=4000
SMTP_HOST=smtp.gmail.com
SMTP_PASS=agkdaqaohjagklwo
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=tanyluofficial@gmail.com
```

## ⚠️ IMPORTANTE: Seguridad

**Tu archivo está exponiendo credenciales reales.** Después de configurar, deberías:

1. ❌ Cambiar contraseña de Gmail
2. ❌ Regenerar Google Client ID
3. ❌ Nunca subir `.env` a GitHub
4. ✅ Usar `.gitignore` para proteger archivos sensibles

---

## 📁 Cómo Distribuir en los 3 Servidores

### 🟦 SERVER-CRUD (.env)
```env
# server-crud/.env

# Básico
NODE_ENV=production
PORT=3001

# Base de datos (COMPARTIDA en todos)
MONGODB_URI=mongodb+srv://juhuh3001_db_user:Espe123@cluster0.olchaay.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# Autenticación
JWT_SECRET=bjEu2ZmcZqZTh2DR

# CORS (tu frontend)
CORS_ORIGIN=https://tudominio.com,https://app.tudominio.com

# Google OAuth (solo necesita CRUD para login)
GOOGLE_CLIENT_ID=870598618606-329k2jm6rmh4p7lej329jp1l91ainkds.apps.googleusercontent.com

# Email (solo CRUD envía confirmación de registro)
EMAIL_FROM=Tatylu <tanyluofficial@gmail.com>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=tanyluofficial@gmail.com
SMTP_PASS=agkdaqaohjagklwo
```

---

### 🟩 SERVER-BUSINESS (.env)
```env
# server-business/.env

# Básico
NODE_ENV=production
PORT=3002

# Base de datos (COMPARTIDA)
MONGODB_URI=mongodb+srv://juhuh3001_db_user:Espe123@cluster0.olchaay.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# Autenticación
JWT_SECRET=bjEu2ZmcZqZTh2DR

# CORS
CORS_ORIGIN=https://tudominio.com,https://app.tudominio.com

# URLs de otros microservicios (CRÍTICO)
CRUD_API=https://markettatylu-crud-api.onrender.com
MATH_API=https://markettatylu-math-api.onrender.com

# Email (envía confirmación de compra)
EMAIL_FROM=Tatylu <tanyluofficial@gmail.com>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=tanyluofficial@gmail.com
SMTP_PASS=agkdaqaohjagklwo
```

---

### 🟪 SERVER-MATH (.env)
```env
# server-math/.env

# Básico
NODE_ENV=production
PORT=3003

# Base de datos (COMPARTIDA)
MONGODB_URI=mongodb+srv://juhuh3001_db_user:Espe123@cluster0.olchaay.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# Autenticación
JWT_SECRET=bjEu2ZmcZqZTh2DR

# CORS
CORS_ORIGIN=https://tudominio.com,https://app.tudominio.com
```

---

## 📋 Tabla Comparativa: Dónde Va Cada Variable

| Variable | CRUD | BUSINESS | MATH | Notas |
|----------|------|----------|------|-------|
| `NODE_ENV` | ✅ production | ✅ production | ✅ production | Igual en todos |
| `PORT` | 3001 | 3002 | 3003 | Diferente por servicio |
| `MONGODB_URI` | ✅ | ✅ | ✅ | **IGUAL en los 3** |
| `JWT_SECRET` | ✅ | ✅ | ✅ | **IGUAL en los 3** (para validar tokens) |
| `CORS_ORIGIN` | ✅ | ✅ | ✅ | **IGUAL en los 3** |
| `GOOGLE_CLIENT_ID` | ✅ Solo | — | — | Solo para registro/login |
| `EMAIL_FROM` | ✅ | ✅ | — | CRUD y BUSINESS envían emails |
| `SMTP_HOST` | ✅ | ✅ | — | Para envío de emails |
| `SMTP_PORT` | ✅ | ✅ | — | `465` para Gmail |
| `SMTP_SECURE` | ✅ | ✅ | — | `true` para Gmail |
| `SMTP_USER` | ✅ | ✅ | — | Correo de Gmail |
| `SMTP_PASS` | ✅ | ✅ | — | Contraseña de apps (Gmail) |
| `CRUD_API` | — | ✅ | — | URL del CRUD en Render |
| `MATH_API` | — | ✅ | — | URL del Math en Render |

---

## 🔄 Lógica: Por Qué Cada Servicio Necesita Ciertas Variables

### ✉️ Por Qué CRUD y BUSINESS Usan Email

**CRUD (server-crud):**
- Envía confirmación cuando usuario se registra
- Envía email de bienvenida
- Necesita: `SMTP_*`, `EMAIL_FROM`, `GOOGLE_CLIENT_ID`

**BUSINESS (server-business):**
- Envía confirmación de compra después de checkout
- Envía recibos
- Necesita: `SMTP_*`, `EMAIL_FROM`, `CRUD_API`, `MATH_API`

**MATH (server-math):**
- Solo analiza datos
- No envía emails
- NO necesita: `SMTP_*`, `EMAIL_FROM`, `GOOGLE_CLIENT_ID`

---

### 🔗 Por Qué BUSINESS Necesita URLs de CRUD y MATH

**Flujo Checkout:**
```
1. Frontend → POST /api/checkout/process (BUSINESS)
2. BUSINESS llama: GET http://localhost:3001/api/products (CRUD)
3. BUSINESS valida stock
4. BUSINESS llama: POST http://localhost:3003/api/calculations/loyalty-points (MATH)
5. BUSINESS llama: POST http://localhost:3001/api/orders (CRUD)
6. BUSINESS retorna confirmación al frontend
```

**En Render:**
```
1. Frontend → POST https://markettatylu-business-api.onrender.com/api/checkout/process
2. BUSINESS llama: GET https://markettatylu-crud-api.onrender.com/api/products
3. BUSINESS llama: POST https://markettatylu-math-api.onrender.com/api/calculations/loyalty-points
4. Etc...
```

---

## 🚀 Pasos para Configurar en Render

### 1️⃣ Para CRUD API (Puerto 3001)

En Render Dashboard:
1. New Web Service
2. Root Directory: `server-crud`
3. Build: `npm install`
4. Start: `npm start`

**Environment Variables:**
```
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://juhuh3001_db_user:Espe123@cluster0.olchaay.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=bjEu2ZmcZqZTh2DR
CORS_ORIGIN=https://tudominio.com,https://app.tudominio.com
GOOGLE_CLIENT_ID=870598618606-329k2jm6rmh4p7lej329jp1l91ainkds.apps.googleusercontent.com
EMAIL_FROM=Tatylu <tanyluofficial@gmail.com>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=tanyluofficial@gmail.com
SMTP_PASS=agkdaqaohjagklwo
```

**URL Resultante:** `https://markettatylu-crud-api.onrender.com`

---

### 2️⃣ Para BUSINESS API (Puerto 3002)

En Render Dashboard:
1. New Web Service
2. Root Directory: `server-business`
3. Build: `npm install`
4. Start: `npm start`

**Environment Variables:**
```
NODE_ENV=production
PORT=3002
MONGODB_URI=mongodb+srv://juhuh3001_db_user:Espe123@cluster0.olchaay.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=bjEu2ZmcZqZTh2DR
CORS_ORIGIN=https://tudominio.com,https://app.tudominio.com
CRUD_API=https://markettatylu-crud-api.onrender.com
MATH_API=https://markettatylu-math-api.onrender.com
EMAIL_FROM=Tatylu <tanyluofficial@gmail.com>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=tanyluofficial@gmail.com
SMTP_PASS=agkdaqaohjagklwo
```

**URL Resultante:** `https://markettatylu-business-api.onrender.com`

---

### 3️⃣ Para MATH API (Puerto 3003)

En Render Dashboard:
1. New Web Service
2. Root Directory: `server-math`
3. Build: `npm install`
4. Start: `npm start`

**Environment Variables:**
```
NODE_ENV=production
PORT=3003
MONGODB_URI=mongodb+srv://juhuh3001_db_user:Espe123@cluster0.olchaay.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=bjEu2ZmcZqZTh2DR
CORS_ORIGIN=https://tudominio.com,https://app.tudominio.com
```

**URL Resultante:** `https://markettatylu-math-api.onrender.com`

---

## 📝 Archivo .gitignore (Protege tu .env)

Agrega a tu `.gitignore`:
```
# Environment variables
.env
.env.local
.env.*.local

# Node modules
node_modules/
npm-debug.log*

# Logs
logs/
*.log

# OS
.DS_Store
Thumbs.db
```

---

## ✅ Checklist Final

Antes de desplegar en Render:

- [ ] 3 repositorios creados en GitHub (o monorepo con 3 carpetas)
- [ ] Cada carpeta tiene `package.json`, `server.js` y `.env`
- [ ] `.gitignore` incluye `.env` (para no subir credenciales)
- [ ] MongoDB Atlas está configurado con whitelist `0.0.0.0/0`
- [ ] Render cuenta creada y conectada a GitHub
- [ ] 3 Web Services creados en Render con variables correctas
- [ ] Verificar health checks: `/health` en los 3 puertos

---

## 🔐 Cambios de Seguridad Necesarios

**Después de funcionar en Render:**

```bash
# 1. Cambiar contraseña de Gmail
# Ir a: https://myaccount.google.com/security
# Generar nueva "App Password" para SMTP

# 2. Regenerar Google Client ID
# Ir a: https://console.cloud.google.com
# OAuth 2.0 → Actualizar autorizados

# 3. Cambiar JWT_SECRET (hacerlo más fuerte)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Resultado: a3f7c9e2b1d5f8g4h6i9j2k5l8m1n4o7p0q3r6s9t2u5v8w1x4y7z0a3b6c9d2
```

---

## 📞 URL del Frontend

Donde sea que depliegues tu frontend (Vercel, Netlify, etc):

```
VITE_CRUD_API=https://markettatylu-crud-api.onrender.com
VITE_BUSINESS_API=https://markettatylu-business-api.onrender.com
VITE_MATH_API=https://markettatylu-math-api.onrender.com
```

Luego en tu código:
```javascript
const crudApi = import.meta.env.VITE_CRUD_API
const businessApi = import.meta.env.VITE_BUSINESS_API
const mathApi = import.meta.env.VITE_MATH_API
```

---

## 🎯 Resumen

Tu configuración actual funciona para **1 servidor**. Para 3 microservicios en Render:

✅ **Distribuye así:**
- CRUD: Variables de auth + email
- BUSINESS: Auth + email + URLs de otros servicios
- MATH: Solo auth

✅ **MONGODB_URI y JWT_SECRET:** Iguales en los 3

✅ **Puertos:** 3001, 3002, 3003 (no 4000)

✅ **URLs:** Los URLs de Render reemplazan los localhost

**¡Listo para Render! 🚀**
