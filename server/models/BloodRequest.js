const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  bloodBankId: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodBank' },
  bloodGroup: { type: String, required: true },
  unitsRequested: { type: Number, required: true },
  urgency: { type: String, enum: ['NORMAL', 'EMERGENCY'], default: 'NORMAL' },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'], default: 'PENDING' },
  requestedAt: { type: Date, default: Date.now },
  processedAt: { type: Date }
}, {
  timestamps: true
});

// Index for efficient querying
bloodRequestSchema.index({ status: 1, urgency: -1, requestedAt: 1 });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);