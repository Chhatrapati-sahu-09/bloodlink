const mongoose = require('mongoose');

const bloodBankSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodBankName: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  contactNumber: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BloodBank', bloodBankSchema);