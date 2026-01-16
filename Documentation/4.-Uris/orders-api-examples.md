# Orders API — Examples (Local testing)

> Base URL: `http://localhost:4000`

Prerequisites:
- Start the server: `npm run dev` (or `npm start`).
- MongoDB running at `mongodb://localhost:27017/el-valle`.
- Node >= 18 or install `node-fetch` (the microservice demo uses `fetch`).

---

## 1) Calculate order price (no DB changes) ✅
**POST** `/orders/calculate`

Request body (JSON) — example using ad-hoc prices (no product lookup):
```json
{
  "items": [
    { "nombre": "Manzana", "precio": 1.2, "cantidad": 3 },
    { "precio": 9.99, "cantidad": 1 }
  ],
  "taxRate": 0.15
}
```

Request body (JSON) — example using canonical product identifiers (recommended):
```json
{
  "items": [
    { "productId": 12345, "cantidad": 2 },           // numeric product.id as stored in DB
    { "productId": "64a1fe1234567890abcdef12", "cantidad": 1 } // Mongo ObjectId
  ],
  "taxRate": 0.15
}
```

Example curl (using canonical product ids):
```bash
curl -s -X POST "http://localhost:4000/orders/calculate" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":12345,"cantidad":2},{"productId":"64a1fe1234567890abcdef12","cantidad":1}],"taxRate":0.15}'
```

Sample response:
```json
{
  "resumen": {
    "subtotal": 25.00,
    "discountTotal": 2.00,
    "taxRate": 0.15,
    "taxes": 3.45,
    "total": 26.45,
    "items": [
      { "productId": 12345, "nombre": "Example Product", "precioUnit": 10.00, "cantidad": 2, "total": 20.00 },
      { "productId": "64a1fe1234567890abcdef12", "nombre": "Another Prod", "precioUnit": 3.00, "cantidad": 1, "total": 3.00 }
    ]
  }
}
```

> Note: When `productId` is provided (either numeric `product.id` or Mongo `_id`) the API will resolve the product from the database and use canonical price and discount values for calculation. Use `productId` whenever you need authoritative pricing, discounting and stock updates.

---

## 2) Create & save order (calculates resumen if omitted) ✅
**POST** `/orders`

Request body (JSON) — simple ad-hoc example (no DB lookup):
```json
{
  "items": [
    { "nombre": "Pan", "precio": 2.5, "cantidad": 4 }
  ],
  "userId": "optional-user-id"
}
```

Request body (JSON) — recommended: use `productId` (numeric `product.id` or Mongo `_id`):
```json
{
  "items": [
    { "productId": 12345, "cantidad": 2 },
    { "productId": "64a1fe1234567890abcdef12", "cantidad": 1 }
  ],
  "userId": "user-123"
}
```
Example curl (using numeric `productId`):
```bash
curl -s -X POST "http://localhost:4000/orders" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":12345,"cantidad":2}],"userId":"user-123"}'
```
Sample response (201 Created):
```json
{
  "_id": "63a...",
  "id": "31",
  "items": [ { "productId": 12345, "nombre": "Pan Artesanal", "precioUnit": 2.50, "cantidad": 2, "total": 5.00 } ],
  "resumen": { "subtotal": 5.00, "taxes": 0.75, "total": 5.75 },
  "estado": "pendiente",
  "fecha": "2026-01-15T..."
}
```

> Important: When creating orders with `productId`, the server will use the product's stored price/discount and will decrement product stock in MongoDB as part of order creation. Use `productId` for production-like flows to keep inventory accurate.

---

## 3) Microservice demo — calls calculate then save ✅
**POST** `/orders/microservice-create`

Request body (JSON):
```json
{
  "items": [ { "nombre": "Cereal", "precio": 4.5, "cantidad": 2 } ],
  "taxRate": 0.15
}
```
Example curl:
```bash
curl -s -X POST "http://localhost:4000/orders/microservice-create" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"nombre":"Cereal","precio":4.5,"cantidad":2}],"taxRate":0.15}'
```
Sample response:
```json
{
  "saved": { "_id": "63a...", "resumen": { "total": 10.35 }, "items": [...] },
  "via": ["calculate","orders"]
}
```

---

## 4) Top orders by total amount ✅
**GET** `/orders/top?limit=5`

Example:
```bash
curl -s "http://localhost:4000/orders/top?limit=5"
```
Sample response:
```json
[
  { "_id": "63b...", "computedTotal": 250.00, ... },
  { "_id": "63c...", "computedTotal": 120.50, ... }
]
```

---

## 5) List recent orders ✅
**GET** `/orders`

Example:
```bash
curl -s "http://localhost:4000/orders"
```

## 6) Get one order ✅
**GET** `/orders/:id`

Example:
```bash
curl -s "http://localhost:4000/orders/63a..."
```

---

⚠️ Important notes:
- Orders endpoints are available **without authentication** for demo/testing. Be careful exposing this in production.
- Microservice demo uses internal HTTP calls to `localhost:4000`. Make sure server is reachable and Node has `fetch` support.
- If responses differ from the samples, check product-based flows (productId) which can apply discounts and change totals.

---

If you want, I can run a few example requests against your running server and paste the real responses here. ✅