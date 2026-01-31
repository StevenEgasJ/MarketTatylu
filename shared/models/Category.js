// shared/models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  descripcion: { type: String },
  imagen: { type: String },
  activa: { type: Boolean, default: true },
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', categorySchema);
