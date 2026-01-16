# New Orders API endpoints

This file documents the new endpoints added to support unauthenticated orders, price calculation, and a microservice demo.

## Endpoints

- POST /orders/calculate
  - Body: { items: [ { productId?, nombre?, precio?, cantidad? } ], taxRate? }
  - Response: { resumen: { subtotal, discountTotal, taxRate, taxes, total, items: [...] } }

- POST /orders
  - Body: { items: [...], resumen? (optional), userId?, estado? }
  - Behavior: If `resumen` is omitted, server calculates one using product prices and discounts, then saves the order to MongoDB.
  - Response: created order object (201)

- GET /orders/top?limit=10
  - Returns top orders sorted by total amount (default limit 10). Response: list of orders with `computedTotal` field.

- POST /orders/microservice-create
  - Body: { items: [...], taxRate?, userId? }
  - Behavior: Demonstrates an API calling other APIs: it calls `/orders/calculate` and then `/orders` to persist.
  - Response: { saved: <order>, via: ['calculate', 'orders'] }

Notes:
- Authentication was removed from orders endpoints to allow use without auth (intended for demo / classroom use).
- The microservice endpoint uses HTTP calls to the local server. Ensure Node >= 18 (global fetch) or install `node-fetch` dependency.
