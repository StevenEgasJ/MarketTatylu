// ============================================
// server-business/services/checkout-service.js
// Lógica centralizada de Checkout
// ============================================

const axios = require('axios');

/**
 * Servicio de Checkout - Orquesta la lógica de compra
 * Llamadas a: CRUD_API (validar stock, crear orden)
 *             MATH_API (calcular puntos)
 */

class CheckoutService {
  constructor(crudApi, mathApi) {
    this.crudApi = crudApi;
    this.mathApi = mathApi;
  }

  /**
   * Procesar un checkout completo
   */
  async processCheckout({ userId, items, shippingOption, couponCode = null }) {
    try {
      console.log(`🛒 Processing checkout for user ${userId}`);

      // 1️⃣ Validar que items no estén vacíos
      if (!items || items.length === 0) {
        throw new Error('Cart is empty');
      }

      // 2️⃣ Obtener detalles de productos desde CRUD_API (validar stock)
      const productIds = items.map(i => i.productId);
      const productsResponse = await axios.get(`${this.crudApi}/api/products`, {
        params: { ids: productIds.join(',') }
      });
      const products = productsResponse.data;

      // 3️⃣ Validar stock disponible
      for (const item of items) {
        const product = products.find(p => p._id === item.productId);
        if (!product || product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product?.nombre || 'product'}`);
        }
      }

      // 4️⃣ Calcular subtotal
      let subtotal = 0;
      const orderItems = items.map(item => {
        const product = products.find(p => p._id === item.productId);
        const itemTotal = product.precio * item.quantity;
        subtotal += itemTotal;
        return {
          productId: product._id,
          nombre: product.nombre,
          precio: product.precio,
          cantidad: item.quantity,
          subtotal: itemTotal
        };
      });

      // 5️⃣ Aplicar cupón si existe
      let discount = 0;
      if (couponCode) {
        discount = await this.validateAndApplyCoupon(couponCode, subtotal);
      }

      // 6️⃣ Calcular IVA (12% en Ecuador)
      const iva = (subtotal - discount) * 0.12;

      // 7️⃣ Calcular envío
      const shippingCost = this.calculateShipping(subtotal, shippingOption);

      // 8️⃣ Total final
      const total = subtotal - discount + iva + shippingCost;

      // 9️⃣ Crear orden en CRUD_API
      const orderData = {
        userId,
        items: orderItems,
        resumen: {
          subtotal,
          descuento: discount,
          iva,
          envio: shippingCost,
          total,
          itemCount: items.length
        },
        shippingOption,
        estado: 'pending_payment',
        fecha: new Date(),
        couponCode
      };

      const orderResponse = await axios.post(
        `${this.crudApi}/api/orders`,
        orderData
      );
      const orderId = orderResponse.data._id;

      // 🔟 Calcular y guardar puntos de lealtad (MATH_API)
      const loyaltyPoints = await axios.post(
        `${this.mathApi}/api/calculations/loyalty-points`,
        { userId, orderTotal: total }
      );

      // 1️⃣1️⃣ Actualizar inventario (reducir stock)
      for (const item of items) {
        await axios.put(
          `${this.crudApi}/api/products/${item.productId}`,
          { stock: products.find(p => p._id === item.productId).stock - item.quantity }
        );
      }

      return {
        success: true,
        orderId,
        order: orderResponse.data,
        loyaltyPoints: loyaltyPoints.data
      };

    } catch (error) {
      console.error('❌ Checkout error:', error.message);
      throw error;
    }
  }

  /**
   * Validar y aplicar cupón de descuento
   */
  async validateAndApplyCoupon(couponCode, subtotal) {
    // Lógica de validación de cupón
    // Por ahora es un stub
    const discounts = {
      'PROMO10': subtotal * 0.10,
      'PROMO20': subtotal * 0.20,
    };

    return discounts[couponCode] || 0;
  }

  /**
   * Calcular costo de envío
   */
  calculateShipping(subtotal, option) {
    if (option === 'express') return 5.00; // Envío express $5
    if (option === 'standard') return 2.00; // Envío estándar $2
    return 0; // Gratis si subtotal > $50
  }

  /**
   * Validar carrito antes de procesar
   */
  async validateCart(items) {
    if (!items || items.length === 0) {
      return { valid: false, error: 'Cart is empty' };
    }

    try {
      // Obtener productos actuales
      const productIds = items.map(i => i.productId);
      const response = await axios.get(`${this.crudApi}/api/products`, {
        params: { ids: productIds.join(',') }
      });

      // Validar stock
      for (const item of items) {
        const product = response.data.find(p => p._id === item.productId);
        if (!product) {
          return { valid: false, error: `Product ${item.productId} not found` };
        }
        if (product.stock < item.quantity) {
          return { valid: false, error: `Insufficient stock for ${product.nombre}` };
        }
      }

      return { valid: true };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
}

module.exports = CheckoutService;
