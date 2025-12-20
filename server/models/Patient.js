const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientType: { type: String, enum: ['INDIVIDUAL', 'HOSPITAL'], required: true },
  hospitalName: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema);