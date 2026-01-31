// shared/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  nombre: { type: String, required: true },
  apellido: { type: String },
  telefono: { type: String },
  cedula: { type: String },
  fotoPerfil: { type: String },
  isAdmin: { type: Boolean, default: false },
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
  fechaRegistro: { type: Date, default: Date.now },
  fechaModificacion: { type: Date, default: Date.now },
  loyaltyPoints: { type: Number, default: 0 },
  loyaltyTier: { type: String, enum: ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'], default: 'BRONZE' }
});

module.exports = mongoose.model('User', userSchema);
