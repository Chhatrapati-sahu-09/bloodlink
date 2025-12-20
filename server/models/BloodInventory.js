const mongoose = require('mongoose');

const bloodInventorySchema = new mongoose.Schema({
  bloodBankId: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodBank', required: true },
  bloodGroup: { type: String, required: true },
  units: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  status: { type: String, enum: ['VALID', 'EXPIRED'], default: 'VALID' }
}, {
  timestamps: true
});

// Pre-save hook to auto-update status based on expiry
bloodInventorySchema.pre('save', function(next) {
  this.status = new Date() > this.expiryDate ? 'EXPIRED' : 'VALID';
  next();
});

module.exports = mongoose.model('BloodInventory', bloodInventorySchema);