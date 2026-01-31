// shared/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    nombre: String,
    precio: Number,
    cantidad: Number,
    subtotal: Number
  }],
  resumen: {
    subtotal: Number,
    descuento: Number,
    iva: Number,
    envio: Number,
    total: Number,
    itemCount: Number
  },
  estado: {
    type: String,
    enum: ['pending_payment', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending_payment'
  },
  shippingOption: { type: String, enum: ['standard', 'express'], default: 'standard' },
  couponCode: { type: String },
  fecha: { type: Date, default: Date.now },
  direccionEntrega: String,
  numeroSeguimiento: String,
  fechaEntrega: Date
});

module.exports = mongoose.model('Order', orderSchema);
